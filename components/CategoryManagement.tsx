"use client";

import { useState } from 'react';
import { Category, Map } from '@prisma/client';
import { Plus, Edit3, Trash2, Tag, MapPin, Hash } from 'lucide-react';

type CategoryWithMaps = Category & {
  maps: Pick<Map, 'id' | 'title'>[];
};

interface CategoryManagementProps {
  categories: CategoryWithMaps[];
}

export default function CategoryManagement({ categories: initialCategories }: CategoryManagementProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithMaps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sortOrder: 0
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', sortOrder: 0 });
    setEditingCategory(null);
    setShowForm(false);
    setError(null);
  };

  const handleEdit = (category: CategoryWithMaps) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      sortOrder: category.sortOrder
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = editingCategory 
        ? `/mapvault/api/admin/categories/${editingCategory.id}`
        : '/mapvault/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        if (editingCategory) {
          // Update existing category
          setCategories(prev => prev.map(c => 
            c.id === editingCategory.id 
              ? { ...c, ...result.category }
              : c
          ).sort((a, b) => a.sortOrder - b.sortOrder));
        } else {
          // Add new category
          setCategories(prev => [...prev, { ...result.category, maps: [] }]
            .sort((a, b) => a.sortOrder - b.sortOrder));
        }
        resetForm();
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (err) {
      setError('Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {categories.length} Categor{categories.length !== 1 ? 'ies' : 'y'}
        </h2>
        
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  placeholder="e.g., World Maps, City Maps"
                />
              </div>

              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  id="sortOrder"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Brief description of this category"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (editingCategory ? 'Update' : 'Add')} Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {category.name}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{category.maps.length} map{category.maps.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Hash size={14} />
                      <span>Order: {category.sortOrder}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  title="Edit category"
                >
                  <Edit3 size={14} />
                </button>
              </div>
            </div>

            {category.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {category.description}
              </p>
            )}

            {category.maps.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Recent maps:</div>
                <div className="space-y-1">
                  {category.maps.slice(0, 2).map((map) => (
                    <div key={map.id} className="text-xs text-slate-600 dark:text-slate-300 truncate">
                      {map.title}
                    </div>
                  ))}
                  {category.maps.length > 2 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      +{category.maps.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No categories</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Create categories to organize your map collection.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Category
          </button>
        </div>
      )}
    </div>
  );
}