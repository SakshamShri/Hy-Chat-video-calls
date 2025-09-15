import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  getStreamToken,
} from "../lib/api";
import { StreamChat } from "stream-chat";
import useAuthUser from "../hooks/useAuthUser";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag, getSingerFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [streamClient, setStreamClient] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  const { authUser } = useAuthUser();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  // Initialize Stream Chat client and get unread counts
  useEffect(() => {
    const initStreamClient = async () => {
      if (!tokenData?.token || !authUser || !friends.length) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        setStreamClient(client);

        // Get unread counts for each friend using Stream Chat's built-in functionality
        const counts = {};
        
        // Query all channels for this user
        const filter = { 
          type: 'messaging', 
          members: { $in: [authUser._id] } 
        };
        const sort = { last_message_at: -1 };
        const channels = await client.queryChannels(filter, sort);

        // Calculate unread counts for each friend
        for (const channel of channels) {
          const otherMembers = Object.keys(channel.state.members).filter(id => id !== authUser._id);
          if (otherMembers.length === 1) {
            const friendId = otherMembers[0];
            const unreadCount = channel.countUnread() || 0;
            counts[friendId] = unreadCount;
          }
        }
        
        setUnreadCounts(counts);

        // Get initial online status for friends
        const friendIds = friends.map(friend => friend._id);
        const onlineStatuses = await client.queryUsers(
          { id: { $in: friendIds } },
          { id: 1 },
          { presence: true }
        );
        
        const onlineSet = new Set();
        onlineStatuses.users.forEach(user => {
          if (user.online) {
            onlineSet.add(user.id);
          }
        });
        setOnlineUsers(onlineSet);

        // Listen for user presence changes
        client.on('user.presence.changed', (event) => {
          const userId = event.user.id;
          if (friendIds.includes(userId)) {
            setOnlineUsers(prev => {
              const newSet = new Set(prev);
              if (event.user.online) {
                newSet.add(userId);
              } else {
                newSet.delete(userId);
              }
              return newSet;
            });
          }
        });

        // Listen for new messages to update unread counts
        client.on('message.new', (event) => {
          if (event.user.id !== authUser._id) {
            const senderId = event.user.id;
            setUnreadCounts(prev => ({
              ...prev,
              [senderId]: (prev[senderId] || 0) + 1
            }));
          }
        });

        // Listen for message read events to update counts
        client.on('message.read', (event) => {
          if (event.user.id === authUser._id) {
            const channelMembers = Object.keys(event.channel.state.members);
            const otherMember = channelMembers.find(id => id !== authUser._id);
            if (otherMember) {
              setUnreadCounts(prev => ({
                ...prev,
                [otherMember]: 0
              }));
            }
          }
        });
      } catch (error) {
        console.error("Error initializing Stream client:", error);
      }
    };

    initStreamClient();

    // Cleanup function
    return () => {
      if (streamClient) {
        streamClient.disconnectUser();
      }
    };
  }, [tokenData, authUser, friends]);

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard 
                key={friend._id} 
                friend={friend} 
                unreadCount={unreadCounts[friend._id] || 0}
                isOnline={onlineUsers.has(friend._id)}
              />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                  Meet New friends!
                </h2>
                <p className="text-sm opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar size-12 rounded-full flex-shrink-0">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base truncate">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-0.5">
                              <MapPinIcon className="size-3 mr-1" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLang)}
                          Native: {capitialize(user.nativeLang)}
                        </span>
                        <span className="badge badge-outline">
                          {getSingerFlag(user.learningLang)}
                          Fav. SNG: {capitialize(user.learningLang)}
                        </span>
                        {unreadCounts[user._id] > 0 && (
                          <span className="badge badge-error">
                            Unread: {unreadCounts[user._id]}
                          </span>
                        )}
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70 mt-2">{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn btn-sm w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
