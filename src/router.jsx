// 📁 src/router.jsx
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

import App from './App';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

import { GuestRoute } from './components/features/auth/GuestRoute';
import { ProtectedRoute } from './components/features/auth/ProtectedRoute';

import Home from './pages/Home';
import AllCourses from './pages/CoursesPage';
import AllClientsPartners from './pages/ClientsAndPartnersPage';
import BlogPage from './pages/BlogPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import OurWorksPage from './pages/OurWorksPage';
import TeamPage from './pages/TeamPage';
import CareersPage from './pages/CareersPage';

import LoginPage from './pages/admin-pages/LoginPage';
import AdminDashboard from './pages/admin-pages/AdminDashboard';
import AdminRegister from './pages/admin-pages/AdminRegister';
import Unauthorized from './pages/admin-pages/Unauthorized';
import NotFoundPage from './pages/NotFoundPage';
import Testing from './pages/admin-pages/Testing';

export const router = createBrowserRouter([
  {
    element: <App />, // ✅ Remove children from here
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'courses', element: <AllCourses /> },
          { path: 'clients-partners', element: <AllClientsPartners /> },
          { path: 'blogs', element: <BlogPage /> },
          { path: 'our-works', element: <OurWorksPage /> },
          { path: 'teams', element: <TeamPage /> },
          { path: 'careers', element: <CareersPage /> },

          { path: 'courses/:slug', element: <CourseDetailsPage /> },
          { path: 'blogs/:slug', element: <BlogDetailsPage /> },
          { path: 'services/:slug', element: <ServiceDetailPage /> },
        ],
      },

      {
        path: '/admin/login',
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },

      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'testing', element: <Testing /> },
          

          {
            path: 'create-admin',
            element: (
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminRegister />
              </ProtectedRoute>
            ),
          },
        ],
      },

      { path: '/unauthorized', element: <Unauthorized /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);