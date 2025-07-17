import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Layout/Sidebar';
import HomePageManager from "./Sections/HomePageManager";
import Services from './Sections/Services';
import Packages from './Sections/Packages';
import Orders from './Sections/Orders';
import Team from './Sections/Team';
import Reviews from './Sections/Reviews';
import Portfolio from './Sections/Portfolio';
import Messages from './Sections/Messages';
import ContactInfo from './Sections/ContactInfo';
import ReviewsStatsManager from './Sections/ReviewsStatsManager';
import { supabase } from '../utils/supabase';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem('activeAdminSection');
    return savedSection || 'home';
  });
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('activeAdminSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true); // Set loading to true before checking user
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login');
      } else {
        setLoading(false); // Set loading to false after successful check
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => {
      authListener?.data?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-gray-50">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomePageManager />;
      case 'services':
        return <Services />;
      case 'packages':
        return <Packages />;
      case 'orders':
        return <Orders />;
      case 'team':
        return <Team />;
      case 'reviews':
        return <Reviews />;
      case 'reviews-stats':
        return <ReviewsStatsManager />;
      case 'portfolio':
        return <Portfolio />;
      case 'messages':
        return <Messages />;
      case 'contact':
        return <ContactInfo />;
      default:
        return <HomePageManager />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 flex flex-col">
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;