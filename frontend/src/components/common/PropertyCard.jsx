// src/components/common/PropertyCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
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

  // Default image if no images provided
  const defaultImage = 'http://res.cloudinary.com/sourav18/image/upload/v1759639721/realtor-platform/wd1ohpnyegx7elg8e0og.jpg'; 
  const images = property.images && property.images.length > 0 ? property.images : [defaultImage];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        {/* Image Carousel Section */}
        <div className="relative group">
          {/* Main Image */}
          <div className="h-48 bg-gray-200 overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Overlay with Zoom Button */}
          <button
            onClick={() => openImageModal(currentImageIndex)}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ZoomIn size={16} />
          </button>

          {/* Listing Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${property.listing_type === 'sale'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
              }`}>
              For {property.listing_type}
            </span>
          </div>

          {/* Carousel Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Indicators/Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600 text-sm mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Bed size={16} className="mr-1" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center">
                <Bath size={16} className="mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center">
                <Square size={16} className="mr-1" />
                <span>{property.area} sqft</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(property.price)}
              {property.listingType === 'rent' && <span className="text-sm font-normal">/month</span>}
            </span>
            <Link
              to={`/properties/${property.id}`}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Full-size Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10"
            >
              ✕
            </button>

            {/* Main Modal Image */}
            <div className="relative">
              <img
                src={images[modalImageIndex]}
                alt={`${property.title} ${modalImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Modal Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={nextModalImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
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
              <div className="flex space-x-2 mt-4 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 border-2 rounded ${modalImageIndex === index
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
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p className="text-gray-300">{property.location}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;