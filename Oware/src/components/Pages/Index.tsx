import React from 'react'
import Navbar from './Navbar';
import Hero from './Hero';
import CallToAction from './CallToAction';
import Footer from './Footer';


const HomePage = () => {
  return (
        <>
          <Navbar />
          <Hero />
          <CallToAction />
          <Footer />
        </>
  );
}

export default HomePage;