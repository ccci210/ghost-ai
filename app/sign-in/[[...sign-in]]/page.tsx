import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";

export default function SignInPage() {
  return (
    <AuthPageLayout mode="sign-in">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sign in…</p>}>
        <SignIn />
      </Suspense>
    </AuthPageLayout>
  );
}
