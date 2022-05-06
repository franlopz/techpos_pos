import './App.css'
import { Routes, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import AppSettings from './pages/Settings'
import ViewportProvider from './context/ViewportContext'
import EntityScreens from './components/pos/EntityScreens'
import PinLogin from './pages/PinLogin'
import RequiredAuth from './components/RequieredAuth'
import { Toaster } from 'react-hot-toast'
import './index.css'

function App() {

  return (
    <>
      <ViewportProvider>
        <Toaster />
        <Routes>
          <Route path='/settings' element={<AppSettings />} />
          <Route path='/' element={
            <RequiredAuth redirectTo='/pin' reducer='sambaUser'>
              <EntityScreens />
            </RequiredAuth>} />
          <Route path='/pin' element={<PinLogin />}
          />
        </Routes>
      </ViewportProvider>
    </>
  )
}

export default App
