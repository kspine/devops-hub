import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Server, 
  Plus, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Search,
  MoreVertical,
  CheckCircle2,
  Copy,
  Archive,
  ChevronRight,
  Smartphone,
  Layers
} from "lucide-react";
import { useWorkspace, Workspace } from "../../WorkspaceContext";
import { ProjectType } from "../../types";
import { useLanguage } from "../../LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../ToastContext";

const PROJECT_TYPE_CONFIG: Record<ProjectType, { label: string, color: string, icon: any }> = {
  unity: { label: "Unity", color: "text-emerald-400", icon: ShieldCheck },
  unreal: { label: "Unreal", color: "text-indigo-400", icon: Zap },
  web: { label: "Web", color: "text-amber-400", icon: ShieldCheck },
  mobile: { label: "Mobile", color: "text-rose-400", icon: Smartphone },
  cloud: { label: "Cloud", color: "text-blue-400", icon: RefreshCw },
  backend: { label: "Backend", color: "text-purple-400", icon: Server },
  fullstack: { label: "Full-Stack", color: "text-purple-400", icon: Layers }
};

export default function WorkspaceManager() {
  const { 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspaceId, 
    createWorkspace, 
    deleteWorkspace 
  } = useWorkspace();
  const { language } = useLanguage();
  const { mode } = useTheme();
  const { addToast } = useToast();
  const isZh = language === "zh";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newWs, setNewWs] = useState({
    name: "",
    projectType: "unity" as ProjectType,
    engineVersion: "2022.3 LTS",
    targetPlatform: "iOS"
  });

  useEffect(() => {
    const handleOpenModal = () => setShowCreateModal(true);
    window.addEventListener("open-create-workspace-modal", handleOpenModal);
    return () => window.removeEventListener("open-create-workspace-modal", handleOpenModal);
  }, []);

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.projectType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!newWs.name.trim()) {
      addToast(isZh ? "请输入空间名称" : "Please enter workspace name", "error");
      return;
    }
    createWorkspace(newWs);
    setShowCreateModal(false);
    setNewWs({ name: "", projectType: "unity", engineVersion: "2022.3 LTS", targetPlatform: "iOS" });
    addToast(isZh ? "工作空间已创建" : "Workspace created", "success");
  };

  return (
    <div className="space-y-6" id="workspace-manager-view">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {isZh ? "工作空间管理中心" : "Workspace Management"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isZh ? "管理您的多端项目构建环境、堆栈隔离与并行工作流。" : "Manage your multi-platform build environments, stack isolation, and parallel workflows."}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-accent/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {isZh ? "创建工作空间" : "New Workspace"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: isZh ? "总空间" : "Total Workspaces", value: workspaces.length, icon: Server, color: "text-accent" },
          { label: isZh ? "活跃中" : "Active Now", value: workspaces.filter(w => w.status === 'Active').length, icon: Zap, color: "text-emerald-400" },
          { label: isZh ? "平均构建时间" : "Avg Build Time", value: "14m 20s", icon: Clock, color: "text-indigo-400" }
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border transition-all ${mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${mode === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-2xl font-bold text-gray-500/10">0{i+1}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Workspace List */}
      <div className={`rounded-2xl border transition-all overflow-hidden ${mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text"
              placeholder={isZh ? "搜索工作空间..." : "Search workspaces..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:border-accent transition-all ${
                mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-500 hover:bg-white/5"><RefreshCw className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredWorkspaces.map(ws => {
            const config = PROJECT_TYPE_CONFIG[ws.projectType];
            const isActive = activeWorkspaceId === ws.id;
            return (
              <div 
                key={ws.id} 
                className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all group ${isActive ? (mode === 'dark' ? 'bg-accent/5' : 'bg-accent/[0.02]') : (mode === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/50')}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border transition-all ${
                    isActive ? 'border-accent/40 bg-accent/10 shadow-[0_0_15px_rgba(var(--accent-color-rgb),0.2)]' : 'border-white/10 bg-white/5'
                  }`}>
                    {config && <config.icon className={`h-7 w-7 ${config.color}`} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className={`font-bold transition-colors ${isActive ? 'text-accent' : (mode === 'dark' ? 'text-gray-100' : 'text-gray-900')}`}>
                        {ws.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        ws.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-gray-500/10 text-gray-500 border-white/10'
                      }`}>
                        {ws.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                        <Archive className="h-3 w-3" />
                        <span>{ws.projectType.toUpperCase()}</span>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-gray-500/30" />
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                        <RefreshCw className="h-3 w-3" />
                        <span>{ws.engineVersion}</span>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-gray-500/30" />
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                        <Smartphone className="h-3 w-3" />
                        <span>{ws.targetPlatform}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {(ws.projectType === 'fullstack' || ws.projectType === 'backend') && (
                    <button 
                      onClick={() => {
                        setActiveWorkspaceId(ws.id);
                        window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "services" }));
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        mode === 'dark' ? 'bg-accent/10 border-accent/20 text-accent hover:bg-accent/20' : 'bg-accent/5 border-accent/20 text-accent hover:bg-accent/10'
                      }`}
                    >
                      {isZh ? "管理服务" : "Manage Services"}
                    </button>
                  )}
                  {!isActive ? (
                    <button 
                      onClick={() => {
                        setActiveWorkspaceId(ws.id);
                        addToast(isZh ? `已切换至 ${ws.name}` : `Switched to ${ws.name}`, "info");
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {isZh ? "切换进入" : "Switch To"}
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {isZh ? "当前空间" : "Current Workspace"}
                    </div>
                  )}
                  <button className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                  }`}>
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
                mode === 'dark' ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-gray-100'
              }`}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold">{isZh ? "创建新工作空间" : "Create New Workspace"}</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white transition-colors"><Plus className="h-6 w-6 rotate-45" /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "空间名称" : "WORKSPACE NAME"}</label>
                  <input 
                    type="text" 
                    value={newWs.name}
                    onChange={e => setNewWs(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Project-Alpha-Prod"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent font-bold ${
                      mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "项目类型" : "PROJECT TYPE"}</label>
                    <select 
                      value={newWs.projectType}
                      onChange={e => setNewWs(prev => ({ ...prev, projectType: e.target.value as ProjectType }))}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent appearance-none ${
                        mode === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="unity">Unity</option>
                      <option value="unreal">Unreal</option>
                      <option value="web">Web App</option>
                      <option value="mobile">Mobile App</option>
                      <option value="cloud">Cloud / Infrastructure</option>
                      <option value="backend">Backend Service</option>
                      <option value="fullstack">Enterprise Full-Stack</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {isZh 
                        ? (['unity', 'unreal'].includes(newWs.projectType) ? "引擎版本" : "核心版本 (如 Node/SDK)") 
                        : (['unity', 'unreal'].includes(newWs.projectType) ? "ENGINE VERSION" : "CORE VERSION (Node/SDK)")}
                    </label>
                    <input 
                      type="text" 
                      value={newWs.engineVersion}
                      onChange={e => setNewWs(prev => ({ ...prev, engineVersion: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent ${
                        mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "目标平台" : "TARGET PLATFORM"}</label>
                  <input 
                    type="text" 
                    value={newWs.targetPlatform}
                    onChange={e => setNewWs(prev => ({ ...prev, targetPlatform: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent ${
                      mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <button 
                  onClick={handleCreate}
                  className="w-full bg-accent text-white py-4 rounded-2xl font-bold hover:opacity-90 shadow-xl shadow-accent/20 transition-all mt-4 cursor-pointer"
                >
                  {isZh ? "确认创建" : "Complete Creation"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
