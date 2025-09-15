import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-12 rounded-full bg-base-300 flex items-center justify-center mb-3">
        <BellIcon className="size-5 text-base-content opacity-40" />
      </div>
      <h3 className="text-base font-medium mb-1">No notifications yet</h3>
      <p className="text-sm text-base-content opacity-70 max-w-md">
        When you receive friend requests or messages, they'll appear here.
      </p>
    </div>
  );
}

export default NoNotificationsFound;
