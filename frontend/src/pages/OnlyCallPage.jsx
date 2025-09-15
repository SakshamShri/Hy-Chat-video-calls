import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const OnlyCallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream audio-only call...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        // Join with audio only - no camera permissions
        await callInstance.join({ 
          create: true,
          data: {
            custom: {
              audioOnly: true
            }
          }
        });

        // Ensure camera stays disabled and microphone is enabled
        try {
          await callInstance.camera.disable();
          await callInstance.microphone.enable();
        } catch (error) {
          console.log("Audio setup:", error);
        }
        
        console.log("Joined audio-only call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining audio call:", error);
        toast.error("Could not join the audio call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting || !tokenData) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-100">
      <div className="relative w-full max-w-4xl">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <AudioCallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize audio call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AudioCallContent = () => {
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 bg-base-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">Audio Call</h2>
          <p className="text-base-content/70 text-lg">Voice conversation in progress</p>
        </div>
        
        {/* Audio-only participants display */}
        <div className="flex flex-wrap gap-6 justify-center">
          {participants.map((participant) => (
            <div key={participant.userId} className="flex flex-col items-center space-y-3">
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img 
                    src={participant.image || participant.user?.image} 
                    alt={participant.name || participant.user?.name}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-base-content">
                  {participant.name || participant.user?.name}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    participant.audioLevel > 0 ? 'bg-success animate-pulse' : 'bg-base-300'
                  }`}></div>
                  <span className="text-xs text-base-content/60">
                    {participant.audioLevel > 0 ? 'Speaking' : 'Muted'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom audio-only call controls */}
        <div className="mt-8">
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default OnlyCallPage;
