import { NavLink, Outlet } from 'react-router-dom';
import { Home, User, Users, LogOut } from 'lucide-react';
// import useAuthStore from '../store/authStore';
// import useAuth from '../hooks/useAuth';
// import { ROUTES } from '../utils/constants';

// const navButtonClasses = ({ isActive }) =>
//   `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//     isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
//   }`;

export default function AdminLayout() {
  // const canManageAdmins = useAuthStore((state) => state.isSuperAdmin());
  // const user = useAuthStore((state) => state.user);
  // const { logout, isLoggingOut } = useAuth();

  // const navItems = [
  //   { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: Home },
  //   { to: ROUTES.ADMIN_PROFILE, label: 'Profile', icon: User },
  // ];

  // if (canManageAdmins) {
  //   navItems.push({
  //     to: ROUTES.ADMIN_LIST,
  //     label: 'Admins',
  //     icon: Users,
  //   });
  // }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">PB Group</h1>
          <p className="text-sm text-gray-500">Secure Admin Portal</p>
        </div>

        <nav className="space-y-2 mt-8 flex-1">
          {/* {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navButtonClasses} end>
              <Icon size={18} />
              {label}
            </NavLink>
          ))} */}
        </nav>

        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Logged in as</p>
            <p className="text-base font-semibold text-gray-900 mt-1">{user?.username ?? 'Admin'}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role ? user.role.replace('_', ' ') : ''}
            </p>
          </div>
          {/* <button
            onClick={logout}
            disabled={isLoggingOut}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LogOut size={16} />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button> */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
