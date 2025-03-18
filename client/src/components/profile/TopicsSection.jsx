import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function TopicsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  
  const { data: fetchedTopics, isLoading } = useQuery({
    queryKey: ["/api/topics"],
    enabled: !!user,
  });
  
  useEffect(() => {
    if (fetchedTopics) {
      setTopics(fetchedTopics);
    }
  }, [fetchedTopics]);
  
  const addTopicMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/topics", data);
      return await res.json();
    },
    onSuccess: (newTopic) => {
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      setTopics([...topics, newTopic]);
      setNewTopic("");
      toast({
        title: "Topic added",
        description: `${newTopic.name} has been added to your interests.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add topic",
        variant: "destructive",
      });
    },
  });
  
  const deleteTopicMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/topics/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      setTopics(topics.filter(topic => topic.id !== id));
      toast({
        title: "Topic removed",
        description: "The topic has been removed from your interests.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove topic",
        variant: "destructive",
      });
    },
  });
  
  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    
    addTopicMutation.mutate({ name: newTopic });
  };
  
  const handleRemoveTopic = (id) => {
    deleteTopicMutation.mutate(id);
  };

  // Default topics if none are set
  const defaultTopics = [
    "Web Development", 
    "Mobile Development", 
    "Programming Languages", 
    "Leadership", 
    "Career Development", 
    "Digital Marketing"
  ];

  return (
    <section className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium text-gray-800">Interested Topics</h3>
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
              {topics.map((topic) => (
                <div 
                  key={topic.id} 
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  <span>{topic.name}</span>
                  <button 
                    className="ml-2 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveTopic(topic.id)}
                    disabled={deleteTopicMutation.isPending}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddTopic} className="flex items-center gap-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add a topic of interest..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={addTopicMutation.isPending || !newTopic.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {addTopicMutation.isPending ? (
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
            ) : topics && topics.length > 0 ? (
              topics.map((topic) => (
                <span 
                  key={topic.id} 
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                >
                  {topic.name}
                </span>
              ))
            ) : (
              // Display default topics when no user-defined topics exist
              defaultTopics.map((topic, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
