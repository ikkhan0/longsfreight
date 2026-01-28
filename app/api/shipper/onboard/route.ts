import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ShipperData } from '@/types';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { notifyAdminNewShipper } from '@/lib/notifications';
import { analyzeProfile } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            legalName,
            dbaName,
            ein,
            address,
            city,
            state,
            zip,
            contactName,
            contactEmail,
            contactPhone,
            commodityType,
            monthlyVolume,
            averageValue,
            preferredEquipment,
            password,
        } = body;

        // Detailed field validation with specific error messages
        const missingFields: string[] = [];

        if (!legalName) missingFields.push('Legal Company Name');
        if (!contactEmail) missingFields.push('Contact Email');
        if (!contactPhone) missingFields.push('Contact Phone');
        if (!password) missingFields.push('Password');
        if (!city) missingFields.push('City');
        if (!state) missingFields.push('State');

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    error: 'Missing required fields',
                    missingFields: missingFields,
                    message: `Please fill in the following required fields: ${missingFields.join(', ')}`
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            return NextResponse.json(
                { error: 'Invalid email format', message: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Weak password', message: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        console.log('🔄 Attempting shipper registration for:', contactEmail);

        const db = await getDatabase();
        console.log('✅ Database connection established');

        // Check if email already exists
        const existingUser = await db.collection('users').findOne({ email: contactEmail });
        if (existingUser) {
            return NextResponse.json(
                {
                    error: 'Email already registered',
                    message: 'This email is already registered. Please use a different email or try logging in.'
                },
                { status: 409 }
            );
        }

        // Get AI analysis if available (non-blocking)
        let aiAnalysis;
        try {
            aiAnalysis = await analyzeProfile('shipper', body);
            console.log('🤖 AI analysis completed');
        } catch (aiError) {
            console.warn('⚠️ AI analysis failed (non-critical):', aiError);
            // Continue without AI analysis
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔒 Password hashed successfully');

        // Create shipper data
        const shipperData: ShipperData = {
            legalName,
            dbaName: dbaName || '',
            ein: ein || '',
            address: address || '',
            city,
            state,
            zip: zip || '',
            contactName: contactName || '',
            contactEmail,
            contactPhone,
            commodityType: commodityType || '',
            monthlyVolume: monthlyVolume || '',
            averageValue: averageValue || '',
            preferredEquipment: preferredEquipment || [],
            documents: {},
            status: 'pending',
            onboardingCompleted: true,
            aiAnalysis: aiAnalysis || undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Insert shipper
        console.log('📝 Creating shipper record...');
        const shipperResult = await db.collection('shippers').insertOne(shipperData);
        console.log('✅ Shipper created with ID:', shipperResult.insertedId);

        // Create user account
        console.log('👤 Creating user account...');
        const userResult = await db.collection('users').insertOne({
            email: contactEmail,
            password: hashedPassword,
            role: 'shipper',
            status: 'pending',
            shipperData: shipperResult.insertedId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('✅ User account created with ID:', userResult.insertedId);

        // Update shipper with userId reference
        await db.collection('shippers').updateOne(
            { _id: shipperResult.insertedId },
            { $set: { userId: userResult.insertedId } }
        );
        console.log('🔗 Shipper and user accounts linked');

        // Send notification to admin (non-blocking)
        try {
            await notifyAdminNewShipper(shipperData, shipperResult.insertedId);
            console.log('📧 Admin notification sent');
        } catch (notifyError) {
            console.warn('⚠️ Failed to send admin notification (non-critical):', notifyError);
            // Continue even if notification fails
        }

        console.log('🎉 Shipper registration completed successfully');

        return NextResponse.json({
            success: true,
            message: 'Registration successful! Your application is pending admin approval.',
            shipperId: shipperResult.insertedId,
        });
    } catch (error) {
        console.error('❌ Shipper onboarding error:', error);
        console.error('Error details:', {
            name: (error as Error).name,
            message: (error as Error).message,
            stack: (error as Error).stack
        });

        return NextResponse.json(
            {
                error: 'Registration failed',
                message: 'An error occurred during registration. Please try again later.',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            },
            { status: 500 }
        );
    }
}
