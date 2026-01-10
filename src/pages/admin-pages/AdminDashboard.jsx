// 📁 src/pages/AdminDashboard.jsx
// ========================================
// 🎯 PURPOSE: Admin dashboard (for both admin and superadmin)
// ========================================

import { useLogout } from "../../hooks/useAuth";
import useAuthStore from "../../store/authStore";


export default function AdminDashboard() {
  // Get user data from Zustand store
  const { user } = useAuthStore();
  
  // Get logout function
  const { mutate: logout, isPending } = useLogout();

  console.log('👤 AdminDashboard: Current user:', user);

  return (
    <div style={{ padding: '40px' }}>
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Admin Dashboard</h1>
        
        {/* USER INFO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Logged in as:</div>
            <div style={{ fontWeight: 'bold' }}>
              {user?.username} ({user?.role})
            </div>
          </div>
          
          {/* LOGOUT BUTTON */}
          <button
            onClick={() => {
              console.log('🚪 Logout button clicked');
              logout();
            }}
            disabled={isPending}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {isPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTENT */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Welcome to Admin Panel!</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>
          You are logged in as <strong>{user?.role}</strong>
        </p>

        {/* STATS CARDS */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px',
          marginTop: '30px'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Total Posts</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>42</p>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Active Users</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>128</p>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Comments</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>356</p>
          </div>
        </div>
      </div>
    </div>
  );
}