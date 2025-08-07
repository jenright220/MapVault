import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DeleteMapButton from '@/components/DeleteMapButton';
import EditMapButton from '@/components/EditMapButton';
import { isAuthenticated } from '@/lib/auth';

interface MapDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MapDetailPage({ params }: MapDetailPageProps) {
  const { id } = await params;
  const mapId = parseInt(id);
  
  if (isNaN(mapId)) {
    notFound();
  }

  const [map, isAdmin] = await Promise.all([
    prisma.map.findUnique({
      where: { id: mapId },
      include: {
        category: true,
        condition: true,
        vendor: true,
        storageLocation: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    }),
    isAuthenticated()
  ]);

  if (!map) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/"
        className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
            {map.featuredImage ? (
              <Image
                src={`/uploads/${map.featuredImage}`}
                alt={map.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-slate-400">
                🗺️
              </div>
            )}
          </div>
          
          {/* Additional Images */}
          {map.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {map.images.map((image) => (
                <div key={image.id} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                  <Image
                    src={`/uploads/${image.filename}`}
                    alt={image.description || map.title}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {map.title}
            </h1>
            {map.region && (
              <p className="text-lg text-slate-600 dark:text-slate-300">{map.region}</p>
            )}
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-amber-600">
              ${map.price}
            </div>
            <span className={`px-4 py-2 rounded-full font-medium ${
              map.isAvailable 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              {map.isAvailable ? 'Available' : 'Sold'}
            </span>
          </div>

          {/* Description */}
          {map.description && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{map.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Category</h4>
              <p className="text-slate-600 dark:text-slate-300">{map.category.name}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Condition</h4>
              <p className="text-slate-600 dark:text-slate-300">{map.condition.name}</p>
            </div>
            
            {map.yearCreated && (
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Year Created</h4>
                <p className="text-slate-600 dark:text-slate-300">{map.yearCreated}</p>
              </div>
            )}
            
            {map.mapmaker && (
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Mapmaker</h4>
                <p className="text-slate-600 dark:text-slate-300">{map.mapmaker}</p>
              </div>
            )}
            
            {map.dimensions && (
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Dimensions</h4>
                <p className="text-slate-600 dark:text-slate-300">{map.dimensions}</p>
              </div>
            )}
          </div>

          {/* Featured Badge */}
          {map.isFeatured && (
            <div className="inline-flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-full text-sm font-medium">
              ⭐ Featured Map
            </div>
          )}

          {/* Admin Information (Private) - Only show if authenticated */}
          {isAdmin && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {map.purchasePrice && (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Purchase Price</h4>
                  <p className="text-slate-600 dark:text-slate-300">${map.purchasePrice}</p>
                </div>
              )}
              
              {map.purchaseDate && (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Purchase Date</h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    {new Date(map.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {map.vendor && (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Vendor</h4>
                  <p className="text-slate-600 dark:text-slate-300">{map.vendor.name}</p>
                </div>
              )}
              
              {map.storageLocation && (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Storage Location</h4>
                  <p className="text-slate-600 dark:text-slate-300">{map.storageLocation.name}</p>
                </div>
              )}
              
              {map.foldingStatus && (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Folding Status</h4>
                  <p className="text-slate-600 dark:text-slate-300 capitalize">
                    {map.foldingStatus.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
            
            {(map.storageNotes || map.privateNotes) && (
              <div className="space-y-3">
                {map.storageNotes && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Storage Notes</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{map.storageNotes}</p>
                  </div>
                )}
                
                {map.privateNotes && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Private Notes</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{map.privateNotes}</p>
                  </div>
                )}
              </div>
            )}

              {/* Edit and Delete Actions */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                      Admin Actions
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Edit map information or remove from collection
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    <EditMapButton mapId={map.id} />
                    <DeleteMapButton mapId={map.id} mapTitle={map.title} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}