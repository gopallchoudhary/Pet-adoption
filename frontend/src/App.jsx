import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Pets from './pages/Pets'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {


  return (
    <div className="mx-4 sm:mx-[10%]">
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/pets" element={<Pets/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
