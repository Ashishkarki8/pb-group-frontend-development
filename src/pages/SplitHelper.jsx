// import React, { useState } from 'react';
// import {
//   LayoutDashboard,
//   BookOpen,
//   UserCheck,
//   FileBarChart,
//   Settings,
//   Search,
//   Bell,
//   ChevronDown,
//   ChevronRight,
//   Menu,
//   X,
//   LogOut,
//   Image,
//   LayoutGrid,
//   Shield,
//   FileText,
//   Home,
//   Briefcase,
//   Info
// } from 'lucide-react';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({});
//   const [currentPath, setCurrentPath] = useState('/admin/dashboard');
  
//   const user = {
//     username: 'admin',
//     role: 'super_admin'
//   };

//   const toggleSection = (sectionId) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sectionId]: !prev[sectionId]
//     }));
//   };

//   const getMenuItems = () => {
//     const baseItems = [
//       { 
//         id: 'dashboard', 
//         icon: LayoutDashboard, 
//         label: 'Dashboard', 
//         path: '/admin/dashboard' 
//       },
//       { 
//         id: 'admins', 
//         icon: Shield, 
//         label: 'Admins', 
//         path: '/admin/admins' 
//       },
//       {
//         id: 'cms',
//         icon: FileText,
//         label: 'CMS Management',
//         type: 'dropdown',
//         children: [
//           {
//             id: 'homepage',
//             label: 'Homepage Sections',
//             type: 'dropdown',
//             children: [
//               { id: 'hero', icon: Home, label: 'Hero Section', path: '/admin/cms/hero' },
//               { id: 'services', icon: Briefcase, label: 'Services Section', path: '/admin/cms/services' },
//               { id: 'about', icon: Info, label: 'About Section', path: '/admin/cms/about' }
//             ]
//           }
//         ]
//       },
//       { 
//         id: 'banners', 
//         icon: Image, 
//         label: 'Banner', 
//         path: '/admin/banners' 
//       },
//       { 
//         id: 'services', 
//         icon: LayoutGrid, 
//         label: 'Services', 
//         path: '/admin/services' 
//       },
//       { 
//         id: 'courses', 
//         icon: BookOpen, 
//         label: 'Courses', 
//         path: '/admin/courses' 
//       },
//       { 
//         id: 'reports', 
//         icon: FileBarChart, 
//         label: 'Reports', 
//         path: '/admin/reports' 
//       },
//     ];

//     if (user?.role === 'super_admin') {
//       baseItems.splice(3, 0, {
//         id: 'teachers',
//         icon: UserCheck,
//         label: 'Teachers',
//         path: '/admin/teachers'
//       });
//       baseItems.push({
//         id: 'settings',
//         icon: Settings,
//         label: 'Settings',
//         path: '/admin/settings'
//       });
//     }

//     return baseItems;
//   };

//   const menuItems = getMenuItems();

//   const isActive = (path) => {
//     if (!path) return false;
//     return currentPath === path || currentPath.startsWith(path + '/');
//   };

//   const renderMenuItem = (item, level = 0) => {
//     if (item.type === 'dropdown') {
//       const isExpanded = expandedSections[item.id];
      
//       return (
//         <div key={item.id}>
//           <button
//             onClick={() => toggleSection(item.id)}
//             className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors duration-200 text-slate-300 hover:text-white hover:bg-slate-700 ${
//               level > 0 ? 'pl-8' : ''
//             }`}
//           >
//             <div className="flex items-center space-x-3">
//               {item.icon && <item.icon size={20} />}
//               <span className="font-medium">{item.label}</span>
//             </div>
//             {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//           </button>
          
//           {isExpanded && item.children && (
//             <div className="mt-1 space-y-1">
//               {item.children.map(child => renderMenuItem(child, level + 1))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     const active = isActive(item.path);
//     return (
//       <button
//         key={item.id}
//         onClick={() => setCurrentPath(item.path)}
//         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
//           level > 0 ? 'pl-12' : ''
//         } ${
//           active
//             ? 'bg-blue-600 text-white shadow-lg'
//             : 'text-slate-300 hover:text-white hover:bg-slate-700'
//         }`}
//       >
//         {item.icon && <item.icon size={20} />}
//         <span className="font-medium">{item.label}</span>
//       </button>
//     );
//   };

//   const getPageContent = () => {
//     switch(currentPath) {
//       case '/admin/cms/hero':
//         return (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-2xl font-bold mb-6">Hero Section Editor</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Hero Title</label>
//                 <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter hero title" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
//                 <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter subtitle" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Background Image URL</label>
//                 <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter image URL" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Call-to-Action Text</label>
//                 <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter CTA text" />
//               </div>
//               <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         );
//       case '/admin/cms/services':
//         return (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-2xl font-bold mb-6">Services Section Editor</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Section Title</label>
//                 <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Our Services" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Section Description</label>
//                 <textarea className="w-full px-4 py-2 border rounded-lg" rows="3" placeholder="Describe your services"></textarea>
//               </div>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold mb-3">Service Items</h3>
//                 <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
//                   + Add Service Item
//                 </button>
//               </div>
//               <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         );
//       case '/admin/cms/about':
//         return (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-2xl font-bold mb-6">About Section Editor</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">About Title</label>
//                 <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="About Us" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">About Description</label>
//                 <textarea className="w-full px-4 py-2 border rounded-lg" rows="5" placeholder="Tell your story"></textarea>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Team Photo URL</label>
//                 <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter image URL" />
//               </div>
//               <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         );
//       default:
//         return (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Welcome to Admin Dashboard</h2>
//             <p className="text-gray-600 mb-4">
//               Click on the CMS Management dropdown to see nested sections.
//             </p>
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <p className="text-sm text-blue-800">
//                 <strong>Try clicking:</strong> CMS Management → Homepage Sections → Hero Section
//               </p>
//             </div>
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
//                 <div className="text-3xl font-bold">24</div>
//                 <div className="text-sm opacity-90">Total Courses</div>
//               </div>
//               <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
//                 <div className="text-3xl font-bold">156</div>
//                 <div className="text-sm opacity-90">Active Students</div>
//               </div>
//               <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
//                 <div className="text-3xl font-bold">8</div>
//                 <div className="text-sm opacity-90">Teachers</div>
//               </div>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}
        
//         <div className={`
//           fixed top-0 left-0 h-full bg-slate-800 text-white z-50 transition-transform duration-300
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//           lg:translate-x-0 lg:static lg:z-auto
//           w-64 flex-shrink-0 flex flex-col
//         `}>
//           <div className="flex items-center justify-between p-6 border-b border-slate-700">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
//                 PB
//               </div>
//               <div>
//                 <span className="text-xl font-bold block">Admin</span>
//                 <span className="text-xs text-slate-400 capitalize">{user?.role}</span>
//               </div>
//             </div>
//             <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
//               <X size={20} />
//             </button>
//           </div>

//           <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
//             {menuItems.map((item) => renderMenuItem(item))}
//           </nav>

//           <div className="p-4 border-t border-slate-700">
//             <div className="flex items-center space-x-3 px-4 py-3 bg-slate-700 rounded-lg mb-2">
//               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                 A
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-white font-medium truncate">{user?.username}</p>
//                 <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
//               </div>
//             </div>
//             <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 text-red-400 hover:text-red-300 hover:bg-slate-700">
//               <LogOut size={20} />
//               <span className="font-medium">Logout</span>
//             </button>
//           </div>
//         </div>
        
//         <div className="flex-1 lg:ml-0 w-full">
//           <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => setSidebarOpen(true)}
//                   className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
//                 >
//                   <Menu size={20} />
//                 </button>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   Super Admin Panel
//                 </h1>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <div className="relative hidden md:block">
//                   <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <button className="p-2 rounded-lg hover:bg-gray-100 relative">
//                   <Bell size={20} className="text-gray-600" />
//                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
//                     3
//                   </span>
//                 </button>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                     A
//                   </div>
//                   <span className="text-gray-700 font-medium hidden sm:block">{user?.username}</span>
//                   <ChevronDown size={16} className="text-gray-500" />
//                 </div>
//               </div>
//             </div>
//           </header>
          
//           <main className="p-6">
//             {getPageContent()}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;




//create service

//service management place
import React from 'react';
import { useModal } from '../../hooks/useModal.js';
import { useConfirm } from '../../hooks/useConfirm.js';
import CreateServiceForm from '../../components/forms/CreateServiceForm';
import EditUserForm from '../../components/forms/EditUserForm';



const ServiceManagement = () => {
  const { openModal, closeModal } = useModal();
  const { confirm } = useConfirm();

  const handleCreateService = () => {
    openModal(
      <CreateServiceForm onClose={closeModal} />,
      'Create New Service',
      'lg'
    );
  };

  const handleEditUser = () => {
    openModal(
      <EditUserForm onClose={closeModal} />,
      'Edit User',
      'default'
    );
  };

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Delete Item?',
      message: 'This action cannot be undone. All data will be permanently deleted.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (result) {
      alert('Item deleted!');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ServiceManagement</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={handleCreateService}
            className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Create Service</h3>
            <p className="text-sm opacity-90">Add a new service to your catalog</p>
          </button>

          <button
            onClick={handleEditUser}
            className="p-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Edit User</h3>
            <p className="text-sm opacity-90">Update user information</p>
          </button>

          <button
            onClick={handleDelete}
            className="p-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Delete Item</h3>
            <p className="text-sm opacity-90">Remove an item permanently</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
