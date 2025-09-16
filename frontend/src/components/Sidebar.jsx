import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, RoseIcon, UsersIcon, X, Search, Users, User, Code, MapPin, Phone, Mail, Instagram, Linkedin, MessageSquare } from "lucide-react";
import { useState } from "react";

const Sidebar = ({ onClose }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  return (
    <aside className="w-56 bg-base-200 border-r border-base-300 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-200 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <RoseIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            Hy-Chat
          </span>
        </Link>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm lg:hidden"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/groups"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/groups" ? "btn-active" : ""
          }`}
        >
          <Users className="size-5 text-base-content opacity-70" />
          <span>Groups</span>
        </Link>

        <Link
          to="/search"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/search" ? "btn-active" : ""
          }`}
        >
          <Search className="size-5 text-base-content opacity-70" />
          <span>Search</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>

        <Link
          to="/profile"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/profile" ? "btn-active" : ""
          }`}
        >
          <User className="size-5 text-base-content opacity-70" />
          <span>Profile</span>
        </Link>

        {/* Meet Developer Section */}
        <div className="divider my-2"></div>
        <button
          onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
          className="btn btn-ghost justify-start w-full gap-3 px-3 normal-case"
        >
          <Code className="size-5 text-base-content opacity-70" />
          <span>Meet Developer</span>
        </button>
      </nav>

      {/* Developer Info Modal */}
      {showDeveloperInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Meet the Developer</h2>
              <button 
                onClick={() => setShowDeveloperInfo(false)}
                className="btn btn-ghost btn-sm"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Developer Info */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="avatar mb-3">
                  <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="/image.png" alt="Saksham Shrivastava" />
                  </div>
                </div>
                <h3 className="font-bold text-lg">Saksham Shrivastava</h3>
                <p className="text-sm opacity-70">Final Year Student</p>
                <p className="text-sm opacity-70">JECRC University</p>
              </div>

              {/* Office Address */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 mt-0.5 text-primary flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">Office</p>
                    <p className="opacity-70">Green Apple Apartment S-1, 3rd Floor</p>
                    <p className="opacity-70">Jagatpura, Jaipur, Rajasthan, India</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  <a href="tel:+919680105678" className="text-sm hover:text-primary">
                    +91 9680105678
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  <a href="mailto:saksham122shrivastava@gmail.com" className="text-sm hover:text-primary">
                    saksham122shrivastava@gmail.com
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Instagram className="size-4 text-primary" />
                  <a 
                    href="https://instagram.com/me_snow_saksham_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary"
                  >
                    @me_snow_saksham_
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="size-4 text-primary" />
                  <a 
                    href="https://www.linkedin.com/in/saksham-shrivastava-4a94ab246?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="divider"></div>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  Send Feedback
                </h4>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts about Hy-Chat..."
                  className="textarea textarea-bordered w-full h-20 text-sm"
                />
                <button
                  onClick={() => {
                    const subject = encodeURIComponent("Hy-Chat Feedback");
                    const body = encodeURIComponent(`Hi Saksham,\n\n${feedbackText}\n\nBest regards,\n${authUser?.fullName}`);
                    window.open(`mailto:saksham122shrivastava@gmail.com?subject=${subject}&body=${body}`);
                    setFeedbackText("");
                  }}
                  disabled={!feedbackText.trim()}
                  className="btn btn-primary btn-sm w-full"
                >
                  <Mail className="size-4 mr-2" />
                  Send via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <Link to="/profile" className="flex items-center gap-3 hover:bg-base-300 rounded-lg p-2 transition-colors">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
export default Sidebar;
