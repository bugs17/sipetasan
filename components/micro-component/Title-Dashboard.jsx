"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getUser } from "@/app/actions/getUser";
import { CheckCheck, Shield } from "lucide-react";

const TitleDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userId, isLoaded } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      if (isLoaded && userId) {
        try {
          const userData = await getUser(userId);
          setUser(userData);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, [userId, isLoaded]);

  return (
    <div className="flex flex-row w-full justify-end items-center">
      <span className="text-slate-400 uppercase flex flex-row items-center gap-3 text-xs font-mono">
        {(!isLoading && user.opd?.namaOpd) || "ADMIN INDUK"}
      </span>
    </div>
  );
};

export default TitleDashboard;
