"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface DeleteMapButtonProps {
  mapId: number;
  mapTitle: string;
}

export default function DeleteMapButton({ mapId, mapTitle }: DeleteMapButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/mapvault/api/maps/${mapId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        // Success - redirect to home page
        router.push('/');
        router.refresh();
      } else {
        setError(result.error || 'Failed to delete map');
      }
    } catch (err) {
      setError('Failed to delete map');
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
              <Trash2 size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Delete Map
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-slate-700 dark:text-slate-300">
              Are you sure you want to delete <span className="font-medium">"{mapTitle}"</span>? 
              This will permanently remove the map and all associated images.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => {
                setShowConfirm(false);
                setError(null);
              }}
              disabled={isDeleting}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete Map</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium transition-colors"
    >
      <Trash2 size={16} />
      <span>Delete Map</span>
    </button>
  );
}