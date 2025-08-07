import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get search parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const yearFrom = searchParams.get('yearFrom') || '';
    const yearTo = searchParams.get('yearTo') || '';
    const mapmaker = searchParams.get('mapmaker') || '';
    const region = searchParams.get('region') || '';
    const condition = searchParams.get('condition') || '';
    const featured = searchParams.get('featured') || '';
    const available = searchParams.get('available') || '';
    
    // Build where clause for filtering
    const where: any = {};
    
    // Text search in title, description, mapmaker, and region
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { mapmaker: { contains: query } },
        { region: { contains: query } },
      ];
    }
    
    // Category filter
    if (category && !isNaN(parseInt(category))) {
      where.categoryId = parseInt(category);
    }
    
    // Year range filter
    if (yearFrom || yearTo) {
      where.yearCreated = {};
      if (yearFrom && !isNaN(parseInt(yearFrom))) {
        where.yearCreated.gte = parseInt(yearFrom);
      }
      if (yearTo && !isNaN(parseInt(yearTo))) {
        where.yearCreated.lte = parseInt(yearTo);
      }
    }
    
    // Mapmaker filter
    if (mapmaker) {
      where.mapmaker = { contains: mapmaker };
    }
    
    // Region filter
    if (region) {
      where.region = { contains: region };
    }
    
    // Condition filter
    if (condition && !isNaN(parseInt(condition))) {
      where.conditionId = parseInt(condition);
    }
    
    // Featured filter
    if (featured === 'true') {
      where.isFeatured = true;
    } else if (featured === 'false') {
      where.isFeatured = false;
    }
    
    // Availability filter
    if (available === 'true') {
      where.isAvailable = true;
    } else if (available === 'false') {
      where.isAvailable = false;
    }

    // Get maps with filters
    const maps = await prisma.map.findMany({
      where,
      include: {
        category: true,
        condition: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Get filter options for the frontend
    const [categories, conditions, mapmakers, regions] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.condition.findMany({
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.map.findMany({
        where: {
          mapmaker: { not: null }
        },
        select: { mapmaker: true },
        distinct: ['mapmaker']
      }),
      prisma.map.findMany({
        where: {
          region: { not: null }
        },
        select: { region: true },
        distinct: ['region']
      })
    ]);

    return NextResponse.json({
      maps,
      filters: {
        categories,
        conditions,
        mapmakers: mapmakers.map(m => m.mapmaker).filter(Boolean).sort(),
        regions: regions.map(r => r.region).filter(Boolean).sort()
      },
      total: maps.length
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}