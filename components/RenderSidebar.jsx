"use client";
import { useEffect, useState } from "react";
import SideBarAdminInduk from "./Sidebar-admin-induk";
import SidebarSkeleton from "./Sidebar-skeleton";
import SideBarAdminOpd from "./Sidebar-admin-opd";
import useUserStore from "@/app/store/useStore";
import { getUser } from "@/app/actions/getUser";
import { useAuth } from "@clerk/nextjs";

const RenderSidebar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userId, isLoaded } = useAuth();
  const { userRole, setUserRole } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      if (isLoaded && userId) {
        try {
          const userData = await getUser(userId);
          setUserRole(userData.role);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, [userId, isLoaded]);

  // 2. Tampilkan Skeleton selama masih proses loading
  if (isLoading) {
    return <SidebarSkeleton />;
  }

  // 3. Render Sidebar sesuai Role
  if (userRole === "ADMIN_INDUK") {
    return <SideBarAdminInduk />;
  }

  if (userRole === "ADMIN_OPD") {
    return <SideBarAdminOpd />;
  }

  if (userRole === "PIMPINAN") {
    return <div>sidebar PIMPINAN</div>;
  }

  return null;
};

export default RenderSidebar;
