import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema } from '@shared/schema.js';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const { registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });
  
  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName')}
            className={`w-full rounded-md border ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...register('lastName')}
            className={`w-full rounded-md border ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username*
        </label>
        <input
          id="username"
          type="text"
          {...register('username')}
          className={`w-full rounded-md border ${
            errors.username ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
        />
        {errors.username && (
          <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email*
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full rounded-md border ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password*
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`w-full rounded-md border ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}