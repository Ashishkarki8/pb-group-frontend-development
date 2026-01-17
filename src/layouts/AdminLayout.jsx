import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  FileBarChart,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useLogout } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  // Menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
      { id: 'students', icon: Users, label: 'Students', path: '/admin/students' },
      { id: 'courses', icon: BookOpen, label: 'Courses', path: '/admin/courses' },
      { id: 'reports', icon: FileBarChart, label: 'Reports', path: '/admin/reports' },
    ];

    // Superadmin gets additional menu items
    if (user?.role === 'super_admin') {
      baseItems.splice(3, 0, {
        id: 'teachers',
        icon: UserCheck,
        label: 'Teachers',
        path: '/admin/teachers'
      });
      baseItems.push({
        id: 'settings',
        icon: Settings,
        label: 'Settings',
        path: '/admin/settings'
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed top-0 left-0 h-full bg-slate-800 text-white z-50 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          w-64 flex-shrink-0
        `}>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
                PB
              </div>
              <div>
                <span className="text-xl font-bold block">Admin</span>
                <span className="text-xs text-slate-400 capitalize">{user?.role}</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 flex-1">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 px-4 py-3 bg-slate-700 rounded-lg mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.username}</p>
                <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              disabled={isPending}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 text-red-400 hover:text-red-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut size={20} />
              <span className="font-medium">{isPending ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0 w-full">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.role === 'super_admin' ? 'Super Admin Panel' : 'Admin Panel'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium hidden sm:block">{user?.username}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;