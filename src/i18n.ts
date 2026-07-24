import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          nav: { solutions: 'Solutions', features: 'Capabilities', resources: 'Resources', dashboard: 'Console', theme: 'Interface', stack: 'Stack', business: 'Business Plan' },
          hero: { 
            title: 'DevOps Hub Studio', 
            desc: 'The next-generation enterprise R&D efficiency platform designed for Unity, Unreal, Web, Mobile, and Backend microservices. Through high-performance build orchestration and intelligent telemetry, it enables distributed teams to achieve high-efficiency collaboration and built-in quality under high-frequency iteration.', 
            cta: 'Initialize Workspace', 
            demo: 'Architecture Guide', 
            badge: 'Enterprise v1.2.0 - Multi-Stack Enabled' 
          },
          trusted: 'Powering Industry Leaders',
          modules: {
            title: 'Integrated System Modules',
            cicd: { title: 'High-Performance CI/CD', desc: 'Distributed runner clusters with warm-cache acceleration for lightning-fast build cycles.' },
            telemetry: { title: 'Intelligent Observability', desc: 'Real-time telemetry streams and log analysis powered by pattern recognition engines.' },
            artifacts: { title: 'Artifact Management', desc: 'Global distribution network for versioned build packages and container images.' },
            architect: { title: 'AI Script Hub', desc: 'Automated pipeline generation using LLM-driven configuration blueprints.' },
            security: { title: 'Security & Signing', desc: 'Automated code signing, certificate management, and secure vaulting for sensitive credentials.' },
            distribution: { title: 'Delivery & Distribution', desc: 'Multi-channel distribution to App Store, Play Store, CDN, and Steam.' },
            learnMore: 'Learn More'
          },
          stack: {
            title: 'Full-Stack Compatibility',
            desc: 'Engineered to orchestrate the world\'s most demanding development ecosystems, from high-fidelity 3D engines to globally distributed microservices.'
          },
          preview: {
            title: 'Beyond Standard Pipelines',
            desc1: 'Unifying intelligent observability, distributed node pools, and automated artifact distribution into a seamless lifecycle.',
            feature1: 'Automated Configuration Drift Audit',
            feature2: 'Enterprise Security & Signing',
            feature3: 'P95 Latency & Cache Alignment'
          },
          solutions: {
            title: 'Enterprise Solutions',
            cicd: { 
              title: 'Universal Build Clusters', 
              desc: 'High-performance pipelines optimized for cross-platform delivery. Orchestrate Unity, Unreal, and Web targets from a single source of truth.',
              cta: 'Execute Pipeline',
              building: 'Building...',
              success: 'Build Completed',
              error: 'Build Failed',
              logs: [
                'Initializing multi-stack build cluster...',
                'Detecting architecture (Unity/Web/Mobile)...',
                'Orchestrating distributed runner nodes...',
                'Executing dependency alignment...',
                'Syncing artifacts to global CDN...'
              ]
            },
            infra: { 
              title: 'Infrastructure as Code', 
              desc: 'Declarative environment provisioning with built-in security guardrails and resource optimization.',
              cta: 'Deploy Infrastructure',
              building: 'Provisioning...',
              success: 'Infra Ready',
              error: 'Provisioning Failed',
              logs: [
                'Parsing IaC manifest (Terraform/Pulumi)...',
                'Validating security group policies...',
                'Provisioning high-availability clusters...',
                'Health check: Node 01-24 ONLINE'
              ]
            },
            enterprise: { 
              title: 'Secure Orchestration', 
              desc: 'Policy-driven workflow management for complex, multi-user enterprise environments.',
              cta: 'Run Audit',
              building: 'Orchestrating...',
              success: 'Orchestration Complete',
              error: 'Orchestration Failed',
              logs: [
                'Loading orchestration manifest...',
                'Enforcing compliance guards...',
                'Mapping cross-platform dependencies...',
                'Reports synchronized to dashboard.'
              ]
            }
          },
          features: {
            title: 'Platform Capabilities',
            orchestration: { title: 'Pipeline Topology', desc: 'Visualize and manage complex cross-stack build dependencies.' },
            governance: { title: 'Security & Auth', desc: 'Enterprise SSO, RBAC, and automated key management.' },
            platform: { title: 'Multi-Arch Scaling', desc: 'Unified build-release cycles for x64, ARM64, and Web targets.' },
            analytics: { title: 'Resource Efficiency', desc: 'Optimize node utilization and reduce pipeline drift.' },
            cloud: { title: 'Hybrid Cloud Ops', desc: 'Seamless orchestration across on-prem and multi-cloud nodes.' },
            storage: { title: 'Global Data Hub', desc: 'Low-latency artifact storage with automated versioning.' }
          },
          insights: {
            title: 'Real-time Pipeline Insights',
            throughput: 'Build Velocity',
            health: 'Cluster Integrity',
            resource: 'Node Utilization',
            efficiency: 'Cache Hit Rate',
            live: 'Live Console Feed',
            metrics: {
              active: 'Active Runners',
              activeDetail: 'System Active',
              queued: 'Queued Workflows',
              queuedDetail: 'Zero Wait-state',
              avgTime: 'Cycle Time',
              avgTimeDetail: 'Efficiency +18%',
              success: 'Integrity Rate',
              successDetail: 'SLA Compliant'
            }
          },
          resources: {
            title: 'Knowledge & Support',
            docs: { title: 'Engineering Docs', desc: 'Comprehensive guides for multi-stack integration.' },
            community: { title: 'Global Community', desc: 'Connect with elite DevOps and platform engineers.' },
            api: { title: 'System API', desc: 'Technical reference for deep orchestration hooks.' }
          },
          analytics: { title: 'Operational Velocity', desc: 'Monitor system health and delivery performance with millisecond precision.', label: 'Build Throughput (Req/Hr)' },
          cta: { title: 'Ready to scale your production?', desc: 'Join the next generation of high-performance engineering teams with DevOps Hub.', btn: 'Launch Workspace Now' },
          footer: {
            rights: '© 2026 DevOps Hub. Advanced Engineering Platform.',
            desc: 'Empowering the next generation of full-stack engineering teams with distributed build infrastructure.',
            cols: {
              product: 'Product',
              resources: 'Resources',
              company: 'Company'
            },
            links: {
              features: 'Features',
              solutions: 'Solutions',
              runners: 'Runners',
              security: 'Security',
              docs: 'Docs',
              api: 'API',
              community: 'Community',
              status: 'Status',
              about: 'About',
              blog: 'Blog',
              careers: 'Careers',
              legal: 'Legal'
            }
          }
        }
      },
      zh: {
        translation: {
          nav: { solutions: '解决方案', features: '核心能力', resources: '资源中心', dashboard: '管理控制台', theme: '界面定制', stack: '技术栈', business: '商业计划' },
          hero: { 
            title: 'DevOps Hub Studio', 
            desc: 'DevOps Hub Studio 是专为 Unity、Unreal、Web、移动端及后端微服务打造的新一代企业级研发效能平台，通过高性能构建编排与智能遥测技术，使分布式团队实现高频迭代下的高效协同与质量内建。', 
            cta: '初始化工作区', 
            demo: '架构设计指南', 
            badge: '企业版 v1.2.0 - 多技术栈支持已开启' 
          },
          trusted: '为行业领袖提供动力',
          modules: {
            title: '集成系统模块',
            cicd: { title: '高性能 CI/CD', desc: '具备热缓存加速的分布式运行器集群，实现闪电般的构建周期。' },
            telemetry: { title: '智能可观测性', desc: '由模式识别引擎驱动的实时遥测流与日志深度分析。' },
            artifacts: { title: '构建产物管理', desc: '针对版本化构建包与容器镜像的全球分发网络。' },
            architect: { title: 'AI 脚本枢纽', desc: '利用大语言模型驱动的配置蓝图实现自动化流水线生成。' },
            security: { title: '安全签名与凭证', desc: '自动化的代码签名、证书管理以及敏感凭据的安全存储。' },
            distribution: { title: '持续交付与分发', desc: '面向应用商店、CDN 及私有仓库的多渠道自动化发布。' },
            learnMore: '了解更多'
          },
          stack: {
            title: '全栈技术兼容',
            desc: '旨在编排全球最苛刻的开发生态系统，从高保真 3D 引擎到全球分布式微服务。'
          },
          preview: {
            title: '超越传统的流水线体验',
            desc1: '将智能可观测性、分布式节点池和自动化产物分发统一到一个无缝的生命周期中。',
            feature1: '自动化的配置漂移审计',
            feature2: '企业级安全签名与认证',
            feature3: 'P95 延迟优化与缓存对齐'
          },
          solutions: {
            title: '企业级解决方案',
            cicd: { 
              title: '通用构建集群', 
              desc: '针对跨平台交付优化的分布式流水线。从单一事实源编排 Unity、Unreal 及 Web 目标构建。',
              cta: '执行流水线',
              building: '构建中...',
              success: '构建完成',
              error: '构建失败',
              logs: [
                '正在初始化多栈构建集群...',
                '正在检测架构类型 (Unity/Web/移动端)...',
                '正在编排分布式运行器节点...',
                '正在执行依赖项对齐...',
                '正在同步产物至全球 CDN...'
              ]
            },
            infra: { 
              title: '基础设施即代码', 
              desc: '具备内置安全护栏与资源优化的声明式环境部署。',
              cta: '部署基础设施',
              building: '部署中...',
              success: '基础设施就绪',
              error: '部署失败',
              logs: [
                '正在解析 IaC 清单 (Terraform/Pulumi)...',
                '正在验证安全组策略...',
                '正在部署高可用集群...',
                '健康检查：节点 01-24 在线'
              ]
            },
            enterprise: { 
              title: '安全编排管理', 
              desc: '针对复杂的多用户企业环境，提供策略驱动的工作流管理。',
              cta: '运行审计',
              building: '编排中...',
              success: '编排完成',
              error: '编排失败',
              logs: [
                '正在加载编排清单...',
                '正在执行合规性防护...',
                '正在映射跨平台依赖项...',
                '报告已同步至控制面板。'
              ]
            }
          },
          features: {
            title: '平台核心能力',
            orchestration: { title: '流水线拓扑', desc: '可视化并管理复杂的跨栈构建依赖关系。' },
            governance: { title: '安全与认证', desc: '企业级 SSO、RBAC 以及自动化密钥管理。' },
            platform: { title: '多架构扩展', desc: '针对 x64、ARM64 及 Web 目标的统一构建发布周期。' },
            analytics: { title: '资源效能', desc: '优化节点利用率并减少流水线配置漂移。' },
            cloud: { title: '混合云运维', desc: '在本地服务器与多云节点之间实现无缝编排。' },
            storage: { title: '全球数据中心', desc: '具备自动化版本控制的低延迟构建产物存储。' }
          },
          insights: {
            title: '实时流水线洞察',
            throughput: '构建速率',
            health: '集群完整度',
            resource: '节点利用率',
            efficiency: '缓存命中率',
            live: '实时控制台动态',
            metrics: {
              active: '活跃运行器',
              activeDetail: '系统活跃',
              queued: '排队工作流',
              queuedDetail: '零等待状态',
              avgTime: '交付周期',
              avgTimeDetail: '效率提升 18%',
              success: '系统完整率',
              successDetail: '符合 SLA 标准'
            }
          },
          resources: {
            title: '知识与支持',
            docs: { title: '工程文档', desc: '多技术栈集成的全面指南。' },
            community: { title: '全球社区', desc: '与顶尖的 DevOps 和平台工程师交流。' },
            api: { title: '系统 API', desc: '深度编排钩子的技术参考文档。' }
          },
          analytics: { title: '运维效能', desc: '以毫秒级精度监控系统健康度与交付性能。', label: '构建吞吐量 (次/小时)' },
          cta: { title: '准备好扩展您的生产规模了吗？', desc: '加入下一代高性能工程团队，使用 DevOps Hub 开启新篇章。', btn: '立即启动工作区' },
          footer: {
            rights: '© 2026 DevOps Hub。先进工程平台。',
            desc: '通过分布式构建基础设施，为下一代全栈工程团队赋能。',
            cols: {
              product: '产品',
              resources: '资源',
              company: '公司'
            },
            links: {
              features: '功能特性',
              solutions: '解决方案',
              runners: '运行器',
              security: '安全',
              docs: '文档',
              api: 'API',
              community: '社区',
              status: '状态',
              about: '关于我们',
              blog: '博客',
              careers: '招聘',
              legal: '法律'
            }
          }
        }
      }
    }
  });

export default i18n;
