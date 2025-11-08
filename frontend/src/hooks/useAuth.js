import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: authAPI.getCurrentUser, // getCurrentUser now handles 401s internally
    retry: false, // Don't retry - 401 is OK (not logged in)
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // Treat 401 as "not logged in" not an error
    throwOnError: false,
  });

  // Handle login success redirect - only check once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginStatus = params.get('login');
    
    if (loginStatus === 'success') {
      // Remove query parameter from URL immediately
      window.history.replaceState({}, '', window.location.pathname);
      
      // Invalidate query cache to force refetch with new session
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Refetch user data - session cookie should now be available
      // Use a small delay to ensure cookie is set
      const refetchUser = () => {
        refetch().then((result) => {
          if (result.data) {
            toast.success('Successfully logged in!');
          } else {
            // If no data, cookie might not be set yet - retry once
            setTimeout(() => refetch(), 300);
          }
        }).catch(() => {
          // If refetch fails, retry once more
          setTimeout(() => refetch(), 500);
        });
      };
      
      // Small delay to ensure session cookie is available
      setTimeout(refetchUser, 100);
    } else if (loginStatus === 'error') {
      // Remove query parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
      toast.error('Login failed. Please try again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only check on mount for login redirect

  const logout = async () => {
    try {
      await authAPI.logout();
      queryClient.setQueryData(['user'], null);
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const loginWithGithub = () => {
    authAPI.loginWithGithub();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
    loginWithGithub,
  };
}
