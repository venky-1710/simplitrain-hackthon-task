import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ProfileHeader() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  const handleProfilePictureUpload = async (e) => {
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
    
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append("profilePicture", file);
      
      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }
      
      const data = await response.json();
      
      // Update the user data in the cache
      const currentUser = queryClient.getQueryData(["/api/user"]);
      if (currentUser) {
        queryClient.setQueryData(["/api/user"], {
          ...currentUser,
          profilePicture: data.profilePicture,
        });
      }
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  const tagline = 'Data Science Enthusiast';
  
  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow mb-6">
      <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>
      <div className="absolute top-20 left-6">
        <div className="relative">
          <div className="w-24 h-24 bg-white p-1 rounded-full">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile picture"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full text-gray-500">
                <i className="ri-user-line text-4xl"></i>
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-primary-600 cursor-pointer">
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              className="hidden"
              onChange={handleProfilePictureUpload}
              disabled={uploading}
            />
            {uploading ? (
              <i className="ri-loader-2-line animate-spin text-lg"></i>
            ) : (
              <i className="ri-camera-line text-lg"></i>
            )}
          </label>
        </div>
      </div>
      <div className="pt-14 pb-4 px-6">
        <h2 className="text-xl font-semibold text-gray-800">{fullName || user?.username || 'User'}</h2>
        <p className="text-gray-600 text-sm mt-1">{tagline}</p>
      </div>
      <div className="border-t border-gray-100">
        <div className="flex px-6 py-3">
          <button className="font-medium text-sm text-primary-600 border-b-2 border-primary-600 pb-2 px-2">Profile</button>
          <button className="font-medium text-sm text-gray-600 hover:text-primary-600 pb-2 px-2 ml-4">Courses</button>
          <button className="font-medium text-sm text-gray-600 hover:text-primary-600 pb-2 px-2 ml-4">Certifications</button>
          <button className="font-medium text-sm text-gray-600 hover:text-primary-600 pb-2 px-2 ml-4">Activities</button>
        </div>
      </div>
    </div>
  );
}
