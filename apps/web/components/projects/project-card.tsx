import { Users, CalendarDays, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { PROJECT_STATUS } from "@/lib/design-tokens";
import { formatDueDate } from "@/lib/utils/date";
import { getInitials } from "@/store/slices/auth.slice";
import type { ProjectWithMeta } from "@/lib/mock/projects";
import type { ProjectStatus } from "@/types/project";

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const isComplete = pct === 100;

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isComplete ? "bg-green-500" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="w-7 text-right text-xs text-muted-foreground">
        {pct}%
      </span>
    </div>
  );
}

// ─── MemberAvatarStack ────────────────────────────────────────────────────────

function MemberAvatarStack({
  members,
}: {
  members: ProjectWithMeta["members"];
}) {
  const MAX_VISIBLE = 3;
  const visible = members.slice(0, MAX_VISIBLE);
  const extra = members.length - MAX_VISIBLE;

  return (
    <div className="flex -space-x-1.5">
      {visible.map((m) => (
        <span
          key={m.id}
          title={m.name}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-surface-0 bg-primary/15 text-[9px] font-semibold text-primary"
        >
          {getInitials(m.name)}
        </span>
      ))}
      {extra > 0 && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-surface-0 bg-muted text-[9px] font-medium text-muted-foreground">
          +{extra}
        </span>
      )}
    </div>
  );
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: ProjectWithMeta;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusToken = PROJECT_STATUS[project.status as ProjectStatus];
  const isInactive =
    project.status === "archived" || project.status === "completed";

  return (
    <article className="group flex flex-col gap-4 rounded-xl border border-border bg-surface-0 p-5 shadow-xs transition-colors hover:border-primary/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
            statusToken.badge,
          )}
        >
          {statusToken.label}
        </span>
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Actions for ${project.name}`}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {/* Name + description */}
      <div className="flex flex-col gap-1">
        <h3
          className={cn(
            "text-sm font-semibold leading-snug",
            isInactive ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {project.name}
        </h3>
        {project.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="flex flex-col gap-1">
        <ProgressBar done={project.doneTasks} total={project.taskCount} />
        <span className="text-xs text-muted-foreground">
          {project.doneTasks}/{project.taskCount} tasks done
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/50 pt-3">
        <MemberAvatarStack members={project.members} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {project.memberCount}
          </span>
          {project.dueDate && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              {formatDueDate(project.dueDate)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
