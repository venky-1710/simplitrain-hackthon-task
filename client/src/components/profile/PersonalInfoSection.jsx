import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@shared/schema.js";
import { useAuth } from "@/hooks/use-auth";

export default function PersonalInfoSection() {
  const { user, updateProfileMutation } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      age: user?.age || "",
      gender: user?.gender || "",
      address: user?.address || "",
    },
  });
  
  const onSubmit = (data) => {
    // Convert age to number if provided
    if (data.age) {
      data.age = parseInt(data.age, 10);
    }
    
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };
  
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <section className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
        {!isEditing ? (
          <button 
            className="text-primary-600 hover:text-primary-700"
            onClick={() => setIsEditing(true)}
          >
            <i className="ri-pencil-line"></i> Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              className="text-gray-600 hover:text-gray-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              className="text-primary-600 hover:text-primary-700"
              onClick={handleSubmit(onSubmit)}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <i className="ri-loader-2-line animate-spin"></i>
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {isEditing ? (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="firstName" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                {...register("firstName")}
                className={`w-full rounded-md border ${
                  errors.firstName ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                {...register("lastName")}
                className={`w-full rounded-md border ${
                  errors.lastName ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="age" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                id="age"
                type="number"
                {...register("age")}
                className={`w-full rounded-md border ${
                  errors.age ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-red-600">{errors.age.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                id="gender"
                {...register("gender")}
                className={`w-full rounded-md border ${
                  errors.gender ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Address
              </label>
              <textarea
                id="address"
                {...register("address")}
                rows={3}
                className={`w-full rounded-md border ${
                  errors.address ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
              )}
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">First Name</label>
              <p className="text-gray-800">{user?.firstName || "-"}</p>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Name</label>
              <p className="text-gray-800">{user?.lastName || "-"}</p>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Age</label>
              <p className="text-gray-800">{user?.age || "-"}</p>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Gender</label>
              <p className="text-gray-800">{user?.gender || "-"}</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address</label>
              <p className="text-gray-800">{user?.address || "-"}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
