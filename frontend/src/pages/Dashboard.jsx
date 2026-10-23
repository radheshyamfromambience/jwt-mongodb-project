import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Student Dashboard</h2>

        <button onClick={logout}>
          Logout
        </button>
      </header>

      <div className="dashboard-card">
        <h1>Welcome, {user?.name}!</h1>

        <p>
          You have successfully logged in.
        </p>

        <div className="user-details">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Role:</strong> {user?.role}
          </p>

          <p>
            <strong>User ID:</strong> {user?.id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;