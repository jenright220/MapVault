import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, sortOrder, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description: description || null,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category has maps associated with it
    const mapsCount = await prisma.map.count({
      where: { categoryId }
    });

    if (mapsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It has ${mapsCount} maps associated with it.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}