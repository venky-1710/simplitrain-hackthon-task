import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from '@shared/schema.js';
import { LogOut, UserIcon, BookOpen, Briefcase, MessageSquare, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user, logoutMutation, updateProfileMutation } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      bio: user.bio || '',
      age: user.age || '',
      gender: user.gender || '',
      address: user.address || '',
      phoneNumber: user.phoneNumber || '',
    },
  });
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
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
                  <a className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Dashboard
                  </a>
                </Link>
                <Link href="/profile">
                  <a className="inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-medium">
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
          <div className="mb-6 px-4 sm:px-0">
            <Link href="/">
              <a className="inline-flex items-center text-sm text-gray-700 hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </a>
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">Profile</h1>
          </div>
          
          <div className="px-4 py-5 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {/* Profile Tabs */}
              <div className="bg-white border-b border-gray-200">
                <nav className="flex">
                  <a
                    href="#personal"
                    className="px-6 py-4 text-center border-b-2 border-primary font-medium text-sm"
                  >
                    Personal Info
                  </a>
                  <a
                    href="#education"
                    className="px-6 py-4 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Education
                  </a>
                  <a
                    href="#experience"
                    className="px-6 py-4 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Work Experience
                  </a>
                  <a
                    href="#social"
                    className="px-6 py-4 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Social Media
                  </a>
                </nav>
              </div>
              
              {/* Personal Information */}
              <div className="p-6" id="personal">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="firstName"
                          {...register('firstName')}
                          className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.firstName ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="lastName"
                          {...register('lastName')}
                          className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.lastName ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          {...register('email')}
                          className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.email ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="phoneNumber"
                          {...register('phoneNumber')}
                          className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.phoneNumber ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          rows={4}
                          {...register('bio')}
                          className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.bio ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.bio && (
                          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Write a few sentences about yourself.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="age"
                          {...register('age', { valueAsNumber: true })}
                          className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.age ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.age && (
                          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <div className="mt-1">
                        <select
                          id="gender"
                          {...register('gender')}
                          className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.gender ? 'border-red-300' : ''
                          }`}
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                        {errors.gender && (
                          <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="address"
                          {...register('address')}
                          className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.address ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}