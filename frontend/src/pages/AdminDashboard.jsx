import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import api from "../services/api";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users/admin");

        setUsers(response.data.users);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to fetch users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Admin Dashboard</h2>

        <button onClick={logout}>
          Logout
        </button>
      </header>

      <div className="dashboard-card">
        <h1>Welcome, {user?.name}!</h1>

        <p>Admin Control Panel</p>

        <h3>Registered Users</h3>

        {loading && <p>Loading users...</p>}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;