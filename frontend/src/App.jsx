import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import RepositoryDetail from './pages/RepositoryDetail';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import LoadingSpinner from './components/LoadingSpinner';
import BackendError from './components/BackendError';

function App() {
  const { user, isLoading, error } = useAuth();
  
  // Don't treat 401 as an error - it just means user is not logged in
  const isAuthError = error?.response?.status === 401;

  // Check if error is a connection error (not auth error)
  const isConnectionError = error && !isAuthError && (
    error.code === 'ECONNREFUSED' ||
    error.code === 'ERR_NETWORK' ||
    error.message?.includes('timeout') ||
    error.message?.includes('Network Error') ||
    (error.response === undefined && error.request !== undefined)
  );
  
  if (isConnectionError) {
    return <BackendError onRetry={() => window.location.reload()} />;
  }

  // Don't show loading spinner for auth check - it's quick
  // Only show spinner for actual connection issues (not 401 auth errors)
  if (isLoading && !isAuthError) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      
      <Route element={<Layout />}>
        {/* Dashboard and repos work without login (for public repos) */}
        <Route 
          path="/dashboard" 
          element={<Dashboard />} 
        />
        <Route 
          path="/repository/:id" 
          element={<RepositoryDetail />} 
        />
        {/* Tasks and settings require login */}
        <Route 
          path="/tasks" 
          element={user ? <TasksPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/settings" 
          element={user ? <SettingsPage /> : <Navigate to="/" />} 
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
