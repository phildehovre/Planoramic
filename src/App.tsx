import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './Pages/Home'
import { createClient } from '@supabase/supabase-js'
import Dashboard from './components/Dashboard'
import './Global.scss'
import RessourcePage from './components/RessourcePage'
import Ressource from './components/Ressource'
import { useSession } from '@supabase/auth-helpers-react'

export const supabase = createClient(import.meta.env.VITE_REACT_APP_SUPABASE_PROJECT_URL, import.meta.env.VITE_REACT_APP_SUPABASE_API_KEY)


function App() {

  const session = useSession()

  console.log(session)

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />}>
            <Route path=':ressource' element={<RessourcePage />} >
              <Route path=':id' element={<Ressource />} />
              <Route path='new' element={<Ressource />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div >
  )
}

export default App
