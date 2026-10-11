import type { ReactNode } from "react";
import { FileText, Share2, Sparkles } from "lucide-react";
import Link from "next/link";

type AuthPageLayoutProps = {
  children: ReactNode;
  mode: "sign-in" | "sign-up";
};

const features = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export function AuthPageLayout({ children, mode }: AuthPageLayoutProps) {
  const sectionLabel = mode === "sign-in" ? "Sign in" : "Sign up";

  return (
    <main className="grid min-h-dvh bg-background text-foreground lg:grid-cols-2">
      <section className="flex min-h-[55dvh] flex-col px-6 py-8 sm:px-10 sm:py-10 lg:min-h-dvh lg:px-14 lg:py-12 xl:px-16">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
          <Link className="inline-flex items-center gap-3 text-base font-semibold tracking-tight" href="/">
            <span aria-hidden="true" className="size-9 rounded-lg bg-auth-accent shadow-sm" />
            Ghost AI
          </Link>

          <div className="my-auto py-12 lg:py-20">
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
              Design systems at the speed of thought.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
            </p>

            <ul className="mt-12 space-y-7 sm:mt-14 sm:space-y-8">
              {features.map(({ icon: Icon, title, description }) => (
                <li className="flex gap-4" key={title}>
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-auth-accent/20 bg-auth-accent-soft text-auth-accent">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-medium leading-6">{title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label={sectionLabel} className="flex min-h-[45dvh] items-center justify-center border-t border-border bg-auth-panel px-6 py-12 sm:px-10 lg:min-h-dvh lg:border-l lg:border-t-0 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
