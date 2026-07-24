import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Target, Users, BarChart3, TrendingUp, ShieldCheck, 
  Globe, Cpu, Briefcase, DollarSign, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const BPSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => {
  const { mode } = useTheme();
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-12 border rounded-3xl p-8 backdrop-blur-sm transition-colors duration-500 ${mode === 'dark' ? 'bg-white/[0.03] border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${mode === 'dark' ? 'bg-accent/10 border-accent/20' : 'bg-accent/5 border-accent/10'}`}>
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <h2 className={`text-2xl font-black tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      </div>
      {children}
    </motion.section>
  );
};

export default function BusinessPlan() {
  const { mode } = useTheme();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-6 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${mode === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-accent/5 border-accent/10 text-accent'}`}
        >
          <Rocket className="w-3 h-3" /> Business Case: DevOps Hub v1.0
        </motion.div>
        <h1 className={`text-5xl md:text-7xl font-black tracking-tight leading-none ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          DevOps Hub <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
            商业计划书
          </span>
        </h1>
        <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          重构全栈工程交付基础设施。从高保真游戏引擎到分布式后端架构，
          为下一代高性能研发团队提供核心动能。
        </p>
      </div>

      {/* 1. 执行摘要 */}
      <BPSection title="执行摘要 (Executive Summary)" icon={Target}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 愿景目标
            </h3>
            <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              DevOps Hub 致力于解决现代复杂工程（如 Unity/Unreal 游戏开发、
              跨平台 Web/移动端应用）在构建、分发与可观测性上的断层。
              通过 AI 驱动的编排引擎，将研发效率提升 300% 以上。
            </p>
          </div>
          <div className="space-y-4">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 核心优势
            </h3>
            <ul className={`space-y-2 text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-center gap-2">· 原生支持 C++/C#/Unity/UE 高性能并行构建</li>
              <li className="flex items-center gap-2">· AI 智能诊断：将构建错误修复时间从小时级缩短至分钟级</li>
              <li className="flex items-center gap-2">· 分布式 Runner 池：全球节点自动调度与 DDC 缓存对齐</li>
            </ul>
          </div>
        </div>
      </BPSection>

      {/* 2. 产品与技术架构 */}
      <BPSection title="产品与技术架构 (Product & Tech)" icon={Cpu}>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "编排引擎", desc: "基于 DAG 的分布式流水线设计器，支持跨云调度。" },
              { title: "AI 架构师", desc: "LLM 驱动的构建脚本自动生成与优化，消除配置漂移。" },
              { title: "全栈分发", desc: "一键触达 App Store、Play Store、CDN 及私有仓库。" },
            ].map((item, i) => (
              <div key={i} className={`border p-6 rounded-2xl transition-colors ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h4 className={`font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                <p className={`text-xs leading-relaxed ${mode === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className={`p-6 border rounded-2xl ${mode === 'dark' ? 'bg-accent/5 border-accent/10' : 'bg-accent/[0.02] border-accent/10'}`}>
            <h4 className="text-accent font-bold mb-4">技术护城河 (Tech Moat)</h4>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <span>分布式增量编译加速算法，针对大规模 C++ 工程优化，提升 5x 构建速度。</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <span>专利级构建指纹识别技术，实现 99% 的构建产物可复用率。</span>
              </div>
            </div>
          </div>
        </div>
      </BPSection>

      {/* 3. 市场分析 */}
      <BPSection title="市场分析 (Market Analysis)" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className={`text-sm font-bold uppercase ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Total Addressable Market</div>
              <div className={`text-4xl font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>$45.0B +</div>
              <div className="text-xs text-accent">Global DevOps & Game Tech Market by 2028</div>
            </div>
            <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              随着元宇宙、高保真手游及复杂后端微服务的爆发，传统的通用型 CI/CD 
              (如 Jenkins) 已无法满足高性能工程的需求。针对特定垂直领域的 DevOps 
              正处于爆发前期。
            </p>
          </div>
          <div className={`p-6 rounded-2xl border space-y-4 ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h4 className={`text-sm font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>目标客群 (Target Audience)</h4>
            <div className="space-y-3">
              {[
                { label: "大型游戏开发商", sub: "处理数十 GB 级的资产构建与同步" },
                { label: "跨境互联网企业", sub: "需要全球分布式节点与合规发布" },
                { label: "AI & 自动驾驶团队", sub: "高频率的模型训练产物打包与部署" },
              ].map((group, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className={`font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{group.label}</span>
                  <span className={`text-gray-500`}>{group.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BPSection>

      {/* 4. 商业模式 */}
      <BPSection title="商业模式 (Business Model)" icon={DollarSign}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              plan: "Pro SaaS", 
              price: "$299/mo", 
              features: ["10 并行构建", "AI 基础诊断", "1TB 存储"] 
            },
            { 
              plan: "Enterprise", 
              price: "Custom", 
              features: ["无限并行", "私有化部署", "24/7 SLA", "定制化签名服务"],
              highlight: true
            },
            { 
              plan: "Hybrid Cloud", 
              price: "Usage-based", 
              features: ["按需调度节点", "节点池计费", "资源自动回收"] 
            },
          ].map((tier, i) => (
            <div key={i} className={`p-8 rounded-[2rem] border transition-all ${tier.highlight ? 'bg-accent border-accent shadow-2xl shadow-accent/20' : (mode === 'dark' ? 'bg-gray-950 border-white/5' : 'bg-white border-gray-100 shadow-sm')}`}>
              <h4 className={`text-lg font-black mb-2 ${tier.highlight ? 'text-white' : (mode === 'dark' ? 'text-gray-300' : 'text-gray-900')}`}>{tier.plan}</h4>
              <div className={`text-2xl font-black mb-6 ${tier.highlight ? 'text-white' : 'text-accent'}`}>{tier.price}</div>
              <ul className={`space-y-3 mb-8 text-xs ${tier.highlight ? 'text-white/80' : (mode === 'dark' ? 'text-gray-500' : 'text-gray-500')}`}>
                {tier.features.map((f, j) => <li key={j} className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 shrink-0" /> {f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </BPSection>

      {/* 5. 融资计划 */}
      <BPSection title="融资计划与里程碑 (Roadmap)" icon={TrendingUp}>
        <div className={`relative pl-8 border-l space-y-12 ${mode === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          {[
            { date: "2026 Q3", title: "种子轮融资", desc: "融资 $2M，用于核心构建引擎研发与首批 50 家企业客户接入。" },
            { date: "2027 Q1", title: "v2.0 全球发布", desc: "推出 AI 架构师全量版，支持主流游戏引擎的零配置迁移。" },
            { date: "2027 Q4", title: "A 轮融资", desc: "目标融资 $15M，启动全球数据中心节点建设与生态合作伙伴计划。" },
          ].map((milestone, i) => (
            <div key={i} className="relative">
              <div className={`absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-accent border-4 ${mode === 'dark' ? 'border-[#030712]' : 'border-white'}`} />
              <div className="text-xs font-black text-accent mb-2">{milestone.date}</div>
              <h4 className={`text-xl font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{milestone.title}</h4>
              <p className={`text-sm leading-relaxed max-w-xl ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{milestone.desc}</p>
            </div>
          ))}
        </div>
      </BPSection>

      {/* Footer CTA */}
      <div className="pt-20 pb-32 text-center">
        <div className="bg-gradient-to-br from-accent to-purple-600 p-12 rounded-[3rem] text-white space-y-8 shadow-2xl shadow-accent/20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
            与我们一起 <br />
            开启全栈工程新纪元
          </h2>
          <p className="text-white/80 font-medium text-lg max-w-xl mx-auto">
            如果您是对 DevOps 基础设施感兴趣的投资者或合作伙伴，
            请即刻与我们的创始团队取得联系。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-accent font-black px-10 py-5 rounded-full text-sm uppercase tracking-tighter hover:bg-gray-100 transition-all flex items-center gap-2">
              获取详细 PDF <BarChart3 className="w-4 h-4" />
            </button>
            <button className="bg-black/20 text-white border border-white/20 font-black px-10 py-5 rounded-full text-sm uppercase tracking-tighter hover:bg-black/30 transition-all flex items-center gap-2">
              联系创始团队 <Briefcase className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
