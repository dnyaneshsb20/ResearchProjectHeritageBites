import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Dashboard;
