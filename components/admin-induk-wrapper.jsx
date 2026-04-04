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
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-3">
          <ShieldX size={28} />
        </div>
        <p className="text-sm font-semibold text-white">
          Akses tidak diizinkan
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
      </div>
    );
  }

  return children;
};

export default AdminIndukWrapper;
