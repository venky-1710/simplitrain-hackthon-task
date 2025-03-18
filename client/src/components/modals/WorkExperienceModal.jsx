import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workExperienceInsertSchema } from "@shared/schema.js";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function WorkExperienceModal({ isOpen, onClose, experience }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(workExperienceInsertSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: ""
    }
  });
  
  // Watch for changes in the currentlyWorking field
  const watchCurrentlyWorking = watch("currentlyWorking");
  
  useEffect(() => {
    setCurrentlyWorking(watchCurrentlyWorking);
  }, [watchCurrentlyWorking]);
  
  // Set form values when editing
  useEffect(() => {
    if (experience) {
      Object.keys(experience).forEach(key => {
        if (key !== "id" && key !== "userId" && key !== "companyLogo") {
          // Format dates as YYYY-MM
          if (key === "startDate" || key === "endDate") {
            if (experience[key]) {
              try {
                const date = new Date(experience[key]);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                setValue(key, `${year}-${month}`);
              } catch (error) {
                setValue(key, experience[key]);
              }
            }
          } else {
            setValue(key, experience[key]);
          }
        }
      });
      
      if (experience.currentlyWorking) {
        setCurrentlyWorking(true);
      }
      
      if (experience.companyLogo) {
        setImagePreview(experience.companyLogo);
      }
    } else {
      reset();
      setImagePreview("");
      setImageFile(null);
      setCurrentlyWorking(false);
    }
  }, [experience, setValue, reset]);
  
  const closeModal = () => {
    reset();
    setImagePreview("");
    setImageFile(null);
    setCurrentlyWorking(false);
    onClose();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size exceeds 5MB limit",
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      toast({
        title: "Error",
        description: "Only image files are allowed (JPEG, PNG, GIF)",
        variant: "destructive",
      });
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const createWorkExperienceMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/work-experiences", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-experiences"] });
      toast({
        title: "Success",
        description: "Work experience added successfully",
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add work experience",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const updateWorkExperienceMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiRequest("PATCH", `/api/work-experiences/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-experiences"] });
      toast({
        title: "Success",
        description: "Work experience updated successfully",
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update work experience",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const onSubmit = async (data) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    // Upload image if provided
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        
        // This would be a separate endpoint to upload the image
        // For this example, we'll just simulate it
        // const uploadRes = await fetch("/api/upload", { 
        //   method: "POST", 
        //   body: formData,
        //   credentials: "include" 
        // });
        
        // if (!uploadRes.ok) {
        //   throw new Error("Failed to upload image");
        // }
        
        // const { url } = await uploadRes.json();
        // data.companyLogo = url;
        
        // Simulate image URL for demo purposes
        data.companyLogo = imagePreview;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image. Work experience will be saved without a company logo.",
          variant: "destructive",
        });
      }
    }
    
    // Clear endDate if currently working
    if (data.currentlyWorking) {
      data.endDate = null;
    }
    
    if (experience && experience.id) {
      updateWorkExperienceMutation.mutate({ id: experience.id, data });
    } else {
      createWorkExperienceMutation.mutate(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-medium">
            {experience ? "Edit Work Experience" : "Add Work Experience"}
          </h3>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={closeModal}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <div className="p-5">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title*
              </label>
              <input
                id="jobTitle"
                type="text"
                {...register("jobTitle")}
                className={`w-full rounded-md border ${
                  errors.jobTitle ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.jobTitle && (
                <p className="mt-1 text-xs text-red-600">{errors.jobTitle.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company*
              </label>
              <input
                id="company"
                type="text"
                {...register("company")}
                className={`w-full rounded-md border ${
                  errors.company ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.company && (
                <p className="mt-1 text-xs text-red-600">{errors.company.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                {...register("location")}
                className={`w-full rounded-md border ${
                  errors.location ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.location && (
                <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date*
                </label>
                <input
                  id="startDate"
                  type="month"
                  {...register("startDate")}
                  className={`w-full rounded-md border ${
                    errors.startDate ? "border-red-300" : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="space-y-2">
                  <input
                    id="endDate"
                    type="month"
                    {...register("endDate")}
                    disabled={currentlyWorking}
                    className={`w-full rounded-md border ${
                      errors.endDate ? "border-red-300" : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      currentlyWorking ? "bg-gray-100" : ""
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>
                  )}
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="currentlyWorking" 
                      {...register("currentlyWorking")} 
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="currentlyWorking" className="ml-2 block text-sm text-gray-700">
                      I currently work here
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                {...register("description")}
                className={`w-full rounded-md border ${
                  errors.description ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex flex-col w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="ri-upload-2-line text-gray-400 text-2xl"></i>
                      <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-5 space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={closeModal}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <i className="ri-loader-2-line animate-spin mr-2"></i>
                    {experience ? "Updating..." : "Saving..."}
                  </div>
                ) : (
                  experience ? "Update Experience" : "Save Experience"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
