import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET - List all storage locations
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const storageLocations = await prisma.storageLocation.findMany({
      include: {
        maps: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ storageLocations });
  } catch (error) {
    console.error('Error fetching storage locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storage locations' },
      { status: 500 }
    );
  }
}

// POST - Create new storage location
export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Storage location name is required' },
        { status: 400 }
      );
    }

    const storageLocation = await prisma.storageLocation.create({
      data: {
        name,
        description: description || null,
        sortOrder: sortOrder || 0,
      }
    });

    return NextResponse.json({ storageLocation });
  } catch (error: any) {
    console.error('Error creating storage location:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A storage location with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create storage location' },
      { status: 500 }
    );
  }
}