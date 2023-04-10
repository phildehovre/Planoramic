import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CreateTemplate from './components/CreateTemplate'
import CreateCampaign from './components/CreateCampaign'
import Home from './Pages/Home'
import { createClient } from '@supabase/supabase-js'
import Campaign from './components/Campaign'
import Template from './components/Template'
import Dashboard from './components/Dashboard'
import New from './components/New'
import Navbar from './components/Navbar'
import Page from './components/Page'
import './Global.scss'

export const supabase = createClient(import.meta.env.VITE_REACT_APP_SUPABASE_PROJECT_URL, import.meta.env.VITE_REACT_APP_SUPABASE_API_KEY)


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/new' element={<New />}>
            <Route path='template' element={<CreateTemplate />} />
            <Route path='campaign' element={<CreateCampaign />} />
          </Route>
          <Route path='/dashboard' element={<Dashboard />}>
            <Route path='template/:id' element={<Template />} />
            <Route path='campaign/:id' element={<Campaign />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
