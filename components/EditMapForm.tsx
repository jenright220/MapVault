"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Prisma } from '@prisma/client';

type Map = Prisma.MapGetPayload<{}>;
type Category = Prisma.CategoryGetPayload<{}>;
type Condition = Prisma.ConditionGetPayload<{}>;
type Vendor = Prisma.VendorGetPayload<{}>;
type StorageLocation = Prisma.StorageLocationGetPayload<{}>;

type MapWithRelations = Map & {
  category: Category;
  condition: Condition;
  vendor?: Vendor | null;
  storageLocation?: StorageLocation | null;
};

interface EditMapFormProps {
  map: MapWithRelations;
  categories: Category[];
  conditions: Condition[];
  vendors: Vendor[];
  storageLocations: StorageLocation[];
}

export default function EditMapForm({ map, categories, conditions, vendors, storageLocations }: EditMapFormProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`/mapvault/api/maps/${map.id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/maps/${map.id}`);
        router.refresh();
      } else {
        setError(result.error || 'Failed to update map');
      }
    } catch (err) {
      setError('Failed to update map');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={map.title}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="Enter map title"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={map.description || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="Describe the map, its historical significance, etc."
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={map.categoryId}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="conditionId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Condition *
            </label>
            <select
              id="conditionId"
              name="conditionId"
              required
              defaultValue={map.conditionId}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
            >
              {conditions.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Selling Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              required
              defaultValue={map.price}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="yearCreated" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Year Created
            </label>
            <input
              type="number"
              id="yearCreated"
              name="yearCreated"
              min="1000"
              max="2024"
              defaultValue={map.yearCreated || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="e.g., 1825"
            />
          </div>

          <div>
            <label htmlFor="mapmaker" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Mapmaker / Publisher
            </label>
            <input
              type="text"
              id="mapmaker"
              name="mapmaker"
              defaultValue={map.mapmaker || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="e.g., John Smith, Rand McNally"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Region
            </label>
            <input
              type="text"
              id="region"
              name="region"
              defaultValue={map.region || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="e.g., North America, Europe"
            />
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Dimensions
            </label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              defaultValue={map.dimensions || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="e.g., 24 x 36 inches"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              value="true"
              defaultChecked={map.isFeatured}
              className="rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
              Featured map (show prominently on homepage)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              value="true"
              defaultChecked={map.isAvailable}
              className="rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="isAvailable" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
              Available for sale
            </label>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Featured Image</h2>
        {map.featuredImage && (
          <div className="mb-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">Current image:</p>
            <img
                              src={`/mapvault/uploads/${map.featuredImage}`}
              alt={map.title}
              className="w-32 h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
            />
          </div>
        )}
        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Upload New Image (optional)
          </label>
          <input
            type="file"
            id="featuredImage"
            name="featuredImage"
            accept="image/*"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-900 dark:file:text-amber-100"
          />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Leave empty to keep current image. New image will replace the existing one.
          </p>
        </div>
      </div>

      {/* Private/Admin Information */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Admin Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Purchase Price
            </label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              step="0.01"
              min="0"
              defaultValue={map.purchasePrice || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="What you paid for it"
            />
          </div>

          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              defaultValue={formatDateForInput(map.purchaseDate)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="vendorId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Vendor
            </label>
            <select
              id="vendorId"
              name="vendorId"
              defaultValue={map.vendorId || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="storageLocationId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Storage Location
            </label>
            <select
              id="storageLocationId"
              name="storageLocationId"
              defaultValue={map.storageLocationId || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
            >
              <option value="">Select storage location</option>
              {storageLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="foldingStatus" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Folding Status
            </label>
            <select
              id="foldingStatus"
              name="foldingStatus"
              defaultValue={map.foldingStatus || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
            >
              <option value="">Select folding status</option>
              <option value="FLAT">Flat</option>
              <option value="FOLDED">Folded</option>
              <option value="ROLLED">Rolled</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="storageNotes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Storage Notes
            </label>
            <textarea
              id="storageNotes"
              name="storageNotes"
              rows={3}
              defaultValue={map.storageNotes || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="Any special storage considerations or notes"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="privateNotes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Private Notes
            </label>
            <textarea
              id="privateNotes"
              name="privateNotes"
              rows={3}
              defaultValue={map.privateNotes || ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              placeholder="Private admin notes, not visible to public"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? 'Updating...' : 'Update Map'}
        </button>
      </div>
    </form>
  );
}