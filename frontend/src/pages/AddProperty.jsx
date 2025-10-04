import React from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyForm from '../components/properties/PropertyForm';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (propertyData) => {
    setLoading(true);
    try {
      await propertyService.create(propertyData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Error creating property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Property</h1>
          <p className="text-gray-600">List your property for sale or rent</p>
        </div>

        <PropertyForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default AddProperty;