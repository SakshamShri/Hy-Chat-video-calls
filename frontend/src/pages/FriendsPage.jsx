import { UsersIcon, MessageCircle, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getUserFriends } from "../lib/api";
import { LANGUAGE_TO_FLAG, SINGER_TO_FLAG } from "../constants";
import { getLanguageFlag, getSingerFlag } from "../components/FriendCard";

const FriendsPage = () => {
  const navigate = useNavigate();
  const {
    data: friends,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });


  const handleChatClick = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  const handleCallClick = (friendId) => {
    navigate(`/chat/${friendId}`);
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
          <div className="text-error mb-2">Failed to load friends</div>
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
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center gap-3">
          <UsersIcon className="size-8 text-primary" />
          <h1 className="text-3xl font-bold text-base-content">Friends</h1>
          <div className="badge badge-primary">{friends?.length || 0}</div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {friends && friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div key={friend._id} className="card bg-base-200 shadow-md">
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={friend.profilePic}
                          alt={friend.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-base-content">
                        {friend.fullName}
                      </h3>
                      <div className="text-sm text-base-content/70">
                        {friend.nativeLang && (
                          <span className="badge badge-sm badge-outline mr-1">
                            {getLanguageFlag(friend.nativeLang)}
                            Native: {friend.nativeLang}
                          </span>
                        )}
                        {friend.learningLang && (
                          <span className="badge badge-sm badge-outline">
                            {getSingerFlag(friend.learningLang)}
                            Fav. SNG: {friend.learningLang}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary btn-sm flex-1"
                      onClick={() => handleChatClick(friend._id)}
                    >
                      <MessageCircle className="size-4" />
                      Chat
                    </button>
                    <button
                      className="btn btn-secondary btn-sm flex-1"
                      onClick={() => handleCallClick(friend._id)}
                    >
                      <Phone className="size-4" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <UsersIcon className="size-16 text-base-content/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-base-content mb-2">
                No Friends Yet
              </h2>
              <p className="text-base-content/70 mb-4">
                Start connecting with people to build your network!
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/search')}
              >
                Find People
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
