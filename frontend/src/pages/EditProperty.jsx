// src/pages/EditProperty.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyForm from '../components/properties/PropertyUpdateForm';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await propertyService.getById(id);
      if (data.statusCode === 200)
        setProperty(data.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (propertyData) => {
    setLoading(true);
    try {
      await propertyService.update(id, propertyData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 rounded w-1/3 mb-4"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="bg-gray-300 h-12 rounded"></div>
                <div className="bg-gray-300 h-12 rounded"></div>
                <div className="bg-gray-300 h-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Property</h1>
          <p className="text-gray-600">Update your property information</p>
        </div>

        <PropertyForm
          onSubmit={handleSubmit}
          initialData={property}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EditProperty;