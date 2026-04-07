"use client";

import { getUser } from "@/app/actions/getUser";
import useUserStore from "@/app/store/useStore";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

const AdminIndukWrapper = ({ children }) => {
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

  if (userRole !== "ADMIN_INDUK") {
    return null;
  }

  return children;
};

export default AdminIndukWrapper;
