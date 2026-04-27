import axios from 'axios';

// Create axios instance with correct backend base URL
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
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

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    registerAdmin: (userData) => api.post('/auth/register/admin', userData),
    registerModerator: (userData) => api.post('/auth/register/moderator', userData),
    registerPolitician: (userData) => api.post('/auth/register/politician', userData),
    getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    getByRole: (role) => api.get(`/users/role/${role}`),
    getPoliticians: () => api.get('/users/politicians'),
    getPoliticiansByConstituency: (constituency) => api.get(`/users/politicians/constituency/${constituency}`),
    create: (userData) => api.post('/users', userData),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    updateRole: (id, role) => api.put(`/users/${id}/role?role=${role}`),
    toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
    delete: (id) => api.delete(`/users/${id}`),
    getStats: () => api.get('/users/stats'),
};

// Admin API
export const adminAPI = {
    getAllUsers: () => api.get('/admin/users'),
    getUsersByRole: (role) => api.get(`/admin/users/role/${role}`),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role?role=${role}`),
    enableUser: (id) => api.put(`/admin/users/${id}/enable`),
    disableUser: (id) => api.put(`/admin/users/${id}/disable`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

// Moderator API
export const moderatorAPI = {
    getPendingIssues: () => api.get('/moderator/issues/pending'),
    getAllIssues: () => api.get('/moderator/issues/all'),
    approveIssue: (id) => api.put(`/moderator/issues/${id}/approve`),
    rejectIssue: (id, reason) => api.put(`/moderator/issues/${id}/reject`, { reason }),
    getAllComments: () => api.get('/moderator/comments/all'),
    deleteComment: (id) => api.delete(`/moderator/comments/${id}`),
    getDashboardStats: () => api.get('/moderator/dashboard/stats'),
};

// Citizen API
export const citizenAPI = {
    getDashboardStats: () => api.get('/citizen/dashboard/stats'),
    getMyIssues: () => api.get('/citizen/my-issues'),
    getMyFeedback: () => api.get('/citizen/my-feedback'),
    getConstituencyUpdates: () => api.get('/citizen/constituency-updates'),
};

// Politician API
export const politicianAPI = {
    getDashboardStats: () => api.get('/politician/dashboard/stats'),
    getAssignedIssues: () => api.get('/politician/assigned-issues'),
    getDashboardIssues: () => api.get('/politician/dashboard-issues'),
    getFeedbackReceived: () => api.get('/politician/feedback-received'),
    getRating: () => api.get('/politician/rating'),
    getMyUpdates: () => api.get('/politician/my-updates'),
};

// Issue API
export const issueAPI = {
    getAll: () => api.get('/issues'),
    getById: (id) => api.get(`/issues/${id}`),
    getMyIssues: () => api.get('/issues/my-issues'),
    getAssigned: () => api.get('/issues/assigned'),
    getByStatus: (status) => api.get(`/issues/status/${status}`),
    search: (keyword) => api.get(`/issues/search?keyword=${keyword}`),
    create: (issueData) => api.post('/issues', issueData),
    assign: (id, politicianId) => api.put(`/issues/${id}/assign?politicianId=${politicianId}`),
    respond: (id, response) => api.put(`/issues/${id}/respond`, { response }),
    resolve: (id, resolutionNotes) => api.put(`/issues/${id}/resolve`, { resolutionNotes }),
    updateStatus: (id, status) => api.put(`/issues/${id}/status?status=${status}`),
    delete: (id) => api.delete(`/issues/${id}`),
    getStats: () => api.get('/issues/stats'),
};

// Feedback API
export const feedbackAPI = {
    submit: (feedbackData) => api.post('/feedback', feedbackData),
    getByPolitician: (politicianId) => api.get(`/feedback/politician/${politicianId}`),
    getPoliticianStats: (politicianId) => api.get(`/feedback/politician/${politicianId}/stats`),
    getMyFeedback: () => api.get('/feedback/my-feedback'),
    getReceived: () => api.get('/feedback/received'),
    delete: (id) => api.delete(`/feedback/${id}`),
};

// Update API
export const updateAPI = {
    getAll: () => api.get('/updates'),
    getById: (id) => api.get(`/updates/${id}`),
    getByPolitician: (politicianId) => api.get(`/updates/politician/${politicianId}`),
    getMyUpdates: () => api.get('/updates/my-updates'),
    create: (updateData) => api.post('/updates', updateData),
    update: (id, updateData) => api.put(`/updates/${id}`, updateData),
    delete: (id) => api.delete(`/updates/${id}`),
};

// Comment API
export const commentAPI = {
    getByIssue: (issueId) => api.get(`/comments/issue/${issueId}`),
    add: (issueId, content) => api.post(`/comments/issue/${issueId}`, { content }),
    getFlagged: () => api.get('/comments/flagged'),
    flag: (id, reason) => api.put(`/comments/${id}/flag`, { reason }),
    unflag: (id) => api.put(`/comments/${id}/unflag`),
    delete: (id) => api.delete(`/comments/${id}`),
};

// File API
export const fileAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    download: (filename) =>
        api.get(`/files/download/${filename}`, { responseType: 'blob' }),

    delete: (filename) => api.delete(`/files/${filename}`),
};

export default api;