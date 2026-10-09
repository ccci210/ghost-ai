import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RedirectByAuthState />
    </Suspense>
  );
}

async function RedirectByAuthState() {
  const { userId } = await auth();

  return redirect(
    userId
      ? "/editor"
      : process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in",
  );
}
