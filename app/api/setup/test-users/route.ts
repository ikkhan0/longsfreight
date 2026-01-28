import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// This route creates test users for development/testing
// Access via: /api/setup/test-users

export async function GET(request: NextRequest) {
    try {
        const db = await getDatabase();

        // Password for all test accounts: TestPass123
        const testPassword = 'TestPass123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        const results = {
            admin: null as any,
            carrier: null as any,
            shipper: null as any,
        };

        // 1. Create Admin User
        const adminEmail = 'admin@lfllogistics.com';
        const existingAdmin = await db.collection('users').findOne({ email: adminEmail });

        if (existingAdmin) {
            results.admin = { status: 'exists', email: adminEmail };
        } else {
            await db.collection('users').insertOne({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            results.admin = { status: 'created', email: adminEmail };
        }

        // 2. Create Test Carrier
        const carrierEmail = 'testcarrier@example.com';
        const existingCarrierUser = await db.collection('users').findOne({ email: carrierEmail });

        if (existingCarrierUser) {
            results.carrier = { status: 'exists', email: carrierEmail };
        } else {
            const carrierData = {
                dotNumber: '1234567',
                mcNumber: 'MC123456',
                authorityDate: '2024-01-01',
                legalName: 'Test Carrier LLC',
                dbaName: 'Test Transport',
                ein: '12-3456789',
                address: '123 Carrier Street',
                city: 'Charlotte',
                state: 'NC',
                zip: '28202',
                contactName: 'John Carrier',
                contactEmail: carrierEmail,
                contactPhone: '(704) 555-0100',
                equipmentTypes: ['Dry Van', 'Refrigerated'],
                preferredLanes: ['Southeast', 'Northeast'],
                documents: {},
                status: 'approved',
                onboardingCompleted: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const carrierResult = await db.collection('carriers').insertOne(carrierData);

            const userResult = await db.collection('users').insertOne({
                email: carrierEmail,
                password: hashedPassword,
                role: 'carrier',
                status: 'approved',
                carrierData: carrierResult.insertedId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await db.collection('carriers').updateOne(
                { _id: carrierResult.insertedId },
                { $set: { userId: userResult.insertedId } }
            );

            results.carrier = {
                status: 'created',
                email: carrierEmail,
                carrierId: carrierResult.insertedId,
                userId: userResult.insertedId
            };
        }

        // 3. Create Test Shipper
        const shipperEmail = 'testshipper@example.com';
        const existingShipperUser = await db.collection('users').findOne({ email: shipperEmail });

        if (existingShipperUser) {
            results.shipper = { status: 'exists', email: shipperEmail };
        } else {
            const shipperData = {
                legalName: 'Test Shipper Corp',
                dbaName: 'Test Logistics',
                ein: '98-7654321',
                address: '456 Shipper Avenue',
                city: 'Atlanta',
                state: 'GA',
                zip: '30303',
                contactName: 'Jane Shipper',
                contactEmail: shipperEmail,
                contactPhone: '(404) 555-0200',
                commodityType: 'General Freight',
                monthlyVolume: '50-100 loads',
                averageValue: '$50,000',
                preferredEquipment: ['Dry Van', 'Flatbed'],
                documents: {},
                status: 'approved',
                onboardingCompleted: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const shipperResult = await db.collection('shippers').insertOne(shipperData);

            const userResult = await db.collection('users').insertOne({
                email: shipperEmail,
                password: hashedPassword,
                role: 'shipper',
                status: 'approved',
                shipperData: shipperResult.insertedId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await db.collection('shippers').updateOne(
                { _id: shipperResult.insertedId },
                { $set: { userId: userResult.insertedId } }
            );

            results.shipper = {
                status: 'created',
                email: shipperEmail,
                shipperId: shipperResult.insertedId,
                userId: userResult.insertedId
            };
        }

        return NextResponse.json({
            success: true,
            message: 'Test users setup complete',
            password: testPassword,
            results,
            credentials: {
                admin: {
                    email: 'admin@lfllogistics.com',
                    password: testPassword,
                    url: 'https://longfreight.vercel.app/login'
                },
                carrier: {
                    email: 'testcarrier@example.com',
                    password: testPassword,
                    url: 'https://longfreight.vercel.app/carrier-dashboard'
                },
                shipper: {
                    email: 'testshipper@example.com',
                    password: testPassword,
                    url: 'https://longfreight.vercel.app/shipper-dashboard'
                }
            }
        });

    } catch (error) {
        console.error('Error creating test users:', error);
        return NextResponse.json(
            {
                error: 'Failed to create test users',
                details: (error as Error).message
            },
            { status: 500 }
        );
    }
}
