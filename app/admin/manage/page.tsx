import Link from 'next/link';
import { ArrowLeft, Settings, Tag, Award, Store, Archive } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function AdminManagePage() {
  // Get counts for each reference table
  const [categoriesCount, conditionsCount, vendorsCount, storageLocationsCount] = await Promise.all([
    prisma.category.count({ where: { isActive: true } }),
    prisma.condition.count(),
    prisma.vendor.count({ where: { isActive: true } }),
    prisma.storageLocation.count({ where: { isActive: true } })
  ]);

  const managementItems = [
    {
      title: 'Categories',
      description: 'Manage map categories (World Maps, City Maps, etc.)',
      href: '/admin/manage/categories',
      icon: Tag,
      count: categoriesCount,
      color: 'bg-blue-500'
    },
    {
      title: 'Conditions',
      description: 'Manage condition ratings (Mint, Fine, Good, etc.)',
      href: '/admin/manage/conditions',
      icon: Award,
      count: conditionsCount,
      color: 'bg-green-500'
    },
    {
      title: 'Vendors',
      description: 'Manage map vendors and supplier information',
      href: '/admin/manage/vendors',
      icon: Store,
      count: vendorsCount,
      color: 'bg-purple-500'
    },
    {
      title: 'Storage Locations',
      description: 'Manage physical storage locations and organization',
      href: '/admin/manage/storage',
      icon: Archive,
      count: storageLocationsCount,
      color: 'bg-orange-500'
    }
  ];

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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-slate-700 dark:bg-slate-600 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Admin Management
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Manage categories, conditions, vendors, and storage locations
            </p>
          </div>
        </div>
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managementItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {item.count}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {item.count === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-amber-600 dark:text-amber-400 text-sm font-medium group-hover:text-amber-700 dark:group-hover:text-amber-300">
                Manage {item.title} →
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/upload"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
          >
            Add New Map
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
          >
            View Collection
          </Link>
        </div>
      </div>
    </div>
  );
}