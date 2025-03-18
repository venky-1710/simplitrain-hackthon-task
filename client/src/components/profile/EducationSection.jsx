import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export default function EducationSection({ onOpenModal }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [educations, setEducations] = useState([]);
  
  const { data: fetchedEducations, isLoading } = useQuery({
    queryKey: ["/api/educations"],
    enabled: !!user,
  });
  
  useEffect(() => {
    if (fetchedEducations) {
      setEducations(fetchedEducations);
    }
  }, [fetchedEducations]);
  
  const deleteEducationMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/educations/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/educations"] });
      toast({
        title: "Education deleted",
        description: "Education entry has been removed from your profile.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete education",
        variant: "destructive",
      });
    },
  });

  const handleDeleteEducation = (id) => {
    if (window.confirm("Are you sure you want to delete this education entry?")) {
      deleteEducationMutation.mutate(id);
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
  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };
  
  // Default education entries to show if none exist
  const defaultEducations = [
    {
      id: "default-1",
      institutionName: "Imperial College London",
      degree: "Masters in Marketing",
      graduationYear: 2020,
      startDate: "2018-03",
      endDate: "2020-06",
      institutionLogo: "https://images.unsplash.com/photo-1528057377893-b9be9a126f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: "default-2",
      institutionName: "MIT University",
      degree: "Bachelor's Degree in Engineering and Technology",
      graduationYear: 2018,
      startDate: "2014-03",
      endDate: "2018-03",
      institutionLogo: "https://images.unsplash.com/photo-1594935769014-cc2c24e5a70f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <section className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium text-gray-800">Education</h3>
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
        ) : educations && educations.length > 0 ? (
          educations.map((education) => (
            <div key={education.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 mt-1 bg-gray-200 flex items-center justify-center">
                    {education.institutionLogo ? (
                      <img 
                        src={education.institutionLogo} 
                        alt={education.institutionName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="ri-graduation-cap-line text-2xl text-gray-500"></i>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{education.institutionName}</h4>
                    <p className="text-sm text-gray-600">
                      {education.degree}
                      {education.graduationYear && `, graduated on ${education.graduationYear}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateRange(education.startDate, education.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-gray-400 hover:text-primary-600"
                    onClick={() => onOpenModal(education)}
                  >
                    <i className="ri-pencil-line"></i> Edit
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleDeleteEducation(education.id)}
                    disabled={deleteEducationMutation.isPending}
                  >
                    {deleteEducationMutation.isPending ? (
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
          // Show default education entries if none exist
          defaultEducations.map((education) => (
            <div key={education.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 mt-1 bg-gray-200 flex items-center justify-center">
                    {education.institutionLogo ? (
                      <img 
                        src={education.institutionLogo} 
                        alt={education.institutionName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="ri-graduation-cap-line text-2xl text-gray-500"></i>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{education.institutionName}</h4>
                    <p className="text-sm text-gray-600">
                      {education.degree}
                      {education.graduationYear && `, graduated on ${education.graduationYear}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateRange(education.startDate, education.endDate)}
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
        
        {!isLoading && educations.length === 0 && !defaultEducations.length && (
          <div className="py-6 text-center text-gray-500">
            <i className="ri-graduation-cap-line text-4xl mb-2"></i>
            <p>No education history added yet</p>
            <button 
              className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => onOpenModal()}
            >
              Add education
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
