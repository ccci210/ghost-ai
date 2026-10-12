import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export function AccessDenied() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 text-center">
      <div className="flex max-w-md flex-col items-center">
        <div className="grid size-12 place-items-center rounded-xl border border-border bg-muted text-muted-foreground">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </div>
        <h1 className="mt-5 text-xl font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This project does not exist or you don’t have access to it.
        </p>
        <Link
          className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline"
          href="/editor"
        >
          Back to projects
        </Link>
      </div>
    </main>
  );
}
