"use client";

import { Prisma } from '@prisma/client';

type Map = Prisma.MapGetPayload<{}>;
type Category = Prisma.CategoryGetPayload<{}>;
type Condition = Prisma.ConditionGetPayload<{}>;
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

type MapWithRelations = Map & {
  category: Category;
  condition: Condition;
};

interface MapsTableProps {
  maps: MapWithRelations[];
}

export default function MapsTable({ maps }: MapsTableProps) {
  const { isAuthenticated } = useAuth();
  
  if (maps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📍</span>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No maps in collection</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          {isAuthenticated 
            ? "Get started by adding your first antique map to the collection." 
            : "This collection is currently empty. Check back later for new additions!"
          }
        </p>
        {isAuthenticated && (
          <Link 
            href="/admin/upload"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
          >
            Add Your First Map
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {maps.map((map) => (
          <Link 
            key={map.id} 
            href={`/maps/${map.id}`}
            className="block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                  {map.featuredImage ? (
                    <Image
                      src={`/uploads/${map.featuredImage}`}
                      alt={map.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="text-2xl">🗺️</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">{map.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{map.category.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-amber-600">${map.price}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      map.isAvailable 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {map.isAvailable ? 'Available' : 'Sold'}
                    </span>
                  </div>
                  {map.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{map.description}</p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Map
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {maps.map((map) => (
              <tr key={map.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/maps/${map.id}`} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                      {map.featuredImage ? (
                        <Image
                          src={`/uploads/${map.featuredImage}`}
                          alt={map.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="text-xl">🗺️</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400">
                        {map.title}
                      </div>
                      {map.region && (
                        <div className="text-sm text-slate-500 dark:text-slate-400">{map.region}</div>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                  {map.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {map.yearCreated || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {map.condition.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-amber-600">
                  ${map.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                    map.isAvailable 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}>
                    {map.isAvailable ? 'Available' : 'Sold'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}