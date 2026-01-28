import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { CarrierData } from '@/types';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { notifyAdminNewCarrier } from '@/lib/notifications';
import { analyzeProfile } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            dotNumber,
            mcNumber,
            authorityDate,
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
            equipmentTypes,
            preferredLanes,
            password,
        } = body;

        // Detailed field validation with specific error messages
        const missingFields: string[] = [];

        if (!dotNumber) missingFields.push('DOT Number');
        if (!mcNumber) missingFields.push('MC Number');
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

        console.log('🔄 Attempting carrier registration for:', contactEmail);

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
            aiAnalysis = await analyzeProfile('carrier', body);
            console.log('🤖 AI analysis completed');
        } catch (aiError) {
            console.warn('⚠️ AI analysis failed (non-critical):', aiError);
            // Continue without AI analysis
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔒 Password hashed successfully');

        // Create carrier data
        const carrierData: CarrierData = {
            dotNumber,
            mcNumber,
            authorityDate,
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
            equipmentTypes: equipmentTypes || [],
            preferredLanes: preferredLanes || [],
            documents: {},
            status: 'pending',
            onboardingCompleted: true,
            aiAnalysis: aiAnalysis || undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Insert carrier
        console.log('📝 Creating carrier record...');
        const carrierResult = await db.collection('carriers').insertOne(carrierData);
        console.log('✅ Carrier created with ID:', carrierResult.insertedId);

        // Create user account
        console.log('👤 Creating user account...');
        const userResult = await db.collection('users').insertOne({
            email: contactEmail,
            password: hashedPassword,
            role: 'carrier',
            status: 'pending',
            carrierData: carrierResult.insertedId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('✅ User account created with ID:', userResult.insertedId);

        // Update carrier with userId reference
        await db.collection('carriers').updateOne(
            { _id: carrierResult.insertedId },
            { $set: { userId: userResult.insertedId } }
        );
        console.log('🔗 Carrier and user accounts linked');

        // Send notification to admin (non-blocking)
        try {
            await notifyAdminNewCarrier(carrierData, carrierResult.insertedId);
            console.log('📧 Admin notification sent');
        } catch (notifyError) {
            console.warn('⚠️ Failed to send admin notification (non-critical):', notifyError);
            // Continue even if notification fails
        }

        console.log('🎉 Carrier registration completed successfully');

        return NextResponse.json({
            success: true,
            message: 'Registration successful! Your application is pending admin approval.',
            carrierId: carrierResult.insertedId,
        });
    } catch (error) {
        console.error('❌ Carrier onboarding error:', error);
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
