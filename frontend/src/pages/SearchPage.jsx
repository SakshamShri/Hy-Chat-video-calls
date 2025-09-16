import { useState, useEffect } from "react";
import { Search, UserPlus, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecommendedUsers, sendFriendRequest, getOutgoingFriendReqs } from "../lib/api";
import toast from "react-hot-toast";
import { LANGUAGE_TO_FLAG, SINGER_TO_FLAG } from "../constants";
import { getLanguageFlag, getSingerFlag } from "../components/FriendCard";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  const {
    data: outgoingRequests = [],
  } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendReqs,
  });

  const sendFriendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    },
  });

  useEffect(() => {
    if (searchQuery.trim() && users.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.nativeLang?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.learningLang?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const getLanguageFlag = (language) => {
    if (!language) return null;
    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];
    if (countryCode) {
      return (
        <img
          src={`https://flagcdn.com/24x18/${countryCode}.png`}
          alt={`${langLower} flag`}
          className="h-3 mr-1 inline-block"
        />
      );
    }
    return null;
  };

  const handleSendFriendRequest = (userId) => {
    sendFriendRequestMutation.mutate(userId);
  };

  const isRequestSent = (userId) => {
    return outgoingRequests.some(request => 
      (request.to && request.to._id === userId) || 
      (request.recipient && request.recipient._id === userId)
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-error mb-2">Failed to load users</div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Search Header */}
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center gap-3 mb-4">
          <Search className="size-8 text-primary" />
          <h1 className="text-3xl font-bold text-base-content">Search Users</h1>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content opacity-70" />
          <input
            type="text"
            placeholder="Search by name, email, or language..."
            className="input input-bordered w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 p-6">
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div key={user._id} className="card bg-base-200 shadow-md">
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={user.profilePic}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-base-content">
                        {user.fullName}
                      </h3>
                      <p className="text-sm text-base-content/70">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Language Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {user.nativeLang && (
                      <span className="badge badge-sm badge-outline">
                        {getLanguageFlag(user.nativeLang)}
                        Native: {user.nativeLang}
                      </span>
                    )}
                    {user.learningLang && (
                      <span className="badge badge-sm badge-outline">
                        {getSingerFlag(user.learningLang)}
                        Fav. SNG: {user.learningLang}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-sm w-full ${
                        isRequestSent(user._id) ? "btn-disabled" : "btn-primary"
                      }`}
                      onClick={() => handleSendFriendRequest(user._id)}
                      disabled={isRequestSent(user._id) || sendFriendRequestMutation.isPending}
                    >
                      {isRequestSent(user._id) ? (
                        <>
                          <Check className="size-4 mr-2" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlus className="size-4 mr-2" />
                          {sendFriendRequestMutation.isPending ? "Sending..." : "Send Friend Request"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Search className="size-16 text-base-content/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-base-content mb-2">
                {searchQuery.trim() ? "No users found" : "Discover People"}
              </h2>
              <p className="text-base-content/70">
                {searchQuery.trim()
                  ? "Try adjusting your search terms"
                  : "Search for people to connect with by name, email, or language"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
