import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repositoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiActivity, FiAlertCircle } from 'react-icons/fi';

export default function RepositoryDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: repository, isLoading } = useQuery({
    queryKey: ['repository', id],
    queryFn: () => repositoriesAPI.getById(id)
  });

  const analyzeMutation = useMutation({
    mutationFn: () => repositoriesAPI.analyze(id),
    onSuccess: () => {
      toast.success('Analysis started! This may take a few minutes.');
      setTimeout(() => {
        queryClient.invalidateQueries(['repository', id]);
      }, 5000);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to start analysis');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card text-center">
          <p className="text-gray-600 dark:text-gray-400">Repository not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {repository.full_name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{repository.description}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Health Score</p>
              <p className="text-3xl font-bold text-primary-600">
                {repository.health_score || 0}/100
              </p>
            </div>
            <FiActivity className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Open Tasks</p>
              <p className="text-3xl font-bold text-yellow-600">
                {repository.tasks?.length || 0}
              </p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="card">
          <button
            onClick={() => analyzeMutation.mutate()}
            disabled={analyzeMutation.isPending}
            className="btn btn-primary w-full"
          >
            {analyzeMutation.isPending ? 'Analyzing...' : 'Analyze Repository'}
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        {repository.tasks && repository.tasks.length > 0 ? (
          <div className="space-y-4">
            {repository.tasks.slice(0, 10).map((task) => (
              <div key={task.id} className="border-l-4 border-primary-600 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {task.file_path}:{task.line_number}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-primary-600">
                    {task.priority_score.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No tasks found. Click "Analyze Repository" to scan for tasks.
          </p>
        )}
      </div>
    </div>
  );
}
