"use client";

import { useUser, SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const AuthWrapper = ({ children }) => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
        <div className="absolute inset-0 -z-10 h-full w-full px-5 py-24
            [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
        />
        <SignIn 
        appearance={{
            elements:{
                footer:"hidden",
            },
            baseTheme: dark,
        }} 
        fallbackRedirectUrl="/dashboard"
        afterSignOutUrl="/"
        routing="hash" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;