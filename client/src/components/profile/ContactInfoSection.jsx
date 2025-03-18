import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@shared/schema.js";
import { useAuth } from "@/hooks/use-auth";

export default function ContactInfoSection() {
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
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });
  
  const onSubmit = (data) => {
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
        <h3 className="text-lg font-medium text-gray-800">Contact Information</h3>
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
              <label htmlFor="email" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`w-full rounded-md border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber")}
                className={`w-full rounded-md border ${
                  errors.phoneNumber ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</label>
              <p className="text-gray-800">{user?.email || "-"}</p>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
              <p className="text-gray-800">{user?.phoneNumber || "-"}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
