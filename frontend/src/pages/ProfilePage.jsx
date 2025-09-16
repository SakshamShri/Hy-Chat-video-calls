import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, MapPin, Globe, MessageCircle, Camera, Save, X, ShuffleIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import useAuthUser from '../hooks/useAuthUser';
import { getProfile, updateProfile } from '../lib/api';
import PageLoader from '../components/PageLoader';
import { LANGUAGES, SINGERS } from '../constants';
import { getLanguageFlag, getSingerFlag } from '../components/FriendCard';

const ProfilePage = () => {
  const { authUser, isLoading } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    nativeLang: '',
    learningLang: '',
    location: '',
    profilePic: ''
  });

  // Initialize form data when authUser is available
  React.useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || '',
        bio: authUser.bio || '',
        nativeLang: authUser.nativeLang || '',
        learningLang: authUser.learningLang || '',
        location: authUser.location || '',
        profilePic: authUser.profilePic || ''
      });
    }
  }, [authUser]);

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      console.log("Profile update success:", data);
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error config:", error.config);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log("Save button clicked, formData:", formData);
    updateProfileMutation(formData);
  };

  const handleCancel = () => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || '',
        bio: authUser.bio || '',
        nativeLang: authUser.nativeLang || '',
        learningLang: authUser.learningLang || '',
        location: authUser.location || '',
        profilePic: authUser.profilePic || ''
      });
    }
    setIsEditing(false);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `/${idx}.png`;
    
    setFormData(prev => ({
      ...prev,
      profilePic: randomAvatar
    }));
    toast.success("Generated!");
  };

  if (isLoading) return <PageLoader />;

  if (!authUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-base-100 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-base-content">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary btn-sm gap-2"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="btn btn-success btn-xs sm:btn-sm gap-1 sm:gap-2"
              >
                <Save size={14} className="sm:size-4" />
                <span className="hidden sm:inline">{isPending ? 'Saving...' : 'Save'}</span>
                <span className="sm:hidden">{isPending ? '...' : 'Save'}</span>
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-ghost btn-xs sm:btn-sm gap-1 sm:gap-2"
              >
                <X size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">×</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4 sm:p-6 items-center text-center">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="avatar">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img 
                        src={isEditing ? formData.profilePic : authUser.profilePic} 
                        alt="Profile" 
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <button className="btn btn-circle btn-xs sm:btn-sm btn-primary">
                        <Camera size={12} className="sm:size-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Name */}
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full text-center text-lg sm:text-xl font-bold"
                    placeholder="Full Name"
                  />
                ) : (
                  <h2 className="text-base sm:text-lg font-bold text-base-content">
                    {authUser.fullName}
                  </h2>
                )}

                {/* Status */}
                <div className="flex items-center gap-2 text-success">
                  <span className="w-3 h-3 bg-success rounded-full"></span>
                  <span className="text-sm font-medium">Online</span>
                </div>

                {/* Bio */}
                <div className="w-full mt-3 sm:mt-4">
                  <label className="label">
                    <span className="label-text text-xs sm:text-sm font-medium">Bio</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full h-20 sm:h-24 resize-none text-sm"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-base-content/70 text-xs sm:text-sm leading-relaxed">
                      {authUser.bio || "No bio added yet."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4 sm:p-6">
                <h3 className="card-title text-base sm:text-lg mb-3 sm:mb-4">Profile Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Location */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                        <MapPin size={14} className="sm:size-4" />
                        Location
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input input-bordered input-sm sm:input-md text-sm"
                        placeholder="Your location"
                      />
                    ) : (
                      <div className="p-2 sm:p-3 bg-base-100 rounded-lg">
                        <p className="text-xs sm:text-sm text-base-content">
                          {authUser.location || "Not specified"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Native Language */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                        <Globe size={14} className="sm:size-4" />
                        Native Language
                      </span>
                    </label>
                    {isEditing ? (
                      <select
                        name="nativeLang"
                        value={formData.nativeLang}
                        onChange={handleInputChange}
                        className="select select-bordered select-sm sm:select-md text-sm"
                      >
                        <option value="">Select language</option>
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-2 sm:p-3 bg-base-100 rounded-lg">
                        <p className="text-xs sm:text-sm text-base-content flex items-center gap-2">
                          {getLanguageFlag(authUser.nativeLang)}
                          {LANGUAGES.find(lang => lang.code === authUser.nativeLang)?.name || "Not specified"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Learning Language */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                        <MessageCircle size={14} className="sm:size-4" />
                        Fav. SNG
                      </span>
                    </label>
                    {isEditing ? (
                      <select
                        name="learningLang"
                        value={formData.learningLang}
                        onChange={handleInputChange}
                        className="select select-bordered select-sm sm:select-md text-sm"
                      >
                        <option value="">Select singer</option>
                        {SINGERS.map((singer) => (
                          <option key={singer} value={singer}>
                            {singer}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-2 sm:p-3 bg-base-100 rounded-lg">
                        <p className="text-xs sm:text-sm text-base-content flex items-center gap-2">
                          {getSingerFlag(authUser.learningLang)}
                          {authUser.learningLang || "Not specified"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Profile Picture Generator (only in edit mode) */}
                  {isEditing && (
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text text-sm font-medium">Profile Picture</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleRandomAvatar}
                        className="btn btn-outline btn-primary btn-sm sm:btn-md gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <ShuffleIcon className="size-3 sm:size-4" />
                        <span className="hidden sm:inline">Generate Random Avatar</span>
                        <span className="sm:hidden">Generate Avatar</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="divider mt-6 sm:mt-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <h4 className="font-medium text-xs sm:text-sm text-base-content mb-2">Account Status</h4>
                    <div className="flex items-center gap-2">
                      <div className={`badge badge-sm sm:badge-md ${authUser.isOnboarded ? 'badge-success' : 'badge-warning'}`}>
                        {authUser.isOnboarded ? 'Complete' : 'Incomplete'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-xs sm:text-sm text-base-content mb-2">Member Since</h4>
                    <p className="text-xs sm:text-sm text-base-content/70">
                      {new Date(authUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
