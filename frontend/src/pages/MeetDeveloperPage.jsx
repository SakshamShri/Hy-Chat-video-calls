import { useState } from "react";
import { MapPin, Phone, Mail, Instagram, Linkedin, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";

const MeetDeveloperPage = () => {
  const { authUser } = useAuthUser();
  const [feedbackText, setFeedbackText] = useState("");

  return (
    <div className="min-h-screen bg-base-100 p-3 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Link to="/" className="btn btn-ghost btn-circle btn-sm sm:btn-md">
            <ArrowLeft className="size-4 sm:size-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">Meet the Developer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Developer Profile Card */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="avatar mb-3 sm:mb-4">
                  <div className="w-24 sm:w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 sm:ring-offset-4">
                    <img src="/image.png" alt="Saksham Shrivastava" />
                  </div>
                </div>
                <h2 className="card-title text-xl sm:text-2xl justify-center">Saksham Shrivastava</h2>
                <p className="text-base sm:text-lg opacity-70">Final Year Student</p>
                <p className="text-sm sm:text-base opacity-60">JECRC University</p>
                <div className="badge badge-primary badge-sm sm:badge-lg mt-2">Full Stack Developer</div>
              </div>

              {/* About Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold">About</h3>
                <p className="text-sm sm:text-base opacity-80 leading-relaxed">
                  Passionate full-stack developer and final year student at JECRC University. 
                  I love creating innovative web applications that solve real-world problems. 
                  Hy-Chat is one of my projects focused on bringing people together through 
                  seamless video calling and messaging experiences.
                </p>
              </div>

            </div>
          </div>

          {/* Contact & Info Card */}
          <div className="space-y-4 sm:space-y-6">
            {/* Office Address */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4 sm:p-6">
                <h3 className="card-title text-lg sm:text-xl">
                  <MapPin className="size-4 sm:size-5 text-primary" />
                  Office Location
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  <p className="font-semibold text-sm sm:text-base">Green Apple Apartment S-1</p>
                  <p className="opacity-70 text-sm sm:text-base">3rd Floor</p>
                  <p className="opacity-70 text-sm sm:text-base">Jagatpura, Jaipur</p>
                  <p className="opacity-70 text-sm sm:text-base">Rajasthan, India</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4 sm:p-6">
                <h3 className="card-title text-lg sm:text-xl">Contact Information</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="size-4 sm:size-5 text-primary flex-shrink-0" />
                    <a 
                      href="tel:+919680105678" 
                      className="text-sm sm:text-base hover:text-primary transition-colors break-all"
                    >
                      +91 9680105678
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 sm:size-5 text-primary flex-shrink-0" />
                    <a 
                      href="mailto:saksham122shrivastava@gmail.com" 
                      className="text-sm sm:text-base hover:text-primary transition-colors break-all"
                    >
                      saksham122shrivastava@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4 sm:p-6">
                <h3 className="card-title text-lg sm:text-xl">Connect With Me</h3>
                <div className="space-y-3 sm:space-y-4">
                  <a 
                    href="https://instagram.com/me_snow_saksham_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-base-300 p-2 sm:p-3 rounded-lg transition-colors"
                  >
                    <Instagram className="size-4 sm:size-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Instagram</p>
                      <p className="text-xs sm:text-sm opacity-70">@me_snow_saksham_</p>
                    </div>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/saksham-shrivastava-4a94ab246?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-base-300 p-2 sm:p-3 rounded-lg transition-colors"
                  >
                    <Linkedin className="size-4 sm:size-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">LinkedIn</p>
                      <p className="text-xs sm:text-sm opacity-70">Professional Profile</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="card bg-base-200 shadow-xl mt-6 sm:mt-8">
          <div className="card-body p-4 sm:p-6">
            <h3 className="card-title text-xl sm:text-2xl">
              <MessageSquare className="size-5 sm:size-6 text-primary" />
              Send Feedback
            </h3>
            <p className="opacity-70 mb-3 sm:mb-4 text-sm sm:text-base">
              I'd love to hear your thoughts about Hy-Chat! Your feedback helps me improve the application.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report any issues..."
                className="textarea textarea-bordered w-full h-24 sm:h-32 text-sm sm:text-base"
              />
              <button
                onClick={() => {
                  const subject = encodeURIComponent("Hy-Chat Feedback");
                  const body = encodeURIComponent(`Hi Saksham,\n\n${feedbackText}\n\nBest regards,\n${authUser?.fullName}`);
                  window.open(`mailto:saksham122shrivastava@gmail.com?subject=${subject}&body=${body}`);
                  setFeedbackText("");
                }}
                disabled={!feedbackText.trim()}
                className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto"
              >
                <Mail className="size-4 sm:size-5 mr-2" />
                Send Feedback via Email
              </button>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl mt-6 sm:mt-8">
          <div className="card-body p-4 sm:p-6">
            <h3 className="card-title text-xl sm:text-2xl">About Hy-Chat</h3>
            <p className="text-base sm:text-lg opacity-90 leading-relaxed">
              Hy-Chat is a modern video calling and messaging application built with React.js, Node.js, 
              and Stream Chat API. It features real-time messaging, video calls, group chats, and friend management.
            </p>
            <div className="card-actions justify-center sm:justify-end mt-4">
              <a 
                href="https://github.com/SakshamShri/Hy-Chat-video-calls" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-ghost text-primary-content border-primary-content hover:bg-primary-content hover:text-primary btn-sm sm:btn-md"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetDeveloperPage;
