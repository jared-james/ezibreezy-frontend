// components/settings/workspace/workspace-header.tsx

interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceHeaderProps {
  workspace: Workspace;
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  return (
    <div>
      <h2 className="headline text-3xl font-bold">Workspace Settings</h2>
      <div className="mt-6 flex items-center gap-3 p-3 bg-surface-hover border border-border">
        <div className="h-10 w-10 bg-brand-primary text-white flex items-center justify-center font-serif text-lg font-bold">
          {workspace.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-serif text-sm font-bold leading-none">
            {workspace.name}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            ID: {workspace.id}
          </p>
        </div>
      </div>
    </div>
  );
}
