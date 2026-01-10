
// ========================================
// MAIN ENTRY POINT
// ========================================
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// // Create Query Client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1, // retry failed requests once
//       refetchOnWindowFocus: false, // avoid unnecessary refetch
//     },
//   },
// });

// console.log("🟣 QueryClient created",queryClient);


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <HelmetProvider>
      {/* <QueryClientProvider client={queryClient}> */}
       <BrowserRouter>
          <App />
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
        </BrowserRouter>
      {/* </QueryClientProvider> */}
    </HelmetProvider>
  // </React.StrictMode>
);