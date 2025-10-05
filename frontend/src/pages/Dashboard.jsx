// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/common/PropertyCard';
import { Home, Plus, User, Settings } from 'lucide-react';

const Dashboard = () => {
   console.log("-------------------------1")
  const { user, isOwner } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOwner) {
      fetchMyProperties();
    }
  }, [isOwner]);

  const fetchMyProperties = async () => {
    try {
      const properties = await propertyService.getMyProperties();
      setMyProperties(properties.data || properties);
    } catch (error) {
      console.error('Error fetching my properties:', error);
    } finally {
      setLoading(false);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-800">{myProperties.length}</p>
                </div>
                <Home className="text-primary-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Active Listings</p>
                  <p className="text-3xl font-bold text-gray-800">{myProperties.length}</p>
                </div>
                <Settings className="text-green-600" size={32} />
              </div>
            </div>
            
            <Link 
              to="/add-property" 
              className="bg-primary-600 text-white p-6 rounded-lg shadow-md hover:bg-primary-700 transition flex items-center justify-center"
            >
              <div className="text-center">
                <Plus className="mx-auto mb-2" size={32} />
                <p className="font-semibold">Add New Property</p>
              </div>
            </Link>
          </div>
        )}

        {/* My Properties Section */}
        {isOwner && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
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
                {[...Array(3)].map((_, i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
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