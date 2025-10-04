// src/pages/PropertyDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { MapPin, Bed, Bath, Square, Calendar, User, Phone, Mail } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getById(id);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="bg-gray-300 h-96 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-8 rounded w-3/4"></div>
              <div className="bg-gray-300 h-4 rounded w-1/2"></div>
              <div className="bg-gray-300 h-20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Property not found</h1>
          <Link to="/properties" className="text-primary-600 hover:text-primary-700">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/properties" className="text-primary-600 hover:text-primary-700">
            ← Back to Properties
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="relative">
            <div className="h-96 bg-gray-200">
              <img
                src={property.images?.[activeImage] || '/api/placeholder/800/400'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex space-x-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-16 h-16 border-2 ${
                      activeImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin size={18} className="mr-1" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatPrice(property.price)}
                      {property.listingType === 'rent' && <span className="text-sm font-normal">/month</span>}
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      property.listingType === 'sale' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      For {property.listingType}
                    </span>
                  </div>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Bed className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="font-semibold">{property.area} sqft</div>
                    <div className="text-sm text-gray-600">Area</div>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-2 text-gray-600 text-sm font-semibold uppercase">
                      {property.propertyType}
                    </div>
                    <div className="font-semibold capitalize">{property.propertyType}</div>
                    <div className="text-sm text-gray-600">Type</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {/* Additional Details */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Property Type:</strong> {property.propertyType}
                    </div>
                    <div>
                      <strong>Listing Type:</strong> For {property.listingType}
                    </div>
                    <div>
                      <strong>Bedrooms:</strong> {property.bedrooms}
                    </div>
                    <div>
                      <strong>Bathrooms:</strong> {property.bathrooms}
                    </div>
                    <div>
                      <strong>Area:</strong> {property.area} sqft
                    </div>
                    <div>
                      <strong>Location:</strong> {property.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Contact & Actions */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  
                  {/* Owner Info */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-white rounded-lg">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold">{property.owner?.name || 'Property Owner'}</div>
                      <div className="text-sm text-gray-600">Property Owner</div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition">
                      <Phone size={18} />
                      <span>Call Owner</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 border border-primary-600 text-primary-600 py-3 rounded-lg hover:bg-primary-50 transition">
                      <Mail size={18} />
                      <span>Send Message</span>
                    </button>
                  </div>

                  {/* Schedule Tour */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold mb-3">Schedule a Tour</h4>
                    <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
                      <Calendar size={18} />
                      <span>Schedule Viewing</span>
                    </button>
                  </div>

                  {/* Owner Actions */}
                  {user && user.id === property.ownerId && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold mb-3">Owner Actions</h4>
                      <div className="space-y-2">
                        <Link
                          to={`/edit-property/${property.id}`}
                          className="block w-full text-center bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition"
                        >
                          Edit Property
                        </Link>
                        <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                          Delete Property
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;