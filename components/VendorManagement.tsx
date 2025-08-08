"use client";

import { useState } from 'react';
import { Prisma } from '@prisma/client';

type Vendor = Prisma.VendorGetPayload<{}>;
type Map = Prisma.MapGetPayload<{}>;
import { Plus, Edit3, Trash2, Store, MapPin, Mail, FileText, Users, Eye, EyeOff } from 'lucide-react';

type VendorWithMaps = Vendor & {
  maps: Pick<Map, 'id' | 'title'>[];
};

interface VendorManagementProps {
  vendors: VendorWithMaps[];
}

export default function VendorManagement({ vendors: initialVendors }: VendorManagementProps) {
  const [vendors, setVendors] = useState(initialVendors);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorWithMaps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({ name: '', contactInfo: '', notes: '' });
    setEditingVendor(null);
    setShowForm(false);
    setError(null);
  };

  const handleEdit = (vendor: VendorWithMaps) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contactInfo: vendor.contactInfo || '',
      notes: vendor.notes || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = editingVendor 
        ? `/mapvault/api/admin/vendors/${editingVendor.id}`
        : '/mapvault/api/admin/vendors';
      
      const method = editingVendor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        if (editingVendor) {
          // Update existing vendor
          setVendors(prev => prev.map(v => 
            v.id === editingVendor.id 
              ? { ...v, ...result.vendor }
              : v
          ));
        } else {
          // Add new vendor
          setVendors(prev => [...prev, { ...result.vendor, maps: [] }]);
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

  const handleDelete = async (vendor: VendorWithMaps) => {
    if (!confirm(`Are you sure you want to delete "${vendor.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/mapvault/api/admin/vendors/${vendor.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        if (result.vendor) {
          // Vendor was deactivated, not deleted
          setVendors(prev => prev.map(v => 
            v.id === vendor.id 
              ? { ...v, isActive: false }
              : v
          ));
          alert(result.message);
        } else {
          // Vendor was deleted
          setVendors(prev => prev.filter(v => v.id !== vendor.id));
        }
      } else {
        setError(result.error || 'Delete failed');
      }
    } catch (err) {
      setError('Delete failed');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVendors = showInactive 
    ? vendors 
    : vendors.filter(v => v.isActive);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {filteredVendors.length} Vendor{filteredVendors.length !== 1 ? 's' : ''}
          </h2>
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="inline-flex items-center space-x-2 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            {showInactive ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showInactive ? 'Hide' : 'Show'} Inactive</span>
          </button>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
        >
          <Plus size={16} />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Vendor Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Enter vendor name"
              />
            </div>

            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Contact Information
              </label>
              <input
                type="text"
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Email, phone, address, etc."
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Notes about this vendor, specialties, terms, etc."
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (editingVendor ? 'Update' : 'Add')} Vendor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vendors List */}
      <div className="space-y-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
              !vendor.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                      <span>{vendor.name}</span>
                      {!vendor.isActive && (
                        <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                          Inactive
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{vendor.maps.length} map{vendor.maps.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div>Added {new Date(vendor.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendor.contactInfo && (
                    <div className="flex items-start space-x-2">
                      <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{vendor.contactInfo}</div>
                      </div>
                    </div>
                  )}
                  
                  {vendor.notes && (
                    <div className="flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{vendor.notes}</div>
                      </div>
                    </div>
                  )}
                </div>

                {vendor.maps.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Maps from this vendor:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vendor.maps.slice(0, 3).map((map) => (
                        <span
                          key={map.id}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                        >
                          {map.title}
                        </span>
                      ))}
                      {vendor.maps.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                          +{vendor.maps.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(vendor)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  title="Edit vendor"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(vendor)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  title="Delete vendor"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {showInactive ? 'No vendors found' : 'No active vendors'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {showInactive 
              ? 'Add your first vendor to start organizing your map sources.'
              : 'All vendors are currently inactive. Toggle to show inactive vendors.'
            }
          </p>
          {!showInactive && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Vendor
            </button>
          )}
        </div>
      )}
    </div>
  );
}