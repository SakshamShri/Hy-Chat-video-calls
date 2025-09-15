import { useNavigate } from "react-router";
import { ArrowLeft, Users, Video, Phone } from "lucide-react";

const GroupChannelHeader = ({ groupData, handleVideoCall, handleAudioCall }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Back button clicked - navigating to /groups");
          navigate("/groups", { replace: true });
        }}
        className="btn btn-ghost btn-sm hover:bg-gray-100"
        type="button"
      >
        <ArrowLeft size={20} />
      </button>
      
      <div className="avatar placeholder">
        <div className="bg-primary text-primary-content rounded-full w-8 h-8">
          <span className="text-sm font-bold">
            {groupData?.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center gap-3">
        <h2 className="font-semibold text-base text-gray-900">{groupData?.name}</h2>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Users size={12} />
          <span>{groupData?.members?.length}</span>
        </div>
      </div>
      
      {/* Call Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleAudioCall}
          className="btn btn-info btn-sm text-white"
        >
          <Phone size={16} />
        </button>
        <button
          onClick={handleVideoCall}
          className="btn btn-success btn-sm text-white"
        >
          <Video size={16} />
        </button>
      </div>
    </div>
  );
};

export default GroupChannelHeader;
