import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@shared/schema.js";
import { useAuth } from "@/hooks/use-auth";

export default function BioSection() {
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
      bio: user?.bio || "",
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
        <h3 className="text-lg font-medium text-gray-800">Bio</h3>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <textarea
                id="bio"
                {...register("bio")}
                rows={5}
                className={`w-full rounded-md border ${
                  errors.bio ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>
              )}
            </div>
          </form>
        ) : (
          <p className="text-gray-700">
            {user?.bio || "I'm a recent graduate with a passion for data. I'm eager to learn data analysis techniques and build a strong foundation in this exciting field. I'm excited to explore the courses offered on SimpliTrain and gain the necessary skills to kickstart my data analyst career."}
          </p>
        )}
      </div>
    </section>
  );
}
