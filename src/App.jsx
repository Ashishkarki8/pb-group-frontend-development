// 📁 src/App.jsx
// 📁 src/App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom'; // ✅ Add these imports
import LoadingFallback from './components/common/LoadingFallback';
import useAuthStore from './store/authStore';
import { ModalProvider } from './contexts/ModalContext';
import { ConfirmProvider } from './contexts/ConfirmContext'; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.response?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() { // ✅ Remove children prop
  const hasHydrated = useAuthStore((state) => state.hasHydrated); //to retrive one hashydrated data only we call like this
  console.log("app.js hasHydrated",hasHydrated);

  const { isAuthenticated, user, isLoading } = useAuthStore();
   console.log(' Checking store state', { isAuthenticated, user, isLoading, hasHydrated});

  if (!hasHydrated) {
    console.log(" // wait until Zustand loads data from localStorage show spinner")
    return <LoadingFallback />;
  }
  console.log("queryclient",queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ ConfirmProvider wraps BOTH ModalProvider AND its children */}
      <ConfirmProvider>
        <ModalProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
            <ScrollRestoration />
          </Suspense>
        </ModalProvider>
      </ConfirmProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
