import { useAuth } from '../hooks/useAuth';
import { FiGithub, FiCheckCircle, FiTrendingUp, FiZap } from 'react-icons/fi';

export default function LandingPage() {
  const { loginWithGithub } = useAuth();

  const features = [
    {
      icon: <FiCheckCircle className="w-12 h-12" />,
      title: 'Smart Task Detection',
      description: 'Automatically detect TODOs, FIXMEs, and incomplete code across your repositories'
    },
    {
      icon: <FiTrendingUp className="w-12 h-12" />,
      title: 'Health Metrics',
      description: 'Track code coverage, technical debt, and overall project health'
    },
    {
      icon: <FiZap className="w-12 h-12" />,
      title: 'Priority Scoring',
      description: 'Intelligent prioritization based on urgency, complexity, and security'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Resume Your Projects with <span className="text-primary-600">Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            RepoResume automatically analyzes your GitHub repositories and generates personalized to-dos,
            helping you pick up where you left off on any project.
          </p>
          <button
            onClick={loginWithGithub}
            className="btn btn-primary flex items-center mx-auto space-x-2 px-8 py-4 text-lg"
          >
            <FiGithub className="w-6 h-6" />
            <span>Login with GitHub</span>
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="flex justify-center text-primary-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connect Your GitHub</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Securely authenticate with GitHub OAuth to access your repositories
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analyze Your Code</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our intelligent engine scans your code for TODOs, bugs, and incomplete features
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Get Personalized To-Dos</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Receive prioritized tasks with context, helping you resume work efficiently
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
