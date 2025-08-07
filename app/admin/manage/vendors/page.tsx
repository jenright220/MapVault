import Link from 'next/link';
import { ArrowLeft, Store } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import VendorManagement from '@/components/VendorManagement';

export default async function VendorsManagePage() {
  const vendors = await prisma.vendor.findMany({
    include: {
      maps: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: [
      { isActive: 'desc' },
      { name: 'asc' }
    ]
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/admin/manage"
        className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Management</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Manage Vendors
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Add, edit, and organize your map vendors and suppliers
            </p>
          </div>
        </div>
      </div>

      <VendorManagement vendors={vendors} />
    </div>
  );
}