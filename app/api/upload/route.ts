import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = parseInt(formData.get('categoryId') as string);
    const conditionId = parseInt(formData.get('conditionId') as string);
    const yearCreated = formData.get('yearCreated') ? parseInt(formData.get('yearCreated') as string) : null;
    const region = formData.get('region') as string;
    const dimensions = formData.get('dimensions') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const isAvailable = formData.get('isAvailable') !== 'false'; // default to true
    
    // Private fields
    const purchasePrice = formData.get('purchasePrice') ? parseFloat(formData.get('purchasePrice') as string) : null;
    const purchaseDate = formData.get('purchaseDate') ? new Date(formData.get('purchaseDate') as string) : null;
    const vendorId = formData.get('vendorId') ? parseInt(formData.get('vendorId') as string) : null;
    const storageLocationId = formData.get('storageLocationId') ? parseInt(formData.get('storageLocationId') as string) : null;
    const storageNotes = formData.get('storageNotes') as string;
    const foldingStatus = formData.get('foldingStatus') as 'FLAT' | 'FOLDED' | 'ROLLED' | null;
    const privateNotes = formData.get('privateNotes') as string;

    // Handle file upload
    const file = formData.get('featuredImage') as File | null;
    let featuredImage = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public/uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalExtension = file.name.split('.').pop();
      const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${originalExtension}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      featuredImage = filename;
    }

    // Validate required fields
    if (!title || !price || !categoryId || !conditionId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, price, categoryId, conditionId' },
        { status: 400 }
      );
    }

    // Create map record
    const newMap = await prisma.map.create({
      data: {
        title,
        description: description || null,
        price,
        categoryId,
        conditionId,
        yearCreated,
        region: region || null,
        dimensions: dimensions || null,
        featuredImage,
        isFeatured,
        isAvailable,
        purchasePrice,
        purchaseDate,
        vendorId,
        storageLocationId,
        storageNotes: storageNotes || null,
        foldingStatus,
        privateNotes: privateNotes || null,
      },
      include: {
        category: true,
        condition: true,
      },
    });

    return NextResponse.json({ success: true, map: newMap });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to create map record' },
      { status: 500 }
    );
  }
}