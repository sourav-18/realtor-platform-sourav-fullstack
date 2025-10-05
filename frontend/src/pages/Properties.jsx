import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/common/PropertyCard';
import SearchFilters from '../components/common/SearchFilters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProperties();
  }, [currentPage, filters, searchTerm]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const apiParams = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchTerm) {
        apiParams.search = searchTerm;
      }

      if (filters.location) {
        apiParams.location = filters.location;
      }
      if (filters.propertyType) {
        apiParams.propertyType = filters.propertyType;
      }
      if (filters.listingType) {
        apiParams.listingType = filters.listingType;
      }
      if (filters.bedrooms) {
        apiParams.bedrooms = filters.bedrooms;
      }
      if (filters.minPrice) {
        apiParams.minPrice = filters.minPrice;
      }
      if (filters.maxPrice) {
        apiParams.maxPrice = filters.maxPrice;
      }
      if (filters.sortBy) {
        apiParams.sortBy = filters.sortBy;
      }

      const data = await propertyService.getAll(apiParams);

      if (data.statusCode === 200) {
        setProperties(data.data?.items || []);
        setTotalCount(data.data?.totalCount || 0);
      } else {
        setProperties([]);
        setTotalCount(0);
        console.error('API Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };


  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);


  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setFilters(prev => ({
      ...prev,
      sortBy: sortValue
    }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse Properties</h1>
          <p className="text-xl text-gray-600">Find your perfect home from our curated collection</p>
        </div>

        <SearchFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
          loading={loading}
          currentFilters={filters}
        />

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
            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {startItem}-{endItem} of {totalCount} properties
                {searchTerm && ` for "${searchTerm}"`}
                {filters.location && ` in ${filters.location}`}
                {filters.propertyType && ` • ${filters.propertyType}`}
                {filters.listingType && ` • For ${filters.listingType}`}
              </p>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={filters.sortBy || 'newest'}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
                <p className="text-gray-500">
                  {searchTerm || Object.keys(filters).length > 0
                    ? 'Try adjusting your search criteria or filters'
                    : 'No properties available at the moment'
                  }
                </p>
                {(searchTerm || Object.keys(filters).length > 0) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({});
                      setCurrentPage(1);
                    }}
                    className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-2 rounded-lg border ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg border ${currentPage === page
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-3 py-2 rounded-lg border ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                    >
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                )}

                {/* Quick Page Info */}
                <div className="text-center mt-4 text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;