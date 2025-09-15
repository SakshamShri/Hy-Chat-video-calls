import { Link } from "react-router";
import { LANGUAGE_TO_FLAG, SINGER_TO_FLAG } from "../constants";

const FriendCard = ({ friend, unreadCount = 0, isOnline = false }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow relative">
      <div className="card-body p-4">
        {/* Unread count badge - positioned at top right */}
        {unreadCount > 0 && (
          <Link 
            to={`/chat/${friend._id}`}
            className="absolute -top-2 -right-2 bg-error text-error-content text-xs font-bold rounded-full px-2 py-1 min-w-fit flex items-center justify-center shadow-lg whitespace-nowrap hover:bg-error-focus transition-colors cursor-pointer"
          >
            Unread msg
          </Link>
        )}
        
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 relative">
            <img src={friend.profilePic} alt={friend.fullName} />
            {/* Online status indicator */}
            {isOnline && (
              <div className="absolute bottom-0 right-0 bg-success rounded-full h-3 w-3 border-2 border-base-200"></div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm truncate">{friend.fullName}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLang)}
            Native: {friend.nativeLang}
          </span>
          <span className="badge badge-outline text-xs">
            {getSingerFlag(friend.learningLang)}
            Fav. SNG: {friend.learningLang}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}

export function getSingerFlag(singerName) {
  if (!singerName) return null;

  const countryCode = SINGER_TO_FLAG[singerName];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${singerName} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
