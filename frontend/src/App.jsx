import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import CreateIssue from './pages/CreateIssue';
import Updates from './pages/Updates';
import CreateUpdate from './pages/CreateUpdate';
import Politicians from './pages/Politicians';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegister from './pages/AdminRegister';
import ModeratorRegister from './pages/ModeratorRegister';
import ModeratorDashboard from './pages/ModeratorDashboard';
import CitizenRegister from './pages/CitizenRegister';
import PoliticianRegister from './pages/PoliticianRegister';

function App() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
                    />
                    <Route
                        path="/register"
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
                    />
                    <Route path="/updates" element={<Updates />} />
                    <Route path="/politicians" element={<Politicians />} />

                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/issues" element={<Issues />} />
                        <Route path="/issues/:id" element={<IssueDetail />} />
                        <Route path="/issues/create" element={<CreateIssue />} />
                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="/profile" element={<Profile />} />

                        {/* Politician Routes */}
                        <Route path="/updates/create" element={<CreateUpdate />} />

                        {/* Admin Routes */}
                        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/register" element={<AdminRegister />} />
                            <Route path="/admin/register-moderator" element={<ModeratorRegister />} />
                            <Route path="/admin/register-citizen" element={<CitizenRegister />} />
                            <Route path="/admin/register-politician" element={<PoliticianRegister />} />
                        </Route>

                        {/* Moderator Routes */}
                        <Route element={<PrivateRoute allowedRoles={['MODERATOR']} />}>
                            <Route path="/moderator" element={<ModeratorDashboard />} />
                        </Route>
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
