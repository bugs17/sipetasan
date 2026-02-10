import dynamic from "next/dynamic";

import SidebarLogo from "@/components/SidebarLogo";
import TitleDashboard from "@/components/micro-component/Title-Dashboard";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import RenderSidebar from "@/components/RenderSidebar";


const AuthWrapper = dynamic(
  () => import("../context/AuthWraper"),
  { ssr: false }
);

export default function DashboardLayout({ children }) {

  


  return (
    <AuthWrapper>
      <span className="text-xs font-mono opacity-50 absolute z-50 right-2 bottom-2">
        Version {process.env.NEXT_PUBLIC_APP_VERSION}
      </span>

      <div className="w-screen h-screen flex flex-row">
        <div className="w-[15%] bg-black h-screen flex flex-col">
          <div className="justify-center flex items-center font-bold h-16">
            <SidebarLogo />
          </div>

          <div className="w-full flex-grow overflow-y-auto py-5">
            <RenderSidebar />
          </div>
          <UserProfileDropdown />
        </div>

        <div className="w-[85%] border-[1px] border-slate-700 rounded-l-2xl bg-[#121c22] h-screen flex flex-col">
          <div className="border-b-[1px] border-slate-700 w-full h-16 flex flex-row justify-between items-center px-6">
            <TitleDashboard />
          </div>

          <div className="w-full flex-1 overflow-auto bg-[radial-gradient(rgba(229,231,235,0.1)_1px,transparent_1px)] [background-size:16px_16px]">
            {children}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}

