import React from "react";
import { auth } from "@clerk/nextjs/server";
import InstansiCard from "@/components/PetaJabatanInduk";
import PetaJabatanEditor from "../../components/interactive-peta-jabatan";
import { getUserRoleByClerkID } from "../actions/get-user-role-by-clerk-id";

const Home = async () => {
  const { userId } = auth();

  let user;
  try {
    user = await getUserRoleByClerkID(userId);
  } catch (error) {
    return {};
  }

  const role = user.role;

  if (role === "ADMIN_INDUK") {
    return <InstansiCard />;
  } else if (role === "ADMIN_OPD") {
    return <PetaJabatanEditor />;
  } else if (role === "PIMPINAN") {
    return <div>Pimpinan dashboard</div>;
  }
};

export default Home;
