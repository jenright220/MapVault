import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// PUT - Update vendor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const vendorId = parseInt(id);
    if (isNaN(vendorId)) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, contactInfo, notes, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Vendor name is required' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name,
        contactInfo: contactInfo || null,
        notes: notes || null,
        isActive: isActive !== undefined ? isActive : undefined,
      }
    });

    return NextResponse.json({ vendor });
  } catch (error) {
    console.error('Error updating vendor:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A vendor with this name already exists' },
        { status: 400 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const vendorId = parseInt(id);
    if (isNaN(vendorId)) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 });
    }

    // Check if vendor is used by any maps
    const mapsUsingVendor = await prisma.map.count({
      where: { vendorId: vendorId }
    });

    if (mapsUsingVendor > 0) {
      // Instead of deleting, deactivate the vendor
      const vendor = await prisma.vendor.update({
        where: { id: vendorId },
        data: { isActive: false }
      });
      
      return NextResponse.json({ 
        vendor,
        message: `Vendor deactivated (used by ${mapsUsingVendor} map${mapsUsingVendor === 1 ? '' : 's'})` 
      });
    } else {
      // Safe to delete
      await prisma.vendor.delete({
        where: { id: vendorId }
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'Vendor deleted successfully' 
      });
    }
  } catch (error) {
    console.error('Error deleting vendor:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}