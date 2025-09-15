import { Video, Phone } from "lucide-react";
function CallButton({ handleVideoCall, handleAudioCall }) {
  return (
    <div className="p-3 border-b flex items-center justify-end gap-2 max-w-7xl mx-auto w-full absolute top-0">
      <button
        onClick={handleAudioCall}
        className="btn btn-info btn-sm text-white"
      >
        <Phone size={20} color="#ffffff" strokeWidth={2} />
      </button>
      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white"
      >
        <Video size={20} color="#ffffff" strokeWidth={2} />
      </button>
    </div>
  );
}

export default CallButton;
