import React from "react";
import { Workflow, Play, Sparkles, Smartphone, Globe, Monitor, ShieldCheck, Mail, Server } from "lucide-react";

export interface Template {
  id: string;
  nameEn: string;
  nameZh: string;
  descEn: string;
  descZh: string;
  platform: "android" | "ios" | "webgl" | "web" | "standalone" | "linux" | "docker";
  projectType: "unity" | "unreal" | "web" | "backend" | "mobile";
  steps: string[];
  icon: any;
  color: string;
}

interface TemplateGalleryProps {
  onSelectTemplate?: (steps: string[], platform: any, projectType: any) => void;
  isZh?: boolean;
}

export const PIPELINE_TEMPLATES_DATA: Template[] = [
  {
    id: "android-release",
    nameEn: "Android Release Workflow",
    nameZh: "Android 生产发布工作流",
    descEn: "Complete production-ready compilation with Keystore signing and Play Store Test Track release.",
    descZh: "完整生产级别的 Android 编译，包括自动证书签名和 Play Store 测试轨道提交分发。",
    platform: "android",
    projectType: "unity",
    steps: ["fetch", "checkout", "setup", "prebuild_script", "unity_build", "sign_package", "store_upload", "notify"],
    icon: Smartphone,
    color: "from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-400 hover:border-emerald-500"
  },
  {
    id: "webgl-build",
    nameEn: "WebGL Diagnostics & Play",
    nameZh: "WebGL 网页性能分析工作流",
    descEn: "Optimized WebGL compiler configurations with Addressables assets packaging.",
    descZh: "深度优化的 WebGL 网页编译流水线，包含 Addressable 寻址资源包打包编译门禁。",
    platform: "webgl",
    projectType: "unity",
    steps: ["fetch", "checkout", "setup", "addressables", "unity_build", "quality_check", "notify"],
    icon: Globe,
    color: "from-sky-500/10 to-indigo-500/5 border-sky-500/30 text-sky-400 hover:border-sky-500"
  },
  {
    id: "ios-release",
    nameEn: "iOS App Store Delivery",
    nameZh: "iOS 苹果商店交付流水线",
    descEn: "iOS native build with PBXProject Xcode post-processing, manual provisioning, and TestFlight upload.",
    descZh: "包含 C# PBXProject 后期工程签名处理、苹果开发者证书配置及 TestFlight 自动分发机制。",
    platform: "ios",
    projectType: "unity",
    steps: ["fetch", "checkout", "setup", "prebuild_script", "unity_build", "postprocess_xcode", "sign_package", "store_upload", "notify"],
    icon: ShieldCheck,
    color: "from-indigo-500/10 to-violet-500/5 border-indigo-500/30 text-indigo-400 hover:border-indigo-500"
  },
  {
    id: "docker-k8s",
    nameEn: "Docker Kubernetes Microservice",
    nameZh: "Docker Kubernetes 容器微服务",
    descEn: "Production-grade DevOps pipeline for full-stack dockerizing and Kubernetes orchestration.",
    descZh: "云原生容器部署流水线，集成依赖检查、微服务打包、Docker 镜像封装及 K8s 集群发布部署。",
    platform: "web",
    projectType: "backend",
    steps: ["fetch", "setup", "clean", "backend_compile", "docker_build", "k8s_deploy", "notify"],
    icon: Server,
    color: "from-amber-500/10 to-orange-500/5 border-amber-500/30 text-amber-400 hover:border-amber-500"
  }
];

export default function TemplateGallery({ onSelectTemplate, isZh = false }: TemplateGalleryProps) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm" id="pipeline-templates-gallery">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-sans">
            {isZh ? "预设流水线模板库" : "Pipeline Templates Gallery"}
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>{isZh ? "点击一键覆盖配置" : "Click to auto-configure"}</span>
        </span>
      </div>

      <p className="text-[10px] text-gray-400 leading-relaxed">
        {isZh 
          ? "针对游戏客户端、混合打包及后端容器微服务等常见的 DevOps 作业提供的一键预设。选中后将自动调整左侧的可视化步骤以及运行参数。"
          : "Pre-built build, cook, sign and upload pipelines for mobile stores, WebGL builds, and dockerized microservices."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PIPELINE_TEMPLATES_DATA.map(t => {
          const IconComponent = t.icon;
          const templateName = isZh ? t.nameZh : t.nameEn;
          const templateDesc = isZh ? t.descZh : t.descEn;

          return (
            <button
              key={t.id}
              onClick={() => onSelectTemplate?.(t.steps, t.platform, t.projectType)}
              className={`group flex flex-col items-start text-left p-3.5 bg-gradient-to-br rounded-xl border transition-all hover:scale-[1.01] duration-150 relative overflow-hidden cursor-pointer ${t.color}`}
            >
              {/* Decorative accent icon in background */}
              <div className="absolute right-2 bottom-2 text-gray-800/10 group-hover:text-gray-800/20 group-hover:scale-110 transition-all duration-300 pointer-events-none">
                <IconComponent className="h-16 w-16" />
              </div>

              <div className="flex items-center gap-2 mb-1.5 z-10">
                <div className="p-1.5 rounded-lg bg-gray-900 border border-gray-800">
                  <IconComponent className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-gray-100">{templateName}</span>
              </div>

              <p className="text-[10px] text-gray-400 leading-relaxed mb-3 z-10 pr-4">
                {templateDesc}
              </p>

              {/* Steps badge overview */}
              <div className="flex flex-wrap gap-1 z-10 w-full">
                {t.steps.map(stepId => (
                  <span 
                    key={stepId} 
                    className="px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-800/80 text-[8px] font-mono text-gray-500 uppercase tracking-tighter"
                  >
                    {stepId.substring(0, 8)}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-[9px] font-bold text-indigo-400 flex items-center gap-1 group-hover:text-indigo-300 transition-colors z-10">
                <Play className="h-2.5 w-2.5 fill-current" />
                <span>{isZh ? "应用此预设" : "Apply Workflow Template"}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
