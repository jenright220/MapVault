import { prisma } from '@/lib/prisma';
import UploadForm from '@/components/UploadForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function UploadPage() {
  // Fetch all dropdown data
  const [categories, conditions, vendors, storageLocations] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.condition.findMany({
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.vendor.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    }),
    prisma.storageLocation.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/"
        className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Collection</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Add New Map
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Add a new antique map to your collection with detailed information and images
        </p>
      </div>

      <UploadForm 
        categories={categories}
        conditions={conditions}
        vendors={vendors}
        storageLocations={storageLocations}
      />
    </div>
  );
}