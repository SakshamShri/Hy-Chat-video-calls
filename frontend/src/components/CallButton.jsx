import { Video, Phone } from "lucide-react";
function CallButton({ handleVideoCall, handleAudioCall }) {
  return (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
      <button
        onClick={handleAudioCall}
        className="btn btn-info btn-sm text-white"
      >
        <Phone size={16} color="#ffffff" strokeWidth={2} />
      </button>
      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white"
      >
        <Video size={16} color="#ffffff" strokeWidth={2} />
      </button>
    </div>
  );
}

export default CallButton;
