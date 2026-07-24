export type BuildPlatform = "webgl" | "android" | "ios" | "standalone" | "unreal" | "web" | "linux" | "docker" | "k8s" | "mobile" | "backend";
export type ProjectType = "unity" | "unreal" | "web" | "mobile" | "cloud" | "backend" | "fullstack";

export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiredFor: BuildPlatform[];
  engines?: ProjectType[];
}

export type CodeType = "csharp" | "jenkins" | "github" | "python" | "cpp" | "docker";

export interface GeneratedCode {
  title: string;
  type: CodeType;
  filename: string;
  code: string;
  explanation: string;
}

export interface QuickIssue {
  id: string;
  title: string;
  platform: "all" | "ios" | "android" | "il2cpp" | "unreal" | "standalone";
  summary: string;
  sampleError: string;
  solution: string;
  engine?: ProjectType | "both";
}

export interface DiagnosticRequest {
  errorLog: string;
  platform: BuildPlatform | "general";
}

export interface DiagnosticResponse {
  rootCause: string;
  steps: string[];
  explanation: string;
  codeSnippet?: string;
  codeSnippetLanguage?: string;
}

export interface ArchitectRequest {
  language: "csharp" | "python" | "cpp" | "java" | "yaml" | "terraform";
  prompt: string;
  unityVersion?: string;
}

export interface ArchitectResponse {
  script: string;
  filename: string;
  explanation: string;
  usageInstructions: string;
}

export type UserRole = "admin" | "ops" | "developer" | "guest";

export interface Artifact {
  id: string;
  name: string;
  version: string;
  type: "apk" | "ipa" | "binary" | "docker-image";
  size: string;
  checksum: string;
  createdAt: string;
  buildId: string;
  downloadUrl: string;
  environment: "production" | "staging" | "internal";
}

export interface UserContextType {
  user: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
  hasPermission: (permission: string) => boolean;
  setRole: (role: UserRole) => void;
}

export interface DeploymentRecord {
  id: string;
  version: string;
  environment: "staging" | "production" | "internal";
  status: "success" | "running" | "failed" | "pending";
  deployedBy: string;
  deployedAt: string;
  platform: BuildPlatform;
  releaseNotes?: string;
}
