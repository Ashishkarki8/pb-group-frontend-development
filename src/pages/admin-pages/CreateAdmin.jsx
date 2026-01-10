import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

function CreateAdmin() {
  const { user } = useAuthStore();

  return (
    <div style={{ padding: "20px" }}>
      <h1>➕ Create New Admin</h1>
      <p style={{ color: "#666" }}>Only SuperAdmins can access this page</p>
      
      <div style={{ marginTop: "20px", padding: "15px", background: "#fff3e0" }}>
        <p><strong>Logged in as:</strong> {user?.username} ({user?.role})</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>🎉 Your admin registration form will go here!</p>
        <p>You already have this built, right?</p>
      </div>

      <Link to="/admin/dashboard">
        <button style={{ marginTop: "20px" }}>
          ← Back to Dashboard
        </button>
      </Link>
    </div>
  );
}

export default CreateAdmin;