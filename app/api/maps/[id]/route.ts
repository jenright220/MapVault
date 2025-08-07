import { NextRequest, NextResponse } from 'next/server';
import { unlink, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mapId = parseInt(params.id);
    
    if (isNaN(mapId)) {
      return NextResponse.json(
        { error: 'Invalid map ID' },
        { status: 400 }
      );
    }

    // Find the map to get image information before deletion
    const mapToDelete = await prisma.map.findUnique({
      where: { id: mapId },
      include: {
        images: true,
      },
    });

    if (!mapToDelete) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

    // Delete the map from database (this will cascade delete related images)
    await prisma.map.delete({
      where: { id: mapId },
    });

    // Clean up image files
    const uploadDir = join(process.cwd(), 'public/uploads');
    
    // Delete featured image if it exists
    if (mapToDelete.featuredImage) {
      const featuredImagePath = join(uploadDir, mapToDelete.featuredImage);
      if (existsSync(featuredImagePath)) {
        try {
          await unlink(featuredImagePath);
        } catch (error) {
          console.warn('Failed to delete featured image:', error);
        }
      }
    }

    // Delete additional images if any exist
    for (const image of mapToDelete.images) {
      const imagePath = join(uploadDir, image.filename);
      if (existsSync(imagePath)) {
        try {
          await unlink(imagePath);
        } catch (error) {
          console.warn('Failed to delete image:', error);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Map deleted successfully' 
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete map' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mapId = parseInt(params.id);
    
    if (isNaN(mapId)) {
      return NextResponse.json(
        { error: 'Invalid map ID' },
        { status: 400 }
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
    const isAvailable = formData.get('isAvailable') === 'true';
    
    // Private fields
    const purchasePrice = formData.get('purchasePrice') ? parseFloat(formData.get('purchasePrice') as string) : null;
    const purchaseDate = formData.get('purchaseDate') ? new Date(formData.get('purchaseDate') as string) : null;
    const vendorId = formData.get('vendorId') ? parseInt(formData.get('vendorId') as string) : null;
    const storageLocationId = formData.get('storageLocationId') ? parseInt(formData.get('storageLocationId') as string) : null;
    const storageNotes = formData.get('storageNotes') as string;
    const foldingStatus = formData.get('foldingStatus') as 'FLAT' | 'FOLDED' | 'ROLLED' | null;
    const privateNotes = formData.get('privateNotes') as string;

    // Check if map exists
    const existingMap = await prisma.map.findUnique({
      where: { id: mapId },
    });

    if (!existingMap) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

    // Handle new image upload
    const file = formData.get('featuredImage') as File | null;
    let featuredImage = existingMap.featuredImage; // Keep existing image by default

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

      // Delete old image if it exists
      if (existingMap.featuredImage) {
        const oldImagePath = join(uploadDir, existingMap.featuredImage);
        if (existsSync(oldImagePath)) {
          try {
            await unlink(oldImagePath);
          } catch (error) {
            console.warn('Failed to delete old image:', error);
          }
        }
      }

      featuredImage = filename;
    }

    // Validate required fields
    if (!title || !price || !categoryId || !conditionId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, price, categoryId, conditionId' },
        { status: 400 }
      );
    }

    // Update map record
    const updatedMap = await prisma.map.update({
      where: { id: mapId },
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

    return NextResponse.json({ success: true, map: updatedMap });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update map' },
      { status: 500 }
    );
  }
}