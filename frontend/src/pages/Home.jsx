import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/common/PropertyCard';
import { Home as HomeIcon, TrendingUp, Shield } from 'lucide-react';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const properties = await propertyService.getAll({ limit: 6 });
        setFeaturedProperties(properties.data || properties);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    // fetchFeaturedProperties();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Find Your Dream Property</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the perfect home from thousands of listings. Buy, rent, or sell properties with ease.
          </p>
          <Link 
            to="/" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block"
          >
            Browse Properties
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RealtorPro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Thousands of properties to choose from across different locations and budgets.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing and great deals on properties for sale and rent.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Platform</h3>
              <p className="text-gray-600">Secure transactions and verified listings from trusted property owners.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;