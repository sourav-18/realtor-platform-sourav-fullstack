// src/pages/PropertyDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Bed, Bath, Square, Calendar, User, Phone, Mail,
  ChevronLeft, ChevronRight, ZoomIn, X
} from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getById(id);
      if (data.statusCode === 200)
        setProperty(data.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const nextImage = () => {
    setActiveImage((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const openImageModal = (index) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
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
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : ['http://res.cloudinary.com/sourav18/image/upload/v1759639721/realtor-platform/wd1ohpnyegx7elg8e0og.jpg'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            ← Back to Properties
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Enhanced Image Gallery */}
          <div className="relative">
            <div className="h-96 bg-gray-200 relative group">
              <img
                src={images[activeImage]}
                alt={property.title}
                className="w-full h-full object-contain"
              />

              {/* Zoom Button */}
              <button
                onClick={() => openImageModal(activeImage)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn size={20} />
              </button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {activeImage + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex space-x-2 p-4 bg-gray-50 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-16 border-2 rounded ${activeImage === index
                      ? 'border-primary-600'
                      : 'border-transparent'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-contain rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details Section */}
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
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${property.listingType === 'sale'
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
                    <div className="font-semibold">{property.specifications?.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="font-semibold">{property.specifications?.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="font-semibold">{property.area} sqft</div>
                    <div className="text-sm text-gray-600">Area</div>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-2 text-gray-600 text-sm font-semibold uppercase">
                      {property.property_type}
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
                      <strong>Property Type:</strong> {property.property_type}
                    </div>
                    <div>
                      <strong>Listing Type:</strong> For {property.listingType}
                    </div>
                    <div>
                      <strong>Bedrooms:</strong> {property.specifications?.bedrooms}
                    </div>
                    <div>
                      <strong>Bathrooms:</strong> {property.specifications?.bathrooms}
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
                      <div className="font-semibold">{property.ownerDetails?.name || 'Property Owner'}</div>
                      <div className="text-sm text-gray-600">Property Owner</div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    {/* Phone Number Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      {user ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Phone size={16} className="text-green-600" />
                            <span className="font-medium">{property.ownerDetails?.phoneNumber || 'Not provided'}</span>
                          </div>
                          <button className="text-green-600 hover:text-green-700">
                            <Phone size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-300 rounded-lg blur-[2px]">
                            <div className="flex items-center space-x-2">
                              <Phone size={16} className="text-gray-500" />
                              <span className="font-medium">•••-•••-••••</span>
                            </div>
                            <Phone size={16} className="text-gray-500" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                              🔒 Login to view
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Login Prompt for Guests */}
                  {!user && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="text-center bg-primary-50 p-4 rounded-lg">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <User className="text-primary-600" size={20} />
                        </div>
                        <p className="text-sm text-gray-700 mb-3">Create an account to contact property owners</p>
                        <div className="space-y-2">
                          <Link
                            to="/login"
                            className="block w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            className="block w-full border border-primary-600 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition text-sm font-medium"
                          >
                            Create Account
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-size Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 p-2"
            >
              <X size={24} />
            </button>

            {/* Main Modal Image */}
            <div className="relative">
              <img
                src={images[modalImageIndex]}
                alt={`${property.title} ${modalImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
              />

              {/* Modal Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={nextModalImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {modalImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-12 border-2 rounded ${modalImageIndex === index
                      ? 'border-primary-600'
                      : 'border-transparent'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Info in Modal */}
            <div className="text-white mt-4 text-center">
              <h3 className="text-xl font-semibold">{property.title}</h3>
              <p className="text-gray-300">{property.location}</p>
              <p className="text-lg font-bold text-primary-400 mt-2">
                {formatPrice(property.price)}
                {property.listingType === 'rent' && '/month'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;