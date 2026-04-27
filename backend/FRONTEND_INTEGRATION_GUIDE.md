# Frontend Integration Guide for ADMIN and MODERATOR Roles

## ADMIN Dashboard Components

### 1. Admin Navigation Menu
```jsx
// AdminNavigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavigation = () => {
  return (
    <nav className="admin-nav">
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/users">User Management</Link></li>
        <li><Link to="/admin/users/citizens">Citizens</Link></li>
        <li><Link to="/admin/users/politicians">Politicians</Link></li>
        <li><Link to="/admin/users/moderators">Moderators</Link></li>
        <li><Link to="/admin/statistics">Statistics</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavigation;
```

### 2. Admin Dashboard
```jsx
// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Citizens</h3>
          <p className="stat-value">{stats?.totalCitizens || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Politicians</h3>
          <p className="stat-value">{stats?.totalPoliticians || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Moderators</h3>
          <p className="stat-value">{stats?.totalModerators || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Admins</h3>
          <p className="stat-value">{stats?.totalAdmins || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Issues</h3>
          <p className="stat-value">{stats?.totalIssues || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

### 3. User Management Component
```jsx
// UserManagement.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDisableUser = async (userId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.put(`/admin/users/${userId}/disable`);
        setUsers(users.map(u => u.id === userId ? { ...u, enabled: false } : u));
      } catch (error) {
        console.error('Error disabling user:', error);
      }
    }
  };

  const handleEnableUser = async (userId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.put(`/admin/users/${userId}/enable`);
        setUsers(users.map(u => u.id === userId ? { ...u, enabled: true } : u));
      } catch (error) {
        console.error('Error enabling user:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('This action cannot be undone!')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={user.enabled ? 'status-active' : 'status-inactive'}>
                  {user.enabled ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="actions">
                {user.enabled ? (
                  <button onClick={() => handleDisableUser(user.id)} className="btn-warning">
                    Disable
                  </button>
                ) : (
                  <button onClick={() => handleEnableUser(user.id)} className="btn-success">
                    Enable
                  </button>
                )}
                <button onClick={() => handleDeleteUser(user.id)} className="btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
```

---

## MODERATOR Dashboard Components

### 1. Moderator Navigation Menu
```jsx
// ModeratorNavigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ModeratorNavigation = () => {
  return (
    <nav className="moderator-nav">
      <ul>
        <li><Link to="/moderator/dashboard">Dashboard</Link></li>
        <li><Link to="/moderator/issues/pending">Pending Issues</Link></li>
        <li><Link to="/moderator/issues">All Issues</Link></li>
        <li><Link to="/moderator/comments">Comments Review</Link></li>
      </ul>
    </nav>
  );
};

export default ModeratorNavigation;
```

### 2. Moderator Dashboard
```jsx
// ModeratorDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const ModeratorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/moderator/dashboard/stats');
        setStats(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="moderator-dashboard">
      <h1>Moderation Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending Issues</h3>
          <p className="stat-value">{stats?.pendingIssues || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
```

### 3. Pending Issues Component
```jsx
// PendingIssues.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const PendingIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingIssues = async () => {
      try {
        const response = await api.get('/moderator/issues/pending');
        setIssues(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pending issues:', error);
        setLoading(false);
      }
    };

    fetchPendingIssues();
  }, []);

  const handleApproveIssue = async (issueId) => {
    try {
      await api.put(`/moderator/issues/${issueId}/approve`);
      setIssues(issues.filter(i => i.id !== issueId));
    } catch (error) {
      console.error('Error approving issue:', error);
    }
  };

  const handleRejectIssue = async (issueId) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason) {
      try {
        await api.put(`/moderator/issues/${issueId}/reject`, { reason });
        setIssues(issues.filter(i => i.id !== issueId));
      } catch (error) {
        console.error('Error rejecting issue:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="pending-issues">
      <h1>Pending Issues for Approval</h1>
      <div className="issues-list">
        {issues.map(issue => (
          <div key={issue.id} className="issue-card">
            <h3>{issue.title}</h3>
            <p><strong>Category:</strong> {issue.category}</p>
            <p><strong>Location:</strong> {issue.location}</p>
            <p><strong>Description:</strong> {issue.description}</p>
            <p><strong>Citizen:</strong> {issue.citizenName}</p>
            <div className="actions">
              <button 
                onClick={() => handleApproveIssue(issue.id)} 
                className="btn-success"
              >
                Approve
              </button>
              <button 
                onClick={() => handleRejectIssue(issue.id)} 
                className="btn-warning"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingIssues;
```

### 4. Comments Review Component
```jsx
// CommentsReview.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const CommentsReview = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get('/moderator/comments/all');
        setComments(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleRemoveComment = async (commentId) => {
    if (window.confirm('Remove this comment?')) {
      try {
        await api.delete(`/moderator/comments/${commentId}`);
        setComments(comments.filter(c => c.id !== commentId));
      } catch (error) {
        console.error('Error removing comment:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="comments-review">
      <h1>Comments Review</h1>
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-card">
            <p><strong>User:</strong> {comment.userName}</p>
            <p><strong>Issue ID:</strong> {comment.issueId}</p>
            <p><strong>Content:</strong> {comment.content}</p>
            <p><strong>Date:</strong> {new Date(comment.createdAt).toLocaleString()}</p>
            <button 
              onClick={() => handleRemoveComment(comment.id)} 
              className="btn-danger"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsReview;
```

---

## API Configuration File

```jsx
// api/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

---

## Routing Setup

```jsx
// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ModeratorDashboard from './pages/moderator/ModeratorDashboard';
import PendingIssues from './pages/moderator/PendingIssues';
import CommentsReview from './pages/moderator/CommentsReview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* Moderator Routes */}
        <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
        <Route path="/moderator/issues/pending" element={<PendingIssues />} />
        <Route path="/moderator/comments" element={<CommentsReview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## API Endpoints Summary

### ADMIN Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/role/{role}` - Get users by role
- `PUT /api/admin/users/{id}/disable` - Disable user
- `PUT /api/admin/users/{id}/enable` - Enable user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### MODERATOR Endpoints
- `GET /api/moderator/issues/pending` - Get pending issues
- `GET /api/moderator/issues/all` - Get all issues
- `PUT /api/moderator/issues/{id}/approve` - Approve issue
- `PUT /api/moderator/issues/{id}/reject` - Reject issue
- `DELETE /api/moderator/comments/{id}` - Remove comment
- `GET /api/moderator/comments/all` - Get all comments
- `GET /api/moderator/dashboard/stats` - Get moderation stats

### REGISTRATION Endpoints
- `POST /api/auth/register` - Register citizen
- `POST /api/auth/register/politician` - Register politician
- `POST /api/auth/register/admin` - Register admin
- `POST /api/auth/register/moderator` - Register moderator
