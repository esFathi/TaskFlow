import { MoreHorizontal, ClipboardList, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROLE } from "@/lib/design-tokens";
import { getInitials } from "@/store/slices/auth.slice";
import type { TeamMember, MemberStatus } from "@/lib/mock/team";
import type { UserRole } from "@/types/user";

// ─── StatusDot ────────────────────────────────────────────────────────────────

const STATUS_DOT: Record<MemberStatus, string> = {
  active: "bg-green-500",
  inactive: "bg-zinc-400",
  invited: "bg-yellow-500",
};

const STATUS_LABEL: Record<MemberStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  invited: "Invited",
};

// ─── MemberAvatar ─────────────────────────────────────────────────────────────

function MemberAvatar({ member }: { member: TeamMember }) {
  return (
    <div className="relative w-fit">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">
        {getInitials(member.name)}
      </span>
      <span
        className={cn(
          "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-0",
          STATUS_DOT[member.status],
        )}
        title={STATUS_LABEL[member.status]}
      />
    </div>
  );
}

// ─── ProjectTags ──────────────────────────────────────────────────────────────

function ProjectTags({ projects }: { projects: TeamMember["projects"] }) {
  const MAX = 2;
  const visible = projects.slice(0, MAX);
  const extra = projects.length - MAX;

  if (projects.length === 0) {
    return (
      <span className="text-xs text-muted-foreground/50">No projects yet</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((p) => (
        <span
          key={p.id}
          className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
        >
          {p.name}
        </span>
      ))}
      {extra > 0 && (
        <span className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          +{extra} more
        </span>
      )}
    </div>
  );
}

// ─── TeamMemberCard ───────────────────────────────────────────────────────────

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const roleToken = ROLE[member.role as UserRole];
  const isInvited = member.status === "invited";

  return (
    <article
      className={cn(
        "group flex flex-col gap-4 rounded-xl border border-border bg-surface-0 p-5 shadow-xs transition-colors hover:border-primary/30",
        isInvited && "opacity-70",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <MemberAvatar member={member} />
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Actions for ${member.name}`}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {/* Identity */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-foreground">{member.name}</p>
        <p className="truncate text-xs text-muted-foreground">{member.email}</p>
        <span
          className={cn(
            "mt-1.5 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium",
            roleToken.badge,
          )}
        >
          {roleToken.label}
        </span>
      </div>

      {/* Projects */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Projects
        </p>
        <ProjectTags projects={member.projects} />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ClipboardList className="size-3" />
          {member.taskCount} tasks
        </span>
        <span className="flex items-center gap-1">
          <FolderOpen className="size-3" />
          {member.projects.length} projects
        </span>
      </div>
    </article>
  );
}
