import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/common/PropertyCard';
import SearchFilters from '../components/common/SearchFilters';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll();
      if (data.statusCode === 200) {
        setProperties(data.data?.items||[]);
      }

    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Other filters
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType);
    }

    if (filters.listingType) {
      filtered = filtered.filter(property => property.listingType === filters.listingType);
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
    }

    setFilteredProperties(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse Properties</h1>
          <p className="text-xl text-gray-600">Find your perfect home from our curated collection</p>
        </div>

        <SearchFilters onSearch={handleSearch} onFilter={handleFilter} loading={loading} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 rounded"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProperties.length} of {properties.length} properties
              </p>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;