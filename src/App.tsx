import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import HomePage from './components/Pages/Index'
import Canvas from './components/Game/Logic/Oware'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<HomePage />} />
        <Route path="/play" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
