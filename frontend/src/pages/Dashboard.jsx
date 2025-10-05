// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/propertyService';
import { Home, Plus, User, Settings, ChevronLeft, ChevronRight, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

// Special Property Card for Dashboard with owner controls
const DashboardPropertyCard = ({ property, onUpdate, onDelete }) => {
  const [isActive, setIsActive] = useState(property.status === 'active');
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      const newStatus = isActive ? 'inactive' : 'active';
      await propertyService.statusUpdate(property.id,newStatus);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating property status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        setLoading(true);
        await propertyService.statusUpdate(property.id,"delete");
        onDelete?.();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image Section */}
      <div className="relative">
        <img 
          src={property.images?.[0] || '/api/placeholder/400/250'} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            property.listingType === 'sale' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            For {property.listingType}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2 text-sm">
          <span>{property.location}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600 text-sm mb-3">
          <div className="flex items-center space-x-3">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
            <span>{property.area} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(property.price)}
            {property.listingType === 'rent' && <span className="text-sm font-normal">/month</span>}
          </span>
        </div>

        {/* Owner Actions */}
        <div className="flex space-x-2 border-t pt-4">
          {/* Status Toggle */}
          <button
            onClick={handleStatusToggle}
            disabled={loading}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded text-sm font-medium ${
              isActive 
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } disabled:opacity-50`}
          >
            {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{isActive ? 'Deactivate' : 'Activate'}</span>
          </button>

          {/* Edit Button */}
          <Link
            to={`/edit-property/${property.id}`}
            className="flex items-center justify-center space-x-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-3 rounded text-sm font-medium"
          >
            <Edit size={16} />
            <span>Edit</span>
          </Link>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center justify-center space-x-1 bg-red-100 text-red-700 hover:bg-red-200 py-2 px-3 rounded text-sm font-medium disabled:opacity-50"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-500">
          <div className="text-center">
            <div className="font-semibold">Created {new Date(property.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isOwner } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (isOwner) {
      fetchMyProperties();
    }
  }, [isOwner, currentPage]); // Refetch when page changes

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const properties = await propertyService.getMyProperties({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (properties.statusCode === 200) {
        setMyProperties(properties.data?.items || []);
        setTotalCount(properties.data?.totalCount || 0);
      }
    } catch (error) {
      console.error('Error fetching my properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh properties after update/delete
  const handlePropertyUpdate = () => {
    fetchMyProperties();
  };

  const handlePropertyDelete = () => {
    fetchMyProperties();
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generate page numbers for pagination
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                {isOwner
                  ? 'Manage your properties and track your listings.'
                  : 'Browse properties and find your dream home.'
                }
              </p>
            </div>
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center">
              <User className="text-primary-600" size={32} />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {isOwner && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-800">{totalCount}</p>
                </div>
                <Home className="text-primary-600" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Active Listings</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {myProperties.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <Settings className="text-green-600" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* My Properties Section */}
        {isOwner && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
                {!loading && myProperties.length > 0 && (
                  <p className="text-gray-600 mt-1">
                    Showing {startItem}-{endItem} of {totalCount} properties
                  </p>
                )}
              </div>
              <Link
                to="/add-property"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Property</span>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                    <div className="bg-gray-300 h-48 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-300 h-4 rounded"></div>
                      <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                      <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : myProperties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties listed yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first property</p>
                <Link
                  to="/add-property"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition inline-block"
                >
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <>
                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {myProperties.map(property => (
                    <DashboardPropertyCard 
                      key={property.id} 
                      property={property}
                      onUpdate={handlePropertyUpdate}
                      onDelete={handlePropertyDelete}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-2 rounded-lg border ${
                        currentPage === 1
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
                        className={`px-3 py-2 rounded-lg border ${
                          currentPage === page
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
                      className={`flex items-center px-3 py-2 rounded-lg border ${
                        currentPage === totalPages
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
          </div>
        )}

        {/* Customer Dashboard */}
        {!isOwner && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Dream Home</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/properties"
                className="bg-primary-600 text-white p-8 rounded-lg text-center hover:bg-primary-700 transition"
              >
                <Home className="mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">Browse Properties</h3>
                <p>Explore thousands of properties for sale and rent</p>
              </Link>

              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <User className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Saved Properties</h3>
                <p>Coming soon - Save your favorite properties</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;