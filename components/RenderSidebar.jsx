"use client"
import { useAuth } from "@clerk/clerk-react";
import { getUser } from "@/app/actions/getUser";
import { useEffect, useState } from "react";
import SideBarAdminInduk from "./Sidebar-admin-induk";
import SidebarSkeleton from "./Sidebar-skeleton";

const RenderSidebar = () => {
    const { userId, isLoaded } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (isLoaded && userId) {
                try {
                    const userData = await getUser(userId);
                    setUser(userData);
                } catch (error) {
                    console.error("Gagal mengambil data user:", error);
                } finally {
                    setLoading(false);
                }
            } else if (isLoaded && !userId) {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, isLoaded]); // Menjalankan ulang jika userId atau isLoaded berubah

    if (!isLoaded || loading) return <SidebarSkeleton />;

    if (!user) {
        return <div>Role tidak dikenal..</div>;
    }

    const role = user.role;
    
    if (role === "ADMIN_INDUK") {
        return <SideBarAdminInduk />;
    } else if (role === "ADMIN_OPD") {
        return <div>sidebar admin opd</div>;
    } else if (role === "PIMPINAN") {
        return <div>sidebar PIMPINAN</div>;
    }

    return <div>Something wrong</div>;
}

export default RenderSidebar;