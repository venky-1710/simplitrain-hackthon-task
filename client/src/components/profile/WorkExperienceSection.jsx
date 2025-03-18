import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export default function WorkExperienceSection({ onOpenModal }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workExperiences, setWorkExperiences] = useState([]);
  
  const { data: fetchedExperiences, isLoading } = useQuery({
    queryKey: ["/api/work-experiences"],
    enabled: !!user,
  });
  
  useEffect(() => {
    if (fetchedExperiences) {
      setWorkExperiences(fetchedExperiences);
    }
  }, [fetchedExperiences]);
  
  const deleteWorkExperienceMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/work-experiences/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-experiences"] });
      toast({
        title: "Work experience deleted",
        description: "Work experience entry has been removed from your profile.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete work experience",
        variant: "destructive",
      });
    },
  });

  const handleDeleteWorkExperience = (id) => {
    if (window.confirm("Are you sure you want to delete this work experience entry?")) {
      deleteWorkExperienceMutation.mutate(id);
    }
  };
  
  // Format date string (YYYY-MM) for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMMM yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Format date range for display
  const formatDateRange = (startDate, endDate, currentlyWorking) => {
    const start = formatDate(startDate);
    const end = currentlyWorking ? "Present" : (endDate ? formatDate(endDate) : "Present");
    return `${start} - ${end}`;
  };
  
  // Default work experience to show if none exist
  const defaultExperiences = [
    {
      id: "default-1",
      jobTitle: "Software Engineer",
      company: "Amazon",
      startDate: "2018-07",
      currentlyWorking: true
    }
  ];

  return (
    <section className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium text-gray-800">Work Experience</h3>
        <button 
          className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
          onClick={() => onOpenModal()}
        >
          <i className="ri-add-line"></i> Add
        </button>
      </div>
      
      <div className="p-5 divide-y">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <i className="ri-loader-2-line animate-spin text-3xl text-gray-400"></i>
          </div>
        ) : workExperiences && workExperiences.length > 0 ? (
          workExperiences.map((experience) => (
            <div key={experience.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 mt-1 bg-gray-100 flex items-center justify-center">
                    {experience.companyLogo ? (
                      <img 
                        src={experience.companyLogo} 
                        alt={experience.company} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="ri-code-s-slash-line text-2xl text-gray-500"></i>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{experience.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{experience.company}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateRange(experience.startDate, experience.endDate, experience.currentlyWorking)}
                    </p>
                    {experience.description && (
                      <p className="text-sm text-gray-600 mt-2">{experience.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-gray-400 hover:text-primary-600"
                    onClick={() => onOpenModal(experience)}
                  >
                    <i className="ri-pencil-line"></i> Edit
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleDeleteWorkExperience(experience.id)}
                    disabled={deleteWorkExperienceMutation.isPending}
                  >
                    {deleteWorkExperienceMutation.isPending ? (
                      <i className="ri-loader-2-line animate-spin"></i>
                    ) : (
                      <i className="ri-delete-bin-line"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show default work experience if none exist
          defaultExperiences.map((experience) => (
            <div key={experience.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 mt-1 bg-gray-100 flex items-center justify-center">
                    <i className="ri-code-s-slash-line text-2xl text-gray-500"></i>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{experience.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{experience.company}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateRange(experience.startDate, experience.endDate, experience.currentlyWorking)}
                    </p>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-primary-600"
                  onClick={() => onOpenModal()}
                >
                  <i className="ri-pencil-line"></i> Edit
                </button>
              </div>
            </div>
          ))
        )}
        
        {!isLoading && workExperiences.length === 0 && !defaultExperiences.length && (
          <div className="py-6 text-center text-gray-500">
            <i className="ri-briefcase-4-line text-4xl mb-2"></i>
            <p>No work experience added yet</p>
            <button 
              className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => onOpenModal()}
            >
              Add work experience
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
