import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { createClient } from '@supabase/supabase-js'
// import { SessionContextProvider } from '@supabase/'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_REACT_APP_SUPABASE_API_KEY
);

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <SessionContextProvider supabaseClient={supabase}>
        <App />
        <ReactQueryDevtools initialIsOpen={true} />
      </SessionContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
