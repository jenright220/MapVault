import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditMapForm from '@/components/EditMapForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditMapPageProps {
  params: {
    id: string;
  };
}

export default async function EditMapPage({ params }: EditMapPageProps) {
  const { id } = await params;
  const mapId = parseInt(id);
  
  if (isNaN(mapId)) {
    notFound();
  }

  // Fetch the map to edit
  const map = await prisma.map.findUnique({
    where: { id: mapId },
    include: {
      category: true,
      condition: true,
      vendor: true,
      storageLocation: true,
    }
  });

  if (!map) {
    notFound();
  }

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
        href={`/maps/${map.id}`}
        className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Map Details</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Edit Map: {map.title}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Update the information and details for this map in your collection
        </p>
      </div>

      <EditMapForm 
        map={map}
        categories={categories}
        conditions={conditions}
        vendors={vendors}
        storageLocations={storageLocations}
      />
    </div>
  );
}