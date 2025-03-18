import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";

const SOCIAL_MEDIA_PLATFORMS = [
  { id: "linkedin", name: "LinkedIn", icon: "ri-linkedin-fill", color: "#0077B5" },
  { id: "twitter", name: "Twitter", icon: "ri-twitter-x-fill", color: "#1DA1F2" },
  { id: "facebook", name: "Facebook", icon: "ri-facebook-fill", color: "#1877F2" },
  { id: "instagram", name: "Instagram", icon: "ri-instagram-fill", color: "#E1306C" },
  { id: "youtube", name: "YouTube", icon: "ri-youtube-fill", color: "#FF0000" },
  { id: "github", name: "GitHub", icon: "ri-github-fill", color: "#333333" },
  { id: "dribbble", name: "Dribbble", icon: "ri-dribbble-line", color: "#EA4C89" },
  { id: "behance", name: "Behance", icon: "ri-behance-fill", color: "#1769FF" },
  { id: "medium", name: "Medium", icon: "ri-medium-fill", color: "#00AB6C" },
  { id: "google", name: "Google", icon: "ri-google-fill", color: "#DB4437" }
];

export default function SocialMediaSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [socialMedias, setSocialMedias] = useState([]);
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  
  const { data: fetchedSocialMedias, isLoading } = useQuery({
    queryKey: ["/api/social-medias"],
    enabled: !!user,
  });
  
  useEffect(() => {
    if (fetchedSocialMedias) {
      setSocialMedias(fetchedSocialMedias);
    }
  }, [fetchedSocialMedias]);
  
  const addSocialMediaMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/social-medias", data);
      return await res.json();
    },
    onSuccess: (newSocial) => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-medias"] });
      setSocialMedias([...socialMedias, newSocial]);
      setNewSocialPlatform("");
      setNewSocialUrl("");
      toast({
        title: "Social media added",
        description: `Your ${newSocial.platform} profile has been added.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add social media profile",
        variant: "destructive",
      });
    },
  });
  
  const deleteSocialMediaMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/social-medias/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-medias"] });
      setSocialMedias(socialMedias.filter(social => social.id !== id));
      toast({
        title: "Social media removed",
        description: "The social media profile has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove social media profile",
        variant: "destructive",
      });
    },
  });
  
  const handleAddSocialMedia = (e) => {
    e.preventDefault();
    if (!newSocialPlatform || !newSocialUrl) return;
    
    // Simple URL validation
    let url = newSocialUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    addSocialMediaMutation.mutate({ 
      platform: newSocialPlatform,
      url: url
    });
  };
  
  const handleRemoveSocialMedia = (id) => {
    deleteSocialMediaMutation.mutate(id);
  };

  // Get platform details by ID
  const getPlatformDetails = (platformId) => {
    return SOCIAL_MEDIA_PLATFORMS.find(p => p.id === platformId) || {
      name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
      icon: "ri-links-line",
      color: "#718096"
    };
  };

  // Default social media for display if none are set
  const defaultSocialMedia = [
    { id: "linkedin", platform: "linkedin", url: "#" },
    { id: "twitter", platform: "twitter", url: "#" },
    { id: "google", platform: "google", url: "#" },
    { id: "instagram", platform: "instagram", url: "#" }
  ];

  return (
    <section className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium text-gray-800">Social Media</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {socialMedias.map((social) => {
                const platform = getPlatformDetails(social.platform);
                return (
                  <div 
                    key={social.id} 
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <i className={`${platform.icon} text-xl`} style={{ color: platform.color }}></i>
                      <div className="ml-3">
                        <div className="font-medium text-sm">{platform.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[180px]">{social.url}</div>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveSocialMedia(social.id)}
                      disabled={deleteSocialMediaMutation.isPending}
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                );
              })}
            </div>
            
            <form onSubmit={handleAddSocialMedia} className="space-y-4">
              <div>
                <label htmlFor="socialPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  id="socialPlatform"
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a platform</option>
                  {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="socialUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile URL
                </label>
                <input
                  id="socialUrl"
                  type="text"
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={addSocialMediaMutation.isPending || !newSocialPlatform || !newSocialUrl}
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {addSocialMediaMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <i className="ri-loader-2-line animate-spin mr-2"></i>
                    Adding...
                  </div>
                ) : (
                  "Add Social Media"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center w-full py-4">
                <i className="ri-loader-2-line animate-spin text-2xl text-gray-400"></i>
              </div>
            ) : socialMedias && socialMedias.length > 0 ? (
              socialMedias.map((social) => {
                const platform = getPlatformDetails(social.platform);
                return (
                  <a 
                    key={social.id} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: platform.color }}
                  >
                    <i className={`${platform.icon} text-2xl`}></i>
                  </a>
                );
              })
            ) : (
              // Display default social media if none are set
              defaultSocialMedia.map((social) => {
                const platform = getPlatformDetails(social.platform);
                return (
                  <a 
                    key={social.id} 
                    href={social.url} 
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: platform.color }}
                  >
                    <i className={`${platform.icon} text-2xl`}></i>
                  </a>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
