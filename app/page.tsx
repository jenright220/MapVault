import { prisma } from '@/lib/prisma';
import MapsTable from '@/components/MapsTable';
import { isAuthenticated } from '@/lib/auth';

export default async function Home() {
  const [maps, isAdmin] = await Promise.all([
    prisma.map.findMany({
      include: {
        category: true,
        condition: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),
    isAuthenticated()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Antique Map Collection
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Explore our curated collection of historical maps and charts
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {maps.length} {maps.length === 1 ? 'map' : 'maps'} total
            </div>
            {isAdmin && (
              <a 
                href="/admin/upload"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 font-medium transition-colors"
              >
                Add New Map
              </a>
            )}
          </div>
        </div>
      </div>

      <MapsTable maps={maps} />
    </div>
  );
}