import useAuthStore from "../../store/authStore.js";
import useLogout from "../../hooks/useLogout.js";

function Dashboard() {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Admin Dashboard</h1>
      <div style={{ marginTop: "20px" }}>
        <p><strong>Welcome:</strong> {user?.name}</p>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      <button 
        onClick={() => logout()}
        disabled={isPending}
        style={{ marginTop: "20px" }}
      >
        {isPending ? "Logging out..." : "🚪 Logout"}
      </button>

      <div style={{ marginTop: "30px", padding: "15px", background: "#f0f0f0" }}>
        <h3>Regular Admin Features:</h3>
        <ul>
          <li>✅ View dashboard</li>
          <li>✅ Manage content</li>
          <li>❌ Cannot create new admins</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

























// import React, { useState, useMemo } from 'react';
// import {
//   LayoutDashboard,
//   Users,
//   BookOpen,
//   UserCheck,
//   FileBarChart,
//   Settings,
//   Search,
//   Bell,
//   ChevronDown,
//   Menu,
//   X,
//   Eye,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Calendar
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar
// } from 'recharts';

// // Mock data
// const studentsData = [
//   { id: 1, name: 'Aashish Sharma', email: 'aashish@gmail.com', course: 'Data Science', status: 'Active', joinDate: '2024-01-15', progress: 75 },
//   { id: 2, name: 'Priya Thapa', email: 'priya@gmail.com', course: 'Statistics', status: 'Active', joinDate: '2024-02-10', progress: 60 },
//   { id: 3, name: 'Rajesh Gurung', email: 'rajesh@gmail.com', course: 'Research Methods', status: 'Inactive', joinDate: '2024-01-20', progress: 30 },
//   { id: 4, name: 'Sita Rai', email: 'sita@gmail.com', course: 'Data Science', status: 'Active', joinDate: '2024-03-05', progress: 90 },
//   { id: 5, name: 'Kumar Tamang', email: 'kumar@gmail.com', course: 'Analytics', status: 'Active', joinDate: '2024-02-28', progress: 45 },
// ];

// const chartData = [
//   { month: 'Jan', students: 120, revenue: 85000 },
//   { month: 'Feb', students: 145, revenue: 92000 },
//   { month: 'Mar', students: 180, revenue: 110000 },
//   { month: 'Apr', students: 165, revenue: 105000 },
//   { month: 'May', students: 200, revenue: 125000 },
//   { month: 'Jun', students: 225, revenue: 140000 },
// ];

// const courseData = [
//   { course: 'Data Science', enrolled: 85 },
//   { course: 'Statistics', enrolled: 62 },
//   { course: 'Research Methods', enrolled: 45 },
//   { course: 'Analytics', enrolled: 38 },
// ];

// // Sidebar Component
// const Sidebar = ({ isOpen, onToggle, activeTab, setActiveTab }) => {
//   const menuItems = [
//     { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//     { id: 'students', icon: Users, label: 'Students' },
//     { id: 'courses', icon: BookOpen, label: 'Courses' },
//     { id: 'teachers', icon: UserCheck, label: 'Teachers' },
//     { id: 'reports', icon: FileBarChart, label: 'Reports' },
//     { id: 'settings', icon: Settings, label: 'Settings' },
//   ];

//   return (
//     <>
//       {/* Mobile backdrop */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={onToggle}
//         />
//       )}
      
//       {/* Sidebar */}
//       <div className={`
//         fixed top-0 left-0 h-full bg-slate-800 text-white z-50 transition-transform duration-300
//         ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0 lg:static lg:z-auto
//         w-64 flex-shrink-0
//       `}>
//         {/* Logo & Close Button */}
//         <div className="flex items-center justify-between p-6 border-b border-slate-700">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
//               PB
//             </div>
//             <span className="text-xl font-bold">Admin</span>
//           </div>
//           <button onClick={onToggle} className="lg:hidden p-1">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 space-y-2">
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`
//                 w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200
//                 ${activeTab === item.id 
//                   ? 'bg-blue-600 text-white' 
//                   : 'text-slate-300 hover:text-white hover:bg-slate-700'
//                 }
//               `}
//             >
//               <item.icon size={20} />
//               <span className="font-medium">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>
//     </>
//   );
// };

// // Header Component
// const Header = ({ onSidebarToggle, title }) => {
//   return (
//     <header className="bg-white border-b border-gray-200 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onSidebarToggle}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
//           >
//             <Menu size={20} />
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <button className="p-2 rounded-lg hover:bg-gray-100 relative">
//             <Bell size={20} className="text-gray-600" />
//             <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
//               3
//             </span>
//           </button>
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//               A
//             </div>
//             <span className="text-gray-700 font-medium hidden sm:block">Admin</span>
//             <ChevronDown size={16} className="text-gray-500" />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Stat Card Component
// const StatCard = ({ title, value, change, icon: Icon, trend }) => {
//   const isPositive = trend === 'up';
  
//   return (
//     <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-600 text-sm font-medium">{title}</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//           <div className={`flex items-center mt-2 text-sm ${
//             isPositive ? 'text-green-600' : 'text-red-600'
//           }`}>
//             {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//             <span className="ml-1 font-medium">{change}</span>
//             <span className="text-gray-500 ml-1">vs last month</span>
//           </div>
//         </div>
//         <div className="p-4 bg-blue-50 rounded-xl">
//           <Icon size={24} className="text-blue-600" />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Table Component with TanStack Table logic
// const StudentsTable = () => {
//   const [data, setData] = useState(studentsData);
//   const [sorting, setSorting] = useState({ column: null, direction: 'asc' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const itemsPerPage = 3;

//   // Filter data based on search
//   const filteredData = useMemo(() => {
//     return data.filter(student =>
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.course.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [data, searchTerm]);

//   // Sort data
//   const sortedData = useMemo(() => {
//     if (!sorting.column) return filteredData;
    
//     return [...filteredData].sort((a, b) => {
//       const aVal = a[sorting.column];
//       const bVal = b[sorting.column];
      
//       if (typeof aVal === 'string') {
//         return sorting.direction === 'asc' 
//           ? aVal.localeCompare(bVal)
//           : bVal.localeCompare(aVal);
//       }
      
//       return sorting.direction === 'asc' ? aVal - bVal : bVal - aVal;
//     });
//   }, [filteredData, sorting]);

//   // Paginate data
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedData.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedData, currentPage]);

//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);

//   const handleSort = (column) => {
//     setSorting(prev => ({
//       column,
//       direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const getStatusBadge = (status) => {
//     return status === 'Active' 
//       ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'
//       : 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium';
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
//       {/* Table Header */}
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//           <h2 className="text-xl font-bold text-gray-900">Students Management</h2>
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
//               Add Student
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               {[
//                 { key: 'name', label: 'Name' },
//                 { key: 'email', label: 'Email' },
//                 { key: 'course', label: 'Course' },
//                 { key: 'status', label: 'Status' },
//                 { key: 'progress', label: 'Progress' },
//                 { key: 'joinDate', label: 'Join Date' },
//               ].map((header) => (
//                 <th
//                   key={header.key}
//                   onClick={() => handleSort(header.key)}
//                   className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>{header.label}</span>
//                     {sorting.column === header.key && (
//                       <ChevronDown size={16} className={sorting.direction === 'desc' ? 'rotate-180' : ''} />
//                     )}
//                   </div>
//                 </th>
//               ))}
//               <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {paginatedData.map((student) => (
//               <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                       {student.name.charAt(0)}
//                     </div>
//                     <span className="font-medium text-gray-900">{student.name}</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-gray-600">{student.email}</td>
//                 <td className="px-6 py-4 text-gray-900 font-medium">{student.course}</td>
//                 <td className="px-6 py-4">
//                   <span className={getStatusBadge(student.status)}>
//                     {student.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center space-x-2">
//                     <div className="flex-1 bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${student.progress}%` }}
//                       />
//                     </div>
//                     <span className="text-sm text-gray-600 font-medium">{student.progress}%</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-gray-600">{student.joinDate}</td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center space-x-2">
//                     <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
//                       <Eye size={16} />
//                     </button>
//                     <button className="p-1 text-green-600 hover:bg-green-50 rounded">
//                       <Edit size={16} />
//                     </button>
//                     <button className="p-1 text-red-600 hover:bg-red-50 rounded">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//           <div className="text-sm text-gray-600">
//             Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//               disabled={currentPage === 1}
//               className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               <ChevronLeft size={16} />
//             </button>
            
//             {[...Array(totalPages)].map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentPage(index + 1)}
//                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
//                   currentPage === index + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//               >
//                 {index + 1}
//               </button>
//             ))}
            
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Dashboard Content
// const DashboardContent = () => {
//   return (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Students"
//           value="1,247"
//           change="+12%"
//           icon={Users}
//           trend="up"
//         />
//         <StatCard
//           title="Active Courses"
//           value="24"
//           change="+8%"
//           icon={BookOpen}
//           trend="up"
//         />
//         <StatCard
//           title="Revenue"
//           value="₹1,25,000"
//           change="+15%"
//           icon={DollarSign}
//           trend="up"
//         />
//         <StatCard
//           title="This Month"
//           value="225"
//           change="-3%"
//           icon={Calendar}
//           trend="down"
//         />
//       </div>

//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Line Chart */}
//         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">Student Enrollment Trend</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="month" stroke="#6b7280" />
//               <YAxis stroke="#6b7280" />
//               <Tooltip 
//                 contentStyle={{ 
//                   backgroundColor: '#fff', 
//                   border: '1px solid #e5e7eb',
//                   borderRadius: '8px'
//                 }}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="students" 
//                 stroke="#2563eb" 
//                 strokeWidth={3}
//                 dot={{ fill: '#2563eb', r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Bar Chart */}
//         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">Course Popularity</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={courseData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="course" stroke="#6b7280" />
//               <YAxis stroke="#6b7280" />
//               <Tooltip 
//                 contentStyle={{ 
//                   backgroundColor: '#fff', 
//                   border: '1px solid #e5e7eb',
//                   borderRadius: '8px'
//                 }}
//               />
//               <Bar dataKey="enrolled" fill="#2563eb" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
//         </div>
//         <div className="p-6">
//           <div className="space-y-4">
//             {[
//               { user: 'Aashish Sharma', action: 'completed Data Science Module 3', time: '2 hours ago' },
//               { user: 'Priya Thapa', action: 'enrolled in Statistics Course', time: '4 hours ago' },
//               { user: 'Rajesh Gurung', action: 'submitted assignment for Research Methods', time: '6 hours ago' },
//             ].map((activity, index) => (
//               <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//                 <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                   {activity.user.charAt(0)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-gray-900 font-medium">
//                     <span className="text-blue-600">{activity.user}</span> {activity.action}
//                   </p>
//                   <p className="text-gray-500 text-sm">{activity.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Dashboard Component
// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');

//   const getPageTitle = (tab) => {
//     const titles = {
//       dashboard: 'Dashboard Overview',
//       students: 'Students Management',
//       courses: 'Courses Management',
//       teachers: 'Teachers Management',
//       reports: 'Reports & Analytics',
//       settings: 'Settings'
//     };
//     return titles[tab] || 'Dashboard';
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardContent />;
//       case 'students':
//         return <StudentsTable />;
//       case 'courses':
//         return (
//           <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
//             <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Courses Management</h3>
//             <p className="text-gray-600">Course management interface coming soon...</p>
//           </div>
//         );
//       case 'teachers':
//         return (
//           <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
//             <UserCheck size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Teachers Management</h3>
//             <p className="text-gray-600">Teacher management interface coming soon...</p>
//           </div>
//         );
//       case 'reports':
//         return (
//           <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
//             <FileBarChart size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Reports & Analytics</h3>
//             <p className="text-gray-600">Advanced reporting features coming soon...</p>
//           </div>
//         );
//       case 'settings':
//         return (
//           <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
//             <Settings size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
//             <p className="text-gray-600">System settings and configuration options...</p>
//           </div>
//         );
//       default:
//         return <DashboardContent />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         <Sidebar 
//           isOpen={sidebarOpen}
//           onToggle={() => setSidebarOpen(!sidebarOpen)}
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//         />
        
//         <div className="flex-1 lg:ml-0">
//           <Header 
//             onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
//             title={getPageTitle(activeTab)}
//           />
          
//           <main className="p-6">
//             {renderContent()}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;