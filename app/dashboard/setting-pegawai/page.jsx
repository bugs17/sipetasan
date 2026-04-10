import { getUserRoleByClerkID } from "@/app/actions/get-user-role-by-clerk-id";
import SettingPegawaiAdminInduk from "@/components/setting-pegawai-admin-induk";
import SettingPegawaiAdminOpd from "@/components/setting-pegawai-admin-opd";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const { userId } = await auth();
  let user;
  try {
    user = await getUserRoleByClerkID(userId);
  } catch (error) {
    console.log("Error here", error.message);
  }

  if (user.role === "ADMIN_INDUK") {
    return <SettingPegawaiAdminInduk />;
  }

  if (user.role === "ADMIN_OPD") {
    return <SettingPegawaiAdminOpd />;
  }

  return null;
};

export default page;
