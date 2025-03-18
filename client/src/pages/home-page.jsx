import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { LogOut, UserIcon } from 'lucide-react';

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary">SimpliTrain</h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link href="/">
                  <a className="inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-medium">
                    Dashboard
                  </a>
                </Link>
                <Link href="/profile">
                  <a className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Profile
                  </a>
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <a className="flex items-center text-sm font-medium text-gray-700 hover:text-primary">
                    <UserIcon className="w-5 h-5 mr-1" />
                    {user.firstName || user.username}
                  </a>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-red-500"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Welcome, {user.firstName || user.username}!</h2>
              <p className="text-gray-600 mb-6">
                This is your SimpliTrain dashboard where you can track your educational progress and career development.
              </p>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-primary-800 font-medium">Educational Entries</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-primary-800 font-medium">Work Experience</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-primary-800 font-medium">Skill Topics</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/profile">
                  <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Complete Your Profile
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}