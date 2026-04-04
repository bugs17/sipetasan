"use client";

import { getUser } from "@/app/actions/getUser";
import { useAuth } from "@clerk/nextjs";
import { ShieldX } from "lucide-react";
import { useEffect, useState } from "react";

const AdminIndukWrapper = ({ children }) => {
  const { userId, isLoaded } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoaded && userId) {
        try {
          const userData = await getUser(userId);
          setUser(userData);
        } catch (error) {}
      }
    };
    fetchUser();
  }, [userId, isLoaded]);

  if (!user || user.role !== "ADMIN_INDUK") {
    return null;
  }

  return children;
};

export default AdminIndukWrapper;
