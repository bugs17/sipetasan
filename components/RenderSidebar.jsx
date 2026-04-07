"use client";
import { useEffect, useState } from "react";
import SideBarAdminInduk from "./Sidebar-admin-induk";
import SidebarSkeleton from "./Sidebar-skeleton";
import SideBarAdminOpd from "./Sidebar-admin-opd";
import useUserStore from "@/app/store/useStore";

const RenderSidebar = () => {
  const [isClient, setIsClient] = useState(false);
  const { userRole } = useUserStore();

  // 1. Pastikan komponen sudah "Hydrated" di client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 2. Tampilkan Skeleton selama masih proses loading client-side
  if (!isClient) {
    return <SidebarSkeleton />;
  }

  // Sekarang kita bisa aman melihat log karena isClient sudah true
  console.log("Current User Role:", userRole);

  const allowedRoles = ["PIMPINAN", "ADMIN_INDUK", "ADMIN_OPD"];

  // 3. Cek apakah role terdaftar
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="p-4 text-white">Unauthorized / No Role Assigned</div>
    );
    // Atau return null jika ingin sidebar kosong saja
  }

  // 4. Render Sidebar sesuai Role
  if (userRole === "ADMIN_INDUK") {
    return <SideBarAdminInduk />;
  }

  if (userRole === "ADMIN_OPD") {
    return <SideBarAdminOpd />;
  }

  if (userRole === "PIMPINAN") {
    return <div>sidebar PIMPINAN</div>;
  }

  return <div>Something wrong</div>;
};

export default RenderSidebar;
