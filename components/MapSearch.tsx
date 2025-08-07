"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Calendar, User, MapPin, Tag, Star, Eye } from 'lucide-react';
import { Map, Category, Condition } from '@prisma/client';

type MapWithRelations = Map & {
  category: Category;
  condition: Condition;
};

interface SearchFilters {
  categories: Category[];
  conditions: Condition[];
  mapmakers: string[];
  regions: string[];
}

interface MapSearchProps {
  onSearchResults: (maps: MapWithRelations[], total: number) => void;
  initialMaps: MapWithRelations[];
}

export default function MapSearch({ onSearchResults, initialMaps }: MapSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    conditions: [],
    mapmakers: [],
    regions: []
  });
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    yearFrom: '',
    yearTo: '',
    mapmaker: '',
    region: '',
    condition: '',
    featured: '',
    available: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await fetch('/api/search');
      const data = await response.json();
      if (response.ok) {
        setFilters(data.filters);
      }
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  // Debounced search function
  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('q', searchQuery);
      if (activeFilters.category) params.set('category', activeFilters.category);
      if (activeFilters.yearFrom) params.set('yearFrom', activeFilters.yearFrom);
      if (activeFilters.yearTo) params.set('yearTo', activeFilters.yearTo);
      if (activeFilters.mapmaker) params.set('mapmaker', activeFilters.mapmaker);
      if (activeFilters.region) params.set('region', activeFilters.region);
      if (activeFilters.condition) params.set('condition', activeFilters.condition);
      if (activeFilters.featured) params.set('featured', activeFilters.featured);
      if (activeFilters.available) params.set('available', activeFilters.available);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        onSearchResults(data.maps, data.total);
      } else {
        console.error('Search failed:', data.error);
        onSearchResults(initialMaps, initialMaps.length);
      }
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults(initialMaps, initialMaps.length);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, activeFilters]); // Removed onSearchResults and initialMaps from deps

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilters({
      category: '',
      yearFrom: '',
      yearTo: '',
      mapmaker: '',
      region: '',
      condition: '',
      featured: '',
      available: ''
    });
  };

  const hasActiveFilters = searchQuery || Object.values(activeFilters).some(value => value !== '');

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
          placeholder="Search maps by title, description, mapmaker, or region..."
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
          </div>
        )}
      </div>

      {/* Filter Toggle and Clear */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center space-x-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <X size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Tag size={16} className="inline mr-1" />
                Category
              </label>
              <select
                value={activeFilters.category}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">All Categories</option>
                {filters.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Year Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={activeFilters.yearFrom}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, yearFrom: e.target.value }))}
                  placeholder="From"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
                />
                <input
                  type="number"
                  value={activeFilters.yearTo}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, yearTo: e.target.value }))}
                  placeholder="To"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Mapmaker Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <User size={16} className="inline mr-1" />
                Mapmaker
              </label>
              <select
                value={activeFilters.mapmaker}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, mapmaker: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">All Mapmakers</option>
                {filters.mapmakers.map((mapmaker) => (
                  <option key={mapmaker} value={mapmaker}>
                    {mapmaker}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Region
              </label>
              <select
                value={activeFilters.region}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, region: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">All Regions</option>
                {filters.regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Condition
              </label>
              <select
                value={activeFilters.condition}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">All Conditions</option>
                {filters.conditions.map((condition) => (
                  <option key={condition.id} value={condition.id}>
                    {condition.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Filters */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Special
              </label>
              <div className="space-y-2">
                <select
                  value={activeFilters.featured}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, featured: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
                >
                  <option value="">Featured Status</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Not Featured</option>
                </select>
                
                <select
                  value={activeFilters.available}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, available: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-slate-100"
                >
                  <option value="">Availability</option>
                  <option value="true">Available Only</option>
                  <option value="false">Sold Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}