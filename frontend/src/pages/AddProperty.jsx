import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyAddForm from '../components/properties/PropertyAddForm';

const AddProperty = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Property</h1>
          <p className="text-gray-600">List your property for sale or rent</p>
        </div>

        <PropertyAddForm />
      </div>
    </div>
  );
};

export default AddProperty;