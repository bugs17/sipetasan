"use clint";

import { getUser } from "@/app/actions/getUser";
import useUserStore from "@/app/store/useStore";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

const ChatSkeleton = () => {
  const { userId, isLoaded } = useAuth();
  const { userRole, setUserRole } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoaded && userId) {
        try {
          const userData = await getUser(userId);
          setUserRole(userData.role);
        } catch (error) {}
      }
    };
    fetchUser();
  }, [userId, isLoaded]);

  return (
    <div className="w-full h-full flex gap-4 bg-transparent animate-pulse p-2">
      {/* Sidebar Skeleton */}
      {userRole === "ADMIN_INDUK" && (
        <div className="w-72 flex flex-col py-6 pl-4 space-y-6">
          <div className="h-8 w-32 bg-white/5 rounded-lg mb-4" />
          <div className="h-10 w-full bg-white/5 rounded-xl mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="h-10 w-10 bg-white/5 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-2 w-full bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Canvas Skeleton */}
      <div className="flex-1 bg-white/5 rounded-tl-[3rem] rounded-bl-[3rem] p-10 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white/10 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-2 w-20 bg-white/5 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-16 w-2/3 bg-white/5 rounded-2xl rounded-tl-none" />
          <div className="h-16 w-1/2 bg-[#6d28d9]/10 rounded-2xl rounded-tr-none ml-auto" />
          <div className="h-16 w-3/4 bg-white/5 rounded-2xl rounded-tl-none" />
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
