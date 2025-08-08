import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// PUT - Update storage location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const storageLocationId = parseInt(id);

    if (isNaN(storageLocationId)) {
      return NextResponse.json(
        { error: 'Invalid storage location ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Storage location name is required' },
        { status: 400 }
      );
    }

    const storageLocation = await prisma.storageLocation.update({
      where: { id: storageLocationId },
      data: {
        name,
        description: description || null,
        sortOrder: sortOrder || 0,
      }
    });

    return NextResponse.json({ storageLocation });
  } catch (error: any) {
    console.error('Error updating storage location:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A storage location with this name already exists' },
        { status: 400 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Storage location not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update storage location' },
      { status: 500 }
    );
  }
}

// DELETE - Delete storage location
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const storageLocationId = parseInt(id);

    if (isNaN(storageLocationId)) {
      return NextResponse.json(
        { error: 'Invalid storage location ID' },
        { status: 400 }
      );
    }

    // Check if storage location has maps associated with it
    const mapsCount = await prisma.map.count({
      where: { storageLocationId }
    });

    if (mapsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete storage location. It has ${mapsCount} maps associated with it.` },
        { status: 400 }
      );
    }

    await prisma.storageLocation.delete({
      where: { id: storageLocationId }
    });

    return NextResponse.json({ success: true, message: 'Storage location deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting storage location:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Storage location not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete storage location' },
      { status: 500 }
    );
  }
}