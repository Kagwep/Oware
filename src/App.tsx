import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import CallToAction from './components/CallToAction';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <BrowserRouter>
          <Navbar />
          <Hero />
          <CallToAction />
          <Footer />
        </BrowserRouter>
    </>
  )
}

export default App
