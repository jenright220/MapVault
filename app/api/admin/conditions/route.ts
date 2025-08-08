import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET - List all conditions
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conditions = await prisma.condition.findMany({
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

    return NextResponse.json({ conditions });
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conditions' },
      { status: 500 }
    );
  }
}

// POST - Create new condition
export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Condition name is required' },
        { status: 400 }
      );
    }

    const condition = await prisma.condition.create({
      data: {
        name,
        description: description || null,
        sortOrder: sortOrder || 0,
      }
    });

    return NextResponse.json({ condition });
  } catch (error: any) {
    console.error('Error creating condition:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A condition with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create condition' },
      { status: 500 }
    );
  }
}