import React, { useState, useRef } from 'react';
import { uploadService } from '../../services/uploadServices';
import { propertyService } from '../../services/propertyService';
import { Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import constantUtils from "../../utils/constant.utils";

const PropertyUpdateForm = ({ initialData = {}, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    price: initialData.price || '',
    location: initialData.location || '',
    bedrooms: initialData.specifications?.bedrooms || '',
    bathrooms: initialData.specifications?.bathrooms || '',
    area: initialData.specifications?.area || '',
    propertyType: initialData.property_type || 'apartment',
    listingType: initialData.listing_type || 'sale',
    topCities: initialData.top_cities || '',
    images: initialData.images || []
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const propertyTypes = constantUtils.propertyTypes;
  const listingTypes = constantUtils.listingTypes;
  const topCities = constantUtils.topCities;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset file input
  };

  const removeUploadedFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => {
      if (file.id === id) {
        URL.revokeObjectURL(file.preview); // Clean up memory
      }
      return file.id !== id;
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let newImageUrls = [];

      // Bulk upload images if any files are selected
      if (uploadedFiles.length > 0) {
        console.log(`Starting bulk upload of ${uploadedFiles.length} images...`);

        const formData = new FormData();

        // Append all files to FormData
        uploadedFiles.forEach((fileData) => {
          formData.append('images', fileData.file);
        });

        try {
          const apiRes = await uploadService.bulkImage(formData);

          if (apiRes.statusCode === 200) {
            newImageUrls = apiRes.data && apiRes.data.length ? apiRes.data : [];
          } else if (apiRes.statusCode === 500) {
            setError(apiRes.message);
            return;
          }
        } catch (uploadError) {
          setError(uploadError.message);
          return;
        }
      }


      const allImages = [
        ...formData.images,
        ...newImageUrls
      ].filter(url => url && url.trim() !== '');

      const uniqueImages = [...new Set(allImages)];

      // Prepare submission data
      const submitData = {
        ...formData,
        images: uniqueImages,
        specifications: {
          bedrooms: parseInt(formData.bedrooms) || 0,
          bathrooms: parseFloat(formData.bathrooms) || 0,
          area: parseInt(formData.area) || 0
        }
      };
      delete submitData.area;
      delete submitData.bathrooms;
      delete submitData.bedrooms;



      // Submit the form data
      const apiRes = await propertyService.update(initialData.id, submitData);
      if (apiRes.statusCode === 500) {
        setError(apiRes.message);
        return;
      }

      // Cleanup: Revoke object URLs to free memory
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      // Reset uploaded files state on success
      setUploadedFiles([]);
      alert(`Properties Update successfully`);
      navigate('/dashboard');

    } catch (error) {
      console.error('Form submission error:', error);

      // Show user-friendly error message
      const errorMessage = error.message || 'Failed to submit property. Please try again.';

      // You can replace this with a toast notification or custom modal
      alert(`Error: ${errorMessage}`);

      // Optionally, you can set an error state to show in the UI
      // setSubmissionError(errorMessage);

    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>)}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Beautiful 3 bedroom apartment in downtown"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe your property in detail..."
          />
        </div>

        {/* Property Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="250000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="New York, NY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
            min="0"
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area (sqft)</label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="1200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {propertyTypes.map((item) => (
              <option key={item} value={item}>{item.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {listingTypes.map((item) => (
              <option key={item} value={item}>{item.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Top City</label>
          <select
            name="topCities"
            value={formData.topCities}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {topCities.map((item) => (
              <option key={item} value={item}>{item.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Images Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Images</h3>

          {/* Existing Images Preview */}
          {formData.images.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Existing Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Upload New Images</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="flex items-center space-x-2 bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg p-4 w-full hover:bg-primary-100 transition"
            >
              <Upload className="text-primary-600" size={20} />
              <span className="text-primary-700 font-medium">Click to upload images</span>
            </button>
            <p className="text-sm text-gray-500 mt-2">Select multiple images from your device</p>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {uploadedFiles.map((fileData) => (
                    <div key={fileData.id} className="relative group">
                      <img
                        src={fileData.preview}
                        alt="Preview"
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedFile(fileData.id)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {uploading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>
            {uploading ? 'Uploading Images...' :
              loading ? 'Saving...' :
                (initialData.id ? 'Update Property' : 'Create Property')}
          </span>
        </button>
      </div>
    </form>
  );
};

export default PropertyUpdateForm;