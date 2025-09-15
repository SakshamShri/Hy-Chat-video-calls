import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getUserGroups } from "../lib/api";
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
import CallButton from "../components/CallButton";

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
          created_by_id: groupData.admin._id,
          image: "https://via.placeholder.com/100x100?text=" + groupData.name.charAt(0),
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing group chat:", error);
        toast.error("Could not connect to group chat. Please try again.");
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

  if (loading || groupsLoading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[91vh] flex flex-col">
      <GroupChannelHeader groupData={groupData} />
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} handleAudioCall={handleAudioCall} />
            <Window>
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default GroupChatPage;
