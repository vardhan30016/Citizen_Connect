import { useSelector } from 'react-redux';
import CitizenDashboard from './CitizenDashboard';
import PoliticianDashboard from './PoliticianDashboard';
import ModeratorDashboard from './ModeratorDashboard';
import AdminDashboard from './AdminDashboard';

function Dashboard() {
    const { user } = useSelector((state) => state.auth);

    // Route to role-specific dashboard
    switch (user?.role) {
        case 'CITIZEN':
            return <CitizenDashboard />;
        case 'POLITICIAN':
            return <PoliticianDashboard />;
        case 'MODERATOR':
            return <ModeratorDashboard />;
        case 'ADMIN':
            return <AdminDashboard />;
        default:
            return <CitizenDashboard />;
    }
}

export default Dashboard;
