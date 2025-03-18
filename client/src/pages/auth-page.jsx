import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { BookOpen, Users, Award } from 'lucide-react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      setLocation('/');
    }
  }, [user, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Auth Form Column */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome to SimpliTrain
            </h1>
            <p className="text-gray-600">
              Your personal learning and career development platform
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 font-medium text-sm flex-1 text-center ${
                  activeTab === 'login'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm flex-1 text-center ${
                  activeTab === 'register'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Create Account
              </button>
            </div>
          </div>
          
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
      
      {/* Hero Column */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 text-white p-12 flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6">Accelerate Your Learning Journey</h2>
          <p className="mb-8 text-lg">
            SimpliTrain helps you track your educational progress, develop new skills, and connect with opportunities that match your career goals.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-white/10 p-2 rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Track Your Learning</h3>
                <p className="text-white/80">
                  Keep all your courses, certifications, and educational achievements in one place
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-white/10 p-2 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Professional Network</h3>
                <p className="text-white/80">
                  Connect with mentors, peers, and potential employers in your field
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-white/10 p-2 rounded-full">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Skill Development</h3>
                <p className="text-white/80">
                  Identify skill gaps and discover learning opportunities to advance your career
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}