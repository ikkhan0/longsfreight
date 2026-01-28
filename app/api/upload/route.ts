import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Max file size: 5MB (stays under MongoDB 16MB document limit after Base64 encoding)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
];

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userRole = (session.user as any).role;
        if (!['carrier', 'shipper'].includes(userRole)) {
            return NextResponse.json(
                { error: 'Invalid user role' },
                { status: 403 }
            );
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF, JPG, and PNG files are allowed.' },
                { status: 400 }
            );
        }

        // Convert file to buffer and then to Base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');

        // Create data URL for browser compatibility
        const dataUrl = `data:${file.type};base64,${base64Data}`;

        console.log(`✅ File converted to Base64: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

        return NextResponse.json({
            success: true,
            url: dataUrl,
            fileName: file.name,
            fileType: file.type,
            size: file.size,
        });

    } catch (error) {
        console.error('❌ Upload error:', error);
        return NextResponse.json(
            {
                error: 'Upload failed',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
}
