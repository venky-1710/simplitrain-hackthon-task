import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { languageInsertSchema } from "@shared/schema.js";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function LanguageSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");
  
  const { data: fetchedLanguages, isLoading } = useQuery({
    queryKey: ["/api/languages"],
    enabled: !!user,
  });
  
  useEffect(() => {
    if (fetchedLanguages) {
      setLanguages(fetchedLanguages);
    }
  }, [fetchedLanguages]);
  
  const addLanguageMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/languages", data);
      return await res.json();
    },
    onSuccess: (newLanguage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      setLanguages([...languages, newLanguage]);
      setNewLanguage("");
      toast({
        title: "Language added",
        description: `${newLanguage.name} has been added to your languages.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add language",
        variant: "destructive",
      });
    },
  });
  
  const deleteLanguageMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/languages/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      setLanguages(languages.filter(lang => lang.id !== id));
      toast({
        title: "Language removed",
        description: "The language has been removed from your profile.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove language",
        variant: "destructive",
      });
    },
  });
  
  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (!newLanguage.trim()) return;
    
    addLanguageMutation.mutate({ name: newLanguage });
  };
  
  const handleRemoveLanguage = (id) => {
    deleteLanguageMutation.mutate(id);
  };

  return (
    <section className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium text-gray-800">Preferred Language</h3>
        <button 
          className="text-primary-600 hover:text-primary-700"
          onClick={() => setIsEditing(!isEditing)}
        >
          <i className="ri-pencil-line"></i> Edit
        </button>
      </div>
      
      <div className="p-5">
        {isEditing ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {languages.map((language) => (
                <div 
                  key={language.id} 
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  <span>{language.name}</span>
                  <button 
                    className="ml-2 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveLanguage(language.id)}
                    disabled={deleteLanguageMutation.isPending}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddLanguage} className="flex items-center gap-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Add a language..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={addLanguageMutation.isPending || !newLanguage.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {addLanguageMutation.isPending ? (
                  <i className="ri-loader-2-line animate-spin"></i>
                ) : (
                  "Add"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <div className="flex items-center justify-center w-full py-4">
                <i className="ri-loader-2-line animate-spin text-2xl text-gray-400"></i>
              </div>
            ) : languages && languages.length > 0 ? (
              languages.map((language) => (
                <span 
                  key={language.id} 
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                >
                  {language.name}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No languages added yet</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
