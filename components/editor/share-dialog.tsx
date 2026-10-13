"use client";

import { useEffect, useState } from "react";
import { Check, Copy, LoaderCircle, Plus, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Collaborator = {
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: string;
};

type ShareDialogProps = {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner: boolean;
};

export function ShareDialog({ projectId, projectName, open, onOpenChange, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [canManage, setCanManage] = useState(isOwner);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function loadCollaborators() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/collaborators`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to load collaborators");
      setCollaborators(data.collaborators);
      setCanManage(Boolean(data.canManage));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load collaborators");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (open) void loadCollaborators();
    // Refresh whenever the dialog opens for the current project.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, projectId]);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to invite collaborator");
      setEmail("");
      await loadCollaborators();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Unable to invite collaborator");
      setIsLoading(false);
    }
  }

  async function remove(emailToRemove: string) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToRemove }),
      });
      const data = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Unable to remove collaborator");
      setCollaborators((current) => current.filter((person) => person.email !== emailToRemove));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove collaborator");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/editor/${encodeURIComponent(projectId)}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy the project link");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(36rem,calc(100dvh-2rem))] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share “{projectName}”</DialogTitle>
          <DialogDescription>Invite people to collaborate on this project.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {canManage ? (
            <form className="flex gap-2" onSubmit={invite}>
              <Input
                aria-label="Collaborator email"
                autoComplete="email"
                disabled={isLoading}
                onChange={(event) => setEmail(event.currentTarget.value)}
                placeholder="name@example.com"
                type="email"
                value={email}
              />
              <Button disabled={isLoading || !email.trim()} type="submit">
                <Plus /> Invite
              </Button>
            </form>
          ) : null}

          <section aria-labelledby="collaborators-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium" id="collaborators-heading">People with access</h3>
              <span className="text-xs text-muted-foreground">{collaborators.length} {collaborators.length === 1 ? "person" : "people"}</span>
            </div>
            {isLoading && collaborators.length === 0 ? (
              <div className="flex items-center gap-2 py-5 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Loading people…</div>
            ) : collaborators.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-7 text-center text-sm text-muted-foreground">
                <Users className="size-5" /> No collaborators yet.
              </div>
            ) : (
              <ul className="max-h-52 space-y-1 overflow-y-auto">
                {collaborators.map((person) => (
                  <li className="flex items-center gap-3 rounded-md px-2 py-2" key={person.email}>
                    {person.imageUrl ? (
                      // Clerk-hosted profile images are external URLs.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="" className="size-9 rounded-full object-cover" src={person.imageUrl} />
                    ) : (
                      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold uppercase">
                        {(person.name ?? person.email).slice(0, 1)}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{person.name ?? person.email}</span>
                      {person.name ? <span className="block truncate text-xs text-muted-foreground">{person.email}</span> : null}
                    </span>
                    {canManage ? (
                      <Button aria-label={`Remove ${person.email}`} disabled={isLoading} onClick={() => void remove(person.email)} size="icon-sm" title="Remove access" variant="ghost">
                        <Trash2 />
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
          {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button className="w-full sm:w-auto" onClick={() => void copyLink()} type="button" variant="outline">
            {copied ? <Check /> : <Copy />}{copied ? "Copied!" : "Copy project link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
