import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStreamToken, getUserGroups, refreshStreamUser } from "../lib/api";
import { useThemeStore } from "../store/useThemeStore";

import { StreamChat } from "stream-chat";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import GroupChannelHeader from "../components/GroupChannelHeader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupChatPage = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);

  const { authUser } = useAuthUser();
  const { theme } = useThemeStore();

  // Refresh Stream user mutation
  const refreshStreamUserMutation = useMutation({
    mutationFn: refreshStreamUser,
    onSuccess: () => {
      toast.success("Stream user updated! Please try joining the group chat again.");
    },
    onError: (error) => {
      toast.error("Failed to update Stream user: " + error.message);
    }
  });

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Fetch user's groups from backend
  const { data: userGroups = [], isLoading: groupsLoading, refetch: refetchGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: getUserGroups,
    enabled: !!authUser,
    refetchOnWindowFocus: true,
    staleTime: 0 // Always refetch to get latest group membership
  });

  // Get group data from backend API
  useEffect(() => {
    if (authUser && groupId) {
      if (userGroups.length > 0) {
        const group = userGroups.find(g => g._id === groupId);
        if (group) {
          setGroupData(group);
        } else {
          // If group not found in user's groups, refetch to check for new membership
          console.log("Group not found in user's groups, refetching...");
          refetchGroups().then((result) => {
            const updatedGroup = result.data?.find(g => g._id === groupId);
            if (updatedGroup) {
              setGroupData(updatedGroup);
            } else {
              toast.error("You are not a member of this group");
              navigate("/groups");
            }
          });
        }
      }
    }
  }, [authUser, groupId, userGroups, navigate, refetchGroups]);

  useEffect(() => {
    const initGroupChat = async () => {
      if (!tokenData?.token || !authUser || !groupData) return;

      try {
        console.log("Initializing group chat...");

        // Check if user is a member of the group
        const isMember = groupData.members.some(member => member._id === authUser._id);
        if (!isMember) {
          toast.error("You are not a member of this group");
          navigate("/groups");
          return;
        }

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = `group-${groupId}`;
        const memberIds = groupData.members.map(member => member._id);
        
        const currChannel = client.channel("messaging", channelId, {
          name: groupData.name,
          members: memberIds,
          image: "https://via.placeholder.com/100x100?text=" + groupData.name.charAt(0),
        });

        // Watch the channel (creates if doesn't exist, updates members if it does)
        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing group chat:", error);
        if (error.message.includes("not allowed to perform action ReadChannel")) {
          toast.error("Permission denied. Click 'Fix Permissions' to update your Stream user role.");
        } else {
          toast.error("Could not connect to group chat. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    initGroupChat();
  }, [tokenData, authUser, groupData, groupId, navigate]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/group-${groupId}`;

      channel.sendMessage({
        text: `I've started a group video call. Join me here: ${callUrl}`,
      });

      toast.success("Group video call link sent successfully!");
    }
  };

  const handleAudioCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/audio-call/group-${groupId}`;

      channel.sendMessage({
        text: `I've started a group audio call. Join me here: ${callUrl}`,
      });

      toast.success("Group audio call link sent successfully!");
    }
  };

  if (loading || groupsLoading) return <ChatLoader />;

  // Show fix permissions button if there's an error
  if (!chatClient || !channel) {
    return (
      <div className="h-[91vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Unable to connect to group chat</h2>
          <p className="text-base-content/70 mb-6">There seems to be a permissions issue with your Stream account.</p>
          <button 
            onClick={() => refreshStreamUserMutation.mutate()}
            className="btn btn-primary"
            disabled={refreshStreamUserMutation.isPending}
          >
            {refreshStreamUserMutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Fixing Permissions...
              </>
            ) : (
              "Fix Permissions"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[91vh] flex flex-col overflow-hidden">
      <GroupChannelHeader 
        groupData={groupData} 
        handleVideoCall={handleVideoCall} 
        handleAudioCall={handleAudioCall} 
      />
      <div className="flex-1 overflow-hidden">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <Window>
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default GroupChatPage;
