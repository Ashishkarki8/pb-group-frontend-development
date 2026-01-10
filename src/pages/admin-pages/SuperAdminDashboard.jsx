// ========================================
// 📁 src/pages/SuperAdminDashboard.jsx
// ========================================

import { useLogout } from "../../hooks/useAuth";
import useAuthStore from "../../store/authStore";

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>👑 Super Admin Dashboard</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Super Admin:</div>
            <div style={{ fontWeight: 'bold' }}>{user?.username}</div>
          </div>
          
          <button
            onClick={() => logout()}
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

      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>🔐 Super Admin Features</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>
          You have full access to all features
        </p>

        {/* SUPER ADMIN FEATURES */}
        <div style={{ marginTop: '30px' }}>
          <button style={{
            padding: '15px 30px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}>
            ➕ Register New Admin
          </button>

          <button style={{
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            👥 Manage All Admins
          </button>
        </div>
      </div>
    </div>
  );
}