// Script to create test users for carrier, shipper, and admin
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://isofttechs786:isbDiploma@cluster0.fxmtb.mongodb.net/lfl-logistics?retryWrites=true&w=majority&appName=Cluster0';

async function createTestUsers() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db('lfllogistics');

        // Password for all test accounts: TestPass123
        const testPassword = 'TestPass123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        console.log('\n🔐 Test Password for all accounts: TestPass123\n');

        // 1. Create Admin User
        console.log('👤 Creating Admin User...');
        const adminEmail = 'admin@lfllogistics.com';

        // Check if admin exists
        const existingAdmin = await db.collection('users').findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️  Admin already exists');
        } else {
            await db.collection('users').insertOne({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Admin created:', adminEmail);
        }

        // 2. Create Test Carrier
        console.log('\n🚚 Creating Test Carrier...');
        const carrierEmail = 'testcarrier@example.com';

        // Check if carrier exists
        const existingCarrier = await db.collection('users').findOne({ email: carrierEmail });
        if (existingCarrier) {
            console.log('⚠️  Test carrier already exists');
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
            console.log('✅ Carrier record created with ID:', carrierResult.insertedId);

            const userResult = await db.collection('users').insertOne({
                email: carrierEmail,
                password: hashedPassword,
                role: 'carrier',
                status: 'approved',
                carrierData: carrierResult.insertedId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Carrier user created with ID:', userResult.insertedId);

            await db.collection('carriers').updateOne(
                { _id: carrierResult.insertedId },
                { $set: { userId: userResult.insertedId } }
            );
            console.log('🔗 Carrier and user linked');
        }

        // 3. Create Test Shipper
        console.log('\n📦 Creating Test Shipper...');
        const shipperEmail = 'testshipper@example.com';

        // Check if shipper exists
        const existingShipper = await db.collection('users').findOne({ email: shipperEmail });
        if (existingShipper) {
            console.log('⚠️  Test shipper already exists');
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
            console.log('✅ Shipper record created with ID:', shipperResult.insertedId);

            const userResult = await db.collection('users').insertOne({
                email: shipperEmail,
                password: hashedPassword,
                role: 'shipper',
                status: 'approved',
                shipperData: shipperResult.insertedId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Shipper user created with ID:', userResult.insertedId);

            await db.collection('shippers').updateOne(
                { _id: shipperResult.insertedId },
                { $set: { userId: userResult.insertedId } }
            );
            console.log('🔗 Shipper and user linked');
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 Test Users Created Successfully!');
        console.log('='.repeat(60));
        console.log('\n📋 LOGIN CREDENTIALS:\n');
        console.log('1️⃣  ADMIN:');
        console.log('   Email: admin@lfllogistics.com');
        console.log('   Password: TestPass123');
        console.log('   URL: https://longfreight.vercel.app/login\n');

        console.log('2️⃣  TEST CARRIER:');
        console.log('   Email: testcarrier@example.com');
        console.log('   Password: TestPass123');
        console.log('   URL: https://longfreight.vercel.app/carrier-dashboard\n');

        console.log('3️⃣  TEST SHIPPER:');
        console.log('   Email: testshipper@example.com');
        console.log('   Password: TestPass123');
        console.log('   URL: https://longfreight.vercel.app/shipper-dashboard\n');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Error creating test users:', error);
    } finally {
        await client.close();
        console.log('\n✅ Database connection closed');
    }
}

createTestUsers();
