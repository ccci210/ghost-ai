import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";

export default function SignUpPage() {
  return (
    <AuthPageLayout mode="sign-up">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sign up…</p>}>
        <SignUp />
      </Suspense>
    </AuthPageLayout>
  );
}
