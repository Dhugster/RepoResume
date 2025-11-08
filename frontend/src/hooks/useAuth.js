import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return await authAPI.getCurrentUser();
      } catch (err) {
        // 401 is expected when not logged in - return null instead of throwing
        if (err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false, // Don't retry - 401 is OK (not logged in)
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // Treat 401 as "not logged in" not an error
    throwOnError: false,
  });

  // Handle login success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'success') {
      // Remove query parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
      // Invalidate and refetch user data
      queryClient.invalidateQueries(['user']);
      refetch();
      toast.success('Successfully logged in!');
    } else if (params.get('login') === 'error') {
      // Remove query parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
      toast.error('Login failed. Please try again.');
    }
  }, [queryClient, refetch]);

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
