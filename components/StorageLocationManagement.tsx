"use client";

import { Prisma } from '@prisma/client';

type StorageLocation = Prisma.StorageLocationGetPayload<{}>;
type Map = Prisma.MapGetPayload<{}>;

type StorageLocationWithMaps = StorageLocation & {
  maps: Pick<Map, 'id' | 'title'>[];
};

interface StorageLocationManagementProps {
  storageLocations: StorageLocationWithMaps[];
}

export default function StorageLocationManagement({ storageLocations }: StorageLocationManagementProps) {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Storage Locations Management - Coming Soon
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300">
          This management interface is being built. For now, storage locations are managed through the database seeding.
        </p>
      </div>

      <div className="grid gap-4">
        {storageLocations.map((location) => (
          <div
            key={location.id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {location.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {location.description} • {location.maps.length} map{location.maps.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}