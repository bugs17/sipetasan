import { getUserRoleByClerkID } from "@/app/actions/get-user-role-by-clerk-id";
import MutasiIduk from "@/components/mutasi-induk";
import MutasiOPD from "@/components/mutasi-opd";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not Authorized...</div>;
  }

  // get user by clerkID
  const user = await getUserRoleByClerkID(userId);
  if (!user) {
    return <div>Not Authorized...</div>;
  }

  const role = user.role;

  if (role === "ADMIN_INDUK") {
    return <MutasiIduk />;
  } else if (role === "ADMIN_OPD") {
    return <MutasiOPD />;
  } else {
    return null;
  }
};

export default page;
