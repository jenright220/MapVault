import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// PUT - Update condition
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conditionId = parseInt(id);

    if (isNaN(conditionId)) {
      return NextResponse.json(
        { error: 'Invalid condition ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Condition name is required' },
        { status: 400 }
      );
    }

    const condition = await prisma.condition.update({
      where: { id: conditionId },
      data: {
        name,
        description: description || null,
        sortOrder: sortOrder || 0,
      }
    });

    return NextResponse.json({ condition });
  } catch (error: any) {
    console.error('Error updating condition:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A condition with this name already exists' },
        { status: 400 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Condition not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update condition' },
      { status: 500 }
    );
  }
}

// DELETE - Delete condition
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conditionId = parseInt(id);

    if (isNaN(conditionId)) {
      return NextResponse.json(
        { error: 'Invalid condition ID' },
        { status: 400 }
      );
    }

    // Check if condition has maps associated with it
    const mapsCount = await prisma.map.count({
      where: { conditionId }
    });

    if (mapsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete condition. It has ${mapsCount} maps associated with it.` },
        { status: 400 }
      );
    }

    await prisma.condition.delete({
      where: { id: conditionId }
    });

    return NextResponse.json({ success: true, message: 'Condition deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting condition:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Condition not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete condition' },
      { status: 500 }
    );
  }
}