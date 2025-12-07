// components/settings/workspace/workspace-header.tsx

interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceHeaderProps {
  workspace: Workspace;
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  return null; // Removed header - details now shown in form section
}
