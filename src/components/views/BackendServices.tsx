import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import RemoteShell from "../RemoteShell";
import NotificationSettings from "../NotificationSettings";
import BuildSandbox from "../BuildSandbox";
import { 
  Database,
  Server,
  Cloud,
  Box,
  Key,
  Shield,
  Activity,
  Plus,
  Play,
  Square,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal as TerminalIcon,
  X,
  Search,
  Settings2,
  Cpu,
  FileCode,
  Download,
  Settings,
  Layers,
  Sparkles,
  Code,
  RefreshCw,
  Eye,
  Check,
  Radio
} from "lucide-react";
import { useLanguage } from "../../LanguageContext";
import { useWorkspace } from "../../WorkspaceContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../ToastContext";

interface ServiceInstance {
  id: string;
  name: string;
  type: string;
  category: "database" | "cache" | "queue" | "storage" | "auth" | "compute" | "observability";
  status: "running" | "stopped" | "error" | "provisioning";
  url?: string;
  port?: number;
  cpu: number;
  memory: string;
  showCredentials?: boolean;
}

const DEFAULT_SERVICES: ServiceInstance[] = [
  {
    id: "svc-pg-01",
    name: "Primary PostgreSQL",
    type: "PostgreSQL 15",
    category: "database",
    status: "running",
    port: 5432,
    cpu: 12,
    memory: "4.2 GB"
  },
  {
    id: "svc-redis-01",
    name: "Cache Cluster",
    type: "Redis 7",
    category: "cache",
    status: "running",
    port: 6379,
    cpu: 4,
    memory: "1.8 GB"
  },
  {
    id: "svc-mongo-01",
    name: "Document Store",
    type: "MongoDB 6.0",
    category: "database",
    status: "running",
    port: 27017,
    cpu: 8,
    memory: "2.5 GB"
  },
  {
    id: "svc-elastic-01",
    name: "Search Engine",
    type: "Elasticsearch 8",
    category: "database",
    status: "running",
    port: 9200,
    cpu: 15,
    memory: "6.0 GB"
  },
  {
    id: "svc-kafka-01",
    name: "Event Stream",
    type: "Apache Kafka",
    category: "queue",
    status: "running",
    port: 9092,
    cpu: 22,
    memory: "3.2 GB"
  },
  {
    id: "svc-mq-01",
    name: "Message Queue",
    type: "RabbitMQ",
    category: "queue",
    status: "provisioning",
    port: 5672,
    cpu: 0,
    memory: "0 MB"
  },
  {
    id: "svc-minio-01",
    name: "Object Storage",
    type: "MinIO (S3 API)",
    category: "storage",
    status: "running",
    port: 9000,
    cpu: 3,
    memory: "1.2 GB"
  },
  {
    id: "svc-auth-01",
    name: "Identity Provider",
    type: "Keycloak",
    category: "auth",
    status: "running",
    port: 8080,
    cpu: 5,
    memory: "1.5 GB"
  },
  {
    id: "svc-grpc-01",
    name: "Core Processing",
    type: "Go gRPC Service",
    category: "compute",
    status: "running",
    port: 50051,
    url: "grpc://core.internal.dev",
    cpu: 18,
    memory: "450 MB"
  },
  {
    id: "svc-api-01",
    name: "GraphQL Gateway",
    type: "Node.js (Express)",
    category: "compute",
    status: "running",
    port: 4000,
    url: "https://api.internal.dev",
    cpu: 45,
    memory: "850 MB"
  },
  {
    id: "svc-prom-01",
    name: "Metrics Server",
    type: "Prometheus",
    category: "observability",
    status: "running",
    port: 9090,
    cpu: 10,
    memory: "2.1 GB"
  },
  {
    id: "svc-grafana-01",
    name: "Dashboards",
    type: "Grafana",
    category: "observability",
    status: "running",
    port: 3000,
    url: "https://grafana.internal.dev",
    cpu: 2,
    memory: "300 MB"
  }
];

const SERVICE_CATALOG = [
  { name: "PostgreSQL", type: "PostgreSQL 16", category: "database", port: 5432, descEn: "Relational database", descZh: "关系型数据库" },
  { name: "MySQL", type: "MySQL 8.0", category: "database", port: 3306, descEn: "Relational database", descZh: "关系型数据库" },
  { name: "MongoDB", type: "MongoDB 7.0", category: "database", port: 27017, descEn: "NoSQL Document store", descZh: "NoSQL文档数据库" },
  { name: "Redis", type: "Redis 7.2", category: "cache", port: 6379, descEn: "In-memory data store", descZh: "内存数据存储" },
  { name: "Memcached", type: "Memcached 1.6", category: "cache", port: 11211, descEn: "In-memory key-value store", descZh: "内存键值缓存" },
  { name: "RabbitMQ", type: "RabbitMQ 3.12", category: "queue", port: 5672, descEn: "Message broker", descZh: "消息队列" },
  { name: "Kafka", type: "Apache Kafka", category: "queue", port: 9092, descEn: "Event streaming platform", descZh: "事件流平台" },
  { name: "MinIO", type: "MinIO (S3 API)", category: "storage", port: 9000, descEn: "S3 compatible storage", descZh: "S3兼容对象存储" },
  { name: "Node.js API", type: "Node.js (Express)", category: "compute", port: 4000, descEn: "JavaScript runtime", descZh: "JS 运行时" },
  { name: "Python API", type: "Python (FastAPI)", category: "compute", port: 8000, descEn: "Python runtime", descZh: "Python 运行时" },
  { name: "Go Service", type: "Go (Gin)", category: "compute", port: 8080, descEn: "Go runtime", descZh: "Go 运行时" },
  { name: "C++ Backend Server", type: "C++ (Drogon / Crow / gRPC)", category: "compute", port: 9000, descEn: "Ultra-low latency native C++ backend service", descZh: "极低延迟 C++ 高性能后端微服务 / gRPC 服务器" }
];

const CPP_TEMPLATES = [
  {
    id: "cmake",
    name: "CMakeLists.txt",
    language: "cmake",
    titleEn: "CMake Build Configuration",
    titleZh: "CMake 构建配置",
    descEn: "Standard CMake build with optimizations for high-performance execution.",
    descZh: "针对高性能原生执行进行了专门优化的标准 CMakeLists 编译配置文件。",
    code: `cmake_minimum_required(VERSION 3.20)
project(DevOpsHubCppBackend VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# High performance release optimization flags
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -march=native -flto -DNDEBUG")

# Find dependencies
find_package(gRPC REQUIRED)
find_package(protobuf REQUIRED)
find_package(GTest REQUIRED)

# Include directories
include_directories(\${CMAKE_CURRENT_SOURCE_DIR}/include)

# Executable target definition
add_executable(devopshub_backend 
    src/main.cpp 
    src/server.cpp
)
target_link_libraries(devopshub_backend 
    gRPC::grpc++ 
    protobuf::libprotobuf
)

# Test target config
enable_testing()
add_executable(devopshub_tests 
    tests/test_main.cpp 
    tests/service_tests.cpp
)
target_link_libraries(devopshub_tests 
    GTest::gtest 
    GTest::gtest_main
)
add_test(NAME DevOpsHubBackendTests COMMAND devopshub_tests)`
  },
  {
    id: "gtest",
    name: "service_tests.cpp",
    language: "cpp",
    titleEn: "Google Test Unit Testing Suite",
    titleZh: "GTest 单元测试套件",
    descEn: "Unit testing for microsecond latency thresholds and handshake validation.",
    descZh: "用于验证微秒级低延迟响应阈值和客户端握手通信逻辑的单元测试脚本。",
    code: `#include <gtest/gtest.h>
#include "devopshub/server.h"
#include <chrono>

// Test suite for Matchmaking system latency
TEST(MatchmakingLatencyTest, HandshakeAcknowledgeLatency) {
    DevOpsHub::Server server;
    server.Initialize(9000);
    
    auto startTime = std::chrono::high_resolution_clock::now();
    bool ack = server.SimulateClientHandshake("client_node_uuid");
    auto endTime = std::chrono::high_resolution_clock::now();
    
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime).count();
    
    EXPECT_TRUE(ack);
    // Latency must be sub-500 microseconds (0.5ms) for competitive tick rates
    EXPECT_LT(duration, 500); 
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}`
  },
  {
    id: "dockerfile",
    name: "Dockerfile.alpine",
    language: "dockerfile",
    titleEn: "Optimized Alpine Dockerfile",
    titleZh: "Alpine 极致体积优化 Dockerfile",
    descEn: "Multi-stage Dockerfile that builds on Alpine and runs in a hardened lightweight runtime (~12MB).",
    descZh: "多阶段构建 Dockerfile，在 Alpine 环境下编译，并运行于加固的超轻量化运行时容器（仅 12MB）。",
    code: `# --- Stage 1: Build C++ Backend Server ---
FROM alpine:3.19 AS builder

RUN apk update && apk add --no-cache \\
    build-base \\
    cmake \\
    git \\
    protobuf-dev \\
    grpc-dev \\
    gtest-dev \\
    libtool

WORKDIR /app
COPY . .

RUN mkdir build && cd build && \\
    cmake -DCMAKE_BUILD_TYPE=Release .. && \\
    make -j\$(nproc)

# --- Stage 2: Optimized Alpine Runtime ---
FROM alpine:3.19

RUN apk update && apk add --no-cache \\
    libstdc++ \\
    libgcc \\
    grpc \\
    protobuf \\
    ca-certificates

WORKDIR /root/
COPY --from=builder /app/build/devops_hub_backend .

EXPOSE 9000

# Secure posture: non-root execution
RUN adduser -D runneruser
USER runneruser

ENTRYPOINT ["./devops_hub_backend"]`
  }
];

const SPRING_BOOT_TEMPLATES = [
  {
    id: "bootstrap",
    name: "bootstrap.yml",
    language: "yaml",
    titleEn: "Eureka Client Bootstrap Config",
    titleZh: "Eureka 客户端引导配置",
    descEn: "Bootstrap settings for Eureka registration, configuration fail-fast, and service name registration.",
    descZh: "引导级配置文件，用于 Eureka 注册中心定位、配置中心快速失败以及微服务名称初始化。",
    code: `spring:
  application:
    name: game-gateway-service
  cloud:
    config:
      uri: http://config-server.internal.dev:8888
      fail-fast: true

eureka:
  client:
    service-url:
      defaultZone: http://eureka-primary.internal.dev:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 5
    lease-expiration-duration-in-seconds: 10`
  },
  {
    id: "application",
    name: "application.properties",
    language: "properties",
    titleEn: "Database & Redis Connection Config",
    titleZh: "数据库与 Redis 缓存连接配置",
    descEn: "HikariCP database pool limits and connection settings with Prometheus endpoints.",
    descZh: "微服务底层持久化数据库连接池（HikariCP）和分布式 Redis 缓存连接及 Actuator 监控端点配置。",
    code: `server.port=8080
spring.application.name=player-profile-service

# Database Connection Pool (HikariCP)
spring.datasource.url=jdbc:postgresql://svc-pg-game:5432/game_db
spring.datasource.username=postgres
spring.datasource.password=secret
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000

# Distributed Redis Configuration
spring.redis.host=svc-redis-game
spring.redis.port=6379

# Production Metrics & Monitoring exposing Prometheus format
management.endpoints.web.exposure.include=health,info,prometheus
management.endpoint.health.show-details=always`
  },
  {
    id: "kubernetes",
    name: "k8s-deployment.yaml",
    language: "yaml",
    titleEn: "Kubernetes Microservice Deployment",
    titleZh: "Kubernetes 微服务发布编排 YAML",
    descEn: "Kubernetes deployment YAML with dynamic Eureka environment variables and Actuator liveness/readiness probes.",
    descZh: "K8s 微服务发布 YAML，包含动态 Eureka 注入、资源规格配额限制以及 Actuator 原生健康探针。",
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: player-profile-deployment
  namespace: devops-hub-backend
  labels:
    app: player-profile-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: player-profile-service
  template:
    metadata:
      labels:
        app: player-profile-service
    spec:
      containers:
      - name: player-profile
        image: devops-hub/player-profile-service:latest
        ports:
        - containerPort: 8080
        env:
        - name: EUREKA_CLIENT_SERVICEURL_DEFAULTZONE
          value: "http://eureka-service.devops-hub-backend.svc.cluster.local:8761/eureka/"
        resources:
          limits:
            cpu: "1"
            memory: "1512Mi"
          requests:
            cpu: "500m"
            memory: "768Mi"
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 20`
  }
];

export default function BackendServices() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const { activeWorkspace } = useWorkspace();
  const { addToast } = useToast();
  const isZh = language === "zh";

  const [activeTab, setActiveTab] = useState<"dashboard" | "db-persistent" | "sse-realtime" | "auth-rbac" | "vault-secrets" | "distributed-runners" | "cpp-infra" | "spring-boot">("dashboard");

  // --- Enterprise Backend States ---
  // 1. DB Persistent State
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dbTables, setDbTables] = useState<any[]>([]);
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT * FROM builds ORDER BY created_at DESC;");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecutingSql, setIsExecutingSql] = useState<boolean>(false);

  // 2. Realtime SSE State
  const [sseConnected, setSseConnected] = useState<boolean>(false);
  const [sseEvents, setSseEvents] = useState<any[]>([]);
  const [broadcastMsg, setBroadcastMsg] = useState<string>("");

  // 3. Auth & RBAC State
  const [rbacUsers, setRbacUsers] = useState<any[]>([]);
  const [rbacMatrix, setRbacMatrix] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("developer");

  // 4. Vault & Secrets State
  const [vaultSecrets, setVaultSecrets] = useState<any[]>([]);
  const [newSecretName, setNewSecretName] = useState<string>("");
  const [newSecretVal, setNewSecretVal] = useState<string>("");
  const [newSecretEnv, setNewSecretEnv] = useState<string>("production");

  // 5. Distributed Runner Fleet Agent State
  const [runnerAgents, setRunnerAgents] = useState<any[]>([]);
  const [newAgentHost, setNewAgentHost] = useState<string>("");
  const [newAgentOs, setNewAgentOs] = useState<string>("macOS Sonoma 14 (M2 Pro)");

  // Load Enterprise Backend Data
  const fetchDbInfo = async () => {
    try {
      const res = await fetch("/api/db/status");
      const data = await res.json();
      setDbStatus(data);

      const tablesRes = await fetch("/api/db/tables");
      const tablesData = await tablesRes.json();
      setDbTables(tablesData.tables || []);
    } catch (e) {
      console.error("DB info fetch error:", e);
    }
  };

  const handleRunSql = async () => {
    if (!sqlQuery.trim()) return;
    setIsExecutingSql(true);
    try {
      const res = await fetch("/api/db/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: sqlQuery })
      });
      const data = await res.json();
      setQueryResult(data);
      if (data.success) {
        addToast(isZh ? `SQL 查询成功执行 (${data.executionTimeMs}ms)` : `SQL query executed in ${data.executionTimeMs}ms`, "success");
      } else {
        addToast(isZh ? `SQL 执行错误: ${data.error}` : `SQL error: ${data.error}`, "error");
      }
    } catch (err: any) {
      addToast(`SQL query error: ${err.message}`, "error");
    } finally {
      setIsExecutingSql(false);
    }
  };

  const handleRunMigration = async () => {
    try {
      const res = await fetch("/api/db/migrations/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      addToast(data.message, "success");
      fetchDbInfo();
    } catch (e: any) {
      addToast(`Migration failed: ${e.message}`, "error");
    }
  };

  // SSE Stream Effect
  useEffect(() => {
    if (activeTab === "sse-realtime") {
      const eventSource = new EventSource("/api/sse/stream");
      eventSource.onopen = () => setSseConnected(true);
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setSseEvents(prev => [parsed, ...prev.slice(0, 49)]);
        } catch (err) {
          console.error("SSE parse error", err);
        }
      };
      eventSource.onerror = () => setSseConnected(false);
      return () => {
        eventSource.close();
        setSseConnected(false);
      };
    }
  }, [activeTab]);

  const handleBroadcastSse = async () => {
    if (!broadcastMsg.trim()) return;
    try {
      await fetch("/api/sse/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "OPERATOR_BROADCAST", message: broadcastMsg })
      });
      addToast(isZh ? "已通过 SSE 广播实时推送" : "Broadcasted via SSE live stream", "success");
      setBroadcastMsg("");
    } catch (e: any) {
      addToast(`Broadcast error: ${e.message}`, "error");
    }
  };

  // Auth & RBAC Load
  const fetchRbacInfo = async () => {
    try {
      const res = await fetch("/api/auth/users");
      const data = await res.json();
      setRbacUsers(data.users || []);
      setRbacMatrix(data.rbacMatrix || []);
    } catch (err) {
      console.error("RBAC fetch error:", err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole })
      });
      const data = await res.json();
      addToast(data.message, "success");
      setNewEmail("");
      fetchRbacInfo();
    } catch (err: any) {
      addToast(`Add user error: ${err.message}`, "error");
    }
  };

  // Vault Load
  const fetchVaultInfo = async () => {
    try {
      const res = await fetch("/api/vault/secrets");
      const data = await res.json();
      setVaultSecrets(data.secrets || []);
    } catch (e) {
      console.error("Vault fetch error", e);
    }
  };

  const handleCreateSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecretName.trim() || !newSecretVal.trim()) return;
    try {
      const res = await fetch("/api/vault/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSecretName, value: newSecretVal, environment: newSecretEnv })
      });
      const data = await res.json();
      addToast(data.message, "success");
      setNewSecretName("");
      setNewSecretVal("");
      fetchVaultInfo();
    } catch (err: any) {
      addToast(`Create secret error: ${err.message}`, "error");
    }
  };

  const handleRotateVault = async () => {
    try {
      const res = await fetch("/api/vault/rotate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      addToast(data.message, "success");
      fetchVaultInfo();
    } catch (e: any) {
      addToast(`Rotate error: ${e.message}`, "error");
    }
  };

  // Runners Fleet Agent Load
  const fetchRunnerAgents = async () => {
    try {
      const res = await fetch("/api/runners/status");
      const data = await res.json();
      setRunnerAgents(data.runners || []);
    } catch (e) {
      console.error("Runner fetch error", e);
    }
  };

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentHost.trim()) return;
    try {
      const res = await fetch("/api/runners/agent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostname: newAgentHost, os: newAgentOs, tags: ["unity", "unreal", "bare-metal"] })
      });
      const data = await res.json();
      addToast(data.message, "success");
      setNewAgentHost("");
      fetchRunnerAgents();
    } catch (err: any) {
      addToast(`Register agent error: ${err.message}`, "error");
    }
  };

  useEffect(() => {
    if (activeTab === "db-persistent") fetchDbInfo();
    if (activeTab === "auth-rbac") fetchRbacInfo();
    if (activeTab === "vault-secrets") fetchVaultInfo();
    if (activeTab === "distributed-runners") fetchRunnerAgents();
  }, [activeTab]);
  const [selectedCppTemplate, setSelectedCppTemplate] = useState(CPP_TEMPLATES[0]);
  const [selectedSpringTemplateId, setSelectedSpringTemplateId] = useState("bootstrap");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic Configuration Settings for Spring Boot
  const [springProfile, setSpringProfile] = useState<"dev" | "test" | "prod">("prod");
  const [springLogLevel, setSpringLogLevel] = useState<"INFO" | "DEBUG" | "WARN" | "ERROR">("INFO");
  const [springHeapLimit, setSpringHeapLimit] = useState("1024m");
  const [enablePrometheus, setEnablePrometheus] = useState(true);
  const [springEurekaEnabled, setSpringEurekaEnabled] = useState(true);
  
  // Dynamic Kubernetes Settings
  const [k8sReplicas, setK8sReplicas] = useState(3);
  const [k8sCpuLimit, setK8sCpuLimit] = useState("1");
  const [k8sMemLimit, setK8sMemLimit] = useState("1512Mi");

  // Eureka registry live state
  const [eurekaInstances, setEurekaInstances] = useState([
    { name: "GAME-GATEWAY-SERVICE", status: "UP", ip: "10.244.1.42:8080", memory: "1.2 GB", cpu: "12%", type: "Gateway" },
    { name: "PLAYER-PROFILE-SERVICE", status: "UP", ip: "10.244.2.11:8080", memory: "2.1 GB", cpu: "45%", type: "Data Service" },
    { name: "MATCHMAKING-ENGINE", status: "UP", ip: "10.244.1.98:9091", memory: "1.8 GB", cpu: "28%", type: "Core Logic" },
    { name: "TRANSACTION-SERVER", status: "UP", ip: "10.244.3.56:8082", memory: "980 MB", cpu: "8%", type: "Finance" },
  ]);

  // Form states for adding service to Eureka
  const [isAddingEureka, setIsAddingEureka] = useState(false);
  const [newSvcName, setNewSvcName] = useState("");
  const [newSvcType, setNewSvcType] = useState("Microservice");
  const [newSvcPort, setNewSvcPort] = useState(8080);

  const dynamicSpringTemplates = useMemo(() => {
    return [
      {
        id: "bootstrap",
        name: "bootstrap.yml",
        language: "yaml",
        titleEn: "Eureka Client Bootstrap Config",
        titleZh: "Eureka 客户端引导配置",
        descEn: "Bootstrap settings for Eureka registration, configuration fail-fast, and service name registration.",
        descZh: "引导级配置文件，用于 Eureka 注册中心定位、配置中心快速失败以及微服务名称初始化。",
        code: `spring:
  application:
    name: game-gateway-service
  profiles:
    active: ${springProfile}
  cloud:
    config:
      uri: http://config-server.internal.dev:8888
      fail-fast: true

eureka:
  client:
    service-url:
      defaultZone: http://eureka-primary.internal.dev:8761/eureka/
    register-with-eureka: ${springEurekaEnabled}
    fetch-registry: ${springEurekaEnabled}
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 5
    lease-expiration-duration-in-seconds: 10`
      },
      {
        id: "application",
        name: "application.properties",
        language: "properties",
        titleEn: "Database & Redis Connection Config",
        titleZh: "数据库与 Redis 缓存连接配置",
        descEn: "HikariCP database pool limits and connection settings with Prometheus endpoints.",
        descZh: "微服务底层持久化数据库连接池（HikariCP）和分布式 Redis 缓存连接及 Actuator 监控端点配置。",
        code: `server.port=8080
spring.application.name=player-profile-service

# JVM Memory Settings
java.jvm.args=-Xmx${springHeapLimit} -Xms512m -XX:+UseG1GC

# Logging Level
logging.level.root=${springLogLevel}
logging.level.org.springframework.web=${springLogLevel === "DEBUG" ? "DEBUG" : "INFO"}

# Database Connection Pool (HikariCP)
spring.datasource.url=jdbc:postgresql://svc-pg-game:5432/game_db
spring.datasource.username=postgres
spring.datasource.password=secret
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000

# Distributed Redis Configuration
spring.redis.host=svc-redis-game
spring.redis.port=6379

# Production Metrics & Monitoring exposing Prometheus format
management.endpoints.web.exposure.include=health,info${enablePrometheus ? ",prometheus" : ""}
management.endpoint.health.show-details=always`
      },
      {
        id: "kubernetes",
        name: "k8s-deployment.yaml",
        language: "yaml",
        titleEn: "Kubernetes Microservice Deployment",
        titleZh: "Kubernetes 微服务发布编排 YAML",
        descEn: "Kubernetes deployment YAML with dynamic Eureka environment variables and Actuator liveness/readiness probes.",
        descZh: "K8s 微服务发布 YAML，包含动态 Eureka 注入、资源规格配额限制以及 Actuator 原生健康探针。",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: player-profile-deployment
  namespace: devops-hub-backend
  labels:
    app: player-profile-service
spec:
  replicas: ${k8sReplicas}
  selector:
    matchLabels:
      app: player-profile-service
  template:
    metadata:
      labels:
        app: player-profile-service
    spec:
      containers:
      - name: player-profile
        image: devops-hub/player-profile-service:latest
        ports:
        - containerPort: 8080
        env:
        - name: EUREKA_CLIENT_SERVICEURL_DEFAULTZONE
          value: "http://eureka-service.devops-hub-backend.svc.cluster.local:8761/eureka/"
        - name: SPRING_PROFILES_ACTIVE
          value: "${springProfile}"
        resources:
          limits:
            cpu: "${k8sCpuLimit}"
            memory: "${k8sMemLimit}"
          requests:
            cpu: "${parseFloat(k8sCpuLimit) * 0.5}"
            memory: "512Mi"
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 20`
      }
    ];
  }, [springProfile, springLogLevel, springHeapLimit, enablePrometheus, springEurekaEnabled, k8sReplicas, k8sCpuLimit, k8sMemLimit]);

  const activeSpringTemplate = useMemo(() => {
    return dynamicSpringTemplates.find(t => t.id === selectedSpringTemplateId) || dynamicSpringTemplates[0];
  }, [dynamicSpringTemplates, selectedSpringTemplateId]);
  
  const selectedSpringTemplate = activeSpringTemplate;

  const handleRegisterEurekaSvc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcName.trim()) {
      addToast(isZh ? "请输入微服务名称" : "Please enter service name", "error");
      return;
    }

    const cleanName = newSvcName.trim().toUpperCase().replace(/\s+/g, '-');
    const randomIpSuffix = Math.floor(Math.random() * 254) + 1;
    const newSvc = {
      name: cleanName,
      status: "UP",
      ip: `10.244.${Math.floor(Math.random() * 4) + 1}.${randomIpSuffix}:${newSvcPort}`,
      memory: "1.1 GB",
      cpu: "15%",
      type: newSvcType
    };

    setEurekaInstances(prev => [...prev, newSvc]);
    setIsAddingEureka(false);
    setNewSvcName("");
    setNewSvcPort(8080);
    addToast(
      isZh 
        ? `服务 [${cleanName}] 已成功注册到 Eureka 发现集群` 
        : `Service [${cleanName}] successfully registered with Eureka registry`,
      "success"
    );
  };

  const toggleEurekaSvcStatus = (name: string) => {
    setEurekaInstances(prev => prev.map(inst => {
      if (inst.name === name) {
        const nextStatus = inst.status === "UP" ? "DOWN" : "UP";
        addToast(
          isZh 
            ? `服务 [${name}] 状态更改为 [${nextStatus}]` 
            : `Service [${name}] status changed to [${nextStatus}]`,
          nextStatus === "UP" ? "success" : "error"
        );
        return { ...inst, status: nextStatus };
      }
      return inst;
    }));
  };

  const deleteEurekaInstance = (name: string) => {
    setEurekaInstances(prev => prev.filter(inst => inst.name !== name));
    addToast(
      isZh 
        ? `服务 [${name}] 已从 Eureka 注册中心注销` 
        : `Service [${name}] deregistered from Eureka Registry`,
      "warning"
    );
  };

  const handleCopyTemplate = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    addToast(isZh ? "模板内容已复制到剪贴板" : "Template copied to clipboard", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTemplate = (filename: string, code: string) => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    addToast(isZh ? `已下载文件: ${filename}` : `Downloaded file: ${filename}`, "success");
  };

  const [services, setServices] = useState<ServiceInstance[]>(DEFAULT_SERVICES);
  
  // Modals state
  const [showCatalog, setShowCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const [showLogs, setShowLogs] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeWorkspace) return;
    
    const type = activeWorkspace.projectType;
    let wsServices: ServiceInstance[] = [];
    
    if (type === "unity" || type === "unreal") {
      wsServices = [
        {
          id: "svc-pg-game",
          name: "Game State Database",
          type: "PostgreSQL 15 (Timescale)",
          category: "database",
          status: "running",
          port: 5432,
          cpu: 8,
          memory: "1.2 GB"
        },
        {
          id: "svc-redis-game",
          name: "Matchmaking & Lobby Cache",
          type: "Redis 7.2 Cluster",
          category: "cache",
          status: "running",
          port: 6379,
          cpu: 14,
          memory: "512 MB"
        },
        {
          id: "svc-minio-game",
          name: "S3 Asset Bundle Server",
          type: "MinIO (Object Storage)",
          category: "storage",
          status: "running",
          port: 9000,
          cpu: 3,
          memory: "4.5 GB"
        },
        {
          id: "svc-grpc-game",
          name: "Dedicated Server Controller",
          type: "Go gRPC Service",
          category: "compute",
          status: "running",
          port: 50051,
          url: "grpc://game-controller.internal.dev",
          cpu: 25,
          memory: "1.8 GB"
        }
      ];
    } else if (type === "mobile") {
      wsServices = [
        {
          id: "svc-sup-mobile",
          name: "App Sync Data (Supabase)",
          type: "PostgreSQL 15 (Supabase)",
          category: "database",
          status: "running",
          port: 5432,
          cpu: 4,
          memory: "750 MB"
        },
        {
          id: "svc-mq-mobile",
          name: "FCM Push Notification Broker",
          type: "RabbitMQ Broker",
          category: "queue",
          status: "running",
          port: 5672,
          cpu: 2,
          memory: "128 MB"
        },
        {
          id: "svc-auth-mobile",
          name: "JWT Identity Keycloak Provider",
          type: "Keycloak Identity",
          category: "auth",
          status: "running",
          port: 8080,
          cpu: 6,
          memory: "1.1 GB"
        }
      ];
    } else if (type === "web") {
      wsServices = [
        {
          id: "svc-pg-web",
          name: "Web Platform PostgreSQL",
          type: "PostgreSQL 16",
          category: "database",
          status: "running",
          port: 5432,
          cpu: 5,
          memory: "850 MB"
        },
        {
          id: "svc-redis-web",
          name: "Distributed Session Cache",
          type: "Redis 7.2",
          category: "cache",
          status: "running",
          port: 6379,
          cpu: 2,
          memory: "256 MB"
        },
        {
          id: "svc-api-web",
          name: "GraphQL Federation Gateway",
          type: "Node.js (Express)",
          category: "compute",
          status: "running",
          port: 4000,
          url: "https://web-api.internal.dev",
          cpu: 18,
          memory: "512 MB"
        }
      ];
    } else {
      // Fullstack or backend
      wsServices = DEFAULT_SERVICES;
    }
    
    setServices(wsServices);
  }, [activeWorkspace?.id]);

  const isFullstack = true; // Enabled for all workspace types now with dynamic adaptation!

  // Simulate logs
  useEffect(() => {
    if (showLogs) {
      const targetSvc = services.find(s => s.id === showLogs);
      const isCpp = targetSvc?.type.includes('C++');

      setLogs([
        `[SYSTEM] Connecting to container for ${showLogs}...`,
        `[SYSTEM] Container attached. Tailing logs...`,
        `[INFO] Starting high-performance service up...`,
        isCpp 
          ? `[INFO] Initializing C++ native environment (GCC 13.2, C++20 standard)` 
          : `[INFO] Listening on interfaces`,
        isCpp ? `[INFO] Thread-affinity: pinning CPU cores to maximize cache locality...` : ``,
      ].filter(Boolean));
      
      const interval = setInterval(() => {
        const time = new Date().toISOString().split('T')[1].split('.')[0];
        const normalLogs = [
          `[${time}] [INFO] Health check passed`,
          `[${time}] [DEBUG] Client connected`,
          `[${time}] [DEBUG] Executed query in 4ms`,
          `[${time}] [INFO] Garbage collection completed`,
          `[${time}] [WARN] Memory usage slightly high`
        ];
        const cppLogs = [
          `[${time}] [INFO] epoll_wait dispatch loop: processed 2,408 events (0ms latency)`,
          `[${time}] [INFO] Zero-copy memory buffer packet chunk dispatched to socket client`,
          `[${time}] [DEBUG] gRPC native channel active. Thread pool worker count: 32`,
          `[${time}] [INFO] Lock-free atomic ring queue synchronized: 0ns latency drift`,
          `[${time}] [INFO] CPU task pinned to core #4. L1/L2 cache locality: 99.4%`,
          `[${time}] [DEBUG] Drogon asynchronous database connection pool status: 20/20 active`
        ];
        const logLines = isCpp ? cppLogs : normalLogs;
        const randomLog = logLines[Math.floor(Math.random() * logLines.length)];
        setLogs(prev => [...prev.slice(-49), randomLog]); // Keep max 50 lines
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [showLogs, services]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const toggleServiceStatus = (id: string) => {
    setServices(prev => prev.map(svc => {
      if (svc.id === id) {
        if (svc.status === 'running') {
          addToast(isZh ? `已停止服务: ${svc.name}` : `Stopped service: ${svc.name}`, "info");
          return { ...svc, status: 'stopped', cpu: 0, memory: "0 MB" };
        }
        if (svc.status === 'stopped') {
          addToast(isZh ? `正在启动服务: ${svc.name}` : `Starting service: ${svc.name}`, "info");
          
          setTimeout(() => {
            setServices(current => current.map(s => 
              s.id === id ? { ...s, status: 'running', cpu: Math.floor(Math.random() * 20) + 1, memory: `${Math.floor(Math.random() * 900) + 100} MB` } : s
            ));
            addToast(isZh ? `服务已启动: ${svc.name}` : `Service started: ${svc.name}`, "success");
          }, 1500);
          
          return { ...svc, status: 'provisioning' };
        }
      }
      return svc;
    }));
  };

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(svc => {
        if (svc.status === 'running') {
          const cpuDelta = Math.floor((Math.random() - 0.5) * 10);
          const newCpu = Math.min(Math.max(svc.cpu + cpuDelta, 1), 99);
          
          // Parse memory, add/sub small delta
          let memValue = parseFloat(svc.memory);
          const isGB = svc.memory.includes('GB');
          if (isGB) memValue = memValue * 1024;
          
          const memDelta = Math.floor((Math.random() - 0.5) * 50);
          memValue = Math.min(Math.max(memValue + memDelta, 50), 16384);
          
          const newMemory = memValue > 1024 ? `${(memValue / 1024).toFixed(1)} GB` : `${Math.floor(memValue)} MB`;
          
          return { ...svc, cpu: newCpu, memory: newMemory };
        }
        return svc;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const removeService = (id: string) => {
    const svc = services.find(s => s.id === id);
    if (svc) {
      setServices(prev => prev.filter(s => s.id !== id));
      addToast(isZh ? `已移除服务: ${svc.name}` : `Removed service: ${svc.name}`, "info");
      if (showLogs === id) setShowLogs(null);
    }
  };

  const toggleCredentials = (id: string) => {
    setServices(prev => prev.map(svc => {
      if (svc.id === id) return { ...svc, showCredentials: !svc.showCredentials };
      return svc;
    }));
  };

  const getConnectionString = (svc: ServiceInstance) => {
    const host = svc.name.toLowerCase().replace(/\s+/g, '-');
    const port = svc.port || 3306;
    
    if (svc.type.includes('PostgreSQL')) return `postgresql://postgres:secret@${host}:${port}/db`;
    if (svc.type.includes('Redis')) return `redis://:secret@${host}:${port}/0`;
    if (svc.type.includes('Mongo')) return `mongodb://root:secret@${host}:${port}/db?authSource=admin`;
    if (svc.type.includes('Elastic')) return `http://elastic:secret@${host}:${port}`;
    if (svc.type.includes('RabbitMQ')) return `amqp://guest:guest@${host}:${port}/`;
    if (svc.type.includes('Kafka')) return `KAFKA_BROKERS=${host}:${port}`;
    if (svc.type.includes('C++')) return `grpc://${host}:${port} (Native ServerSocket)`;
    return `http://${host}:${port}`;
  };

  const copyCredentials = (svc: ServiceInstance) => {
    const connString = getConnectionString(svc);
    navigator.clipboard.writeText(`CONNECTION_STRING="${connString}"`);
    addToast(isZh ? "凭证已复制到剪贴板" : "Credentials copied to clipboard", "success");
  };

  const deployService = (template: typeof SERVICE_CATALOG[0]) => {
    const newId = `svc-${template.category}-${Date.now()}`;
    
    setServices(prev => [...prev, {
      id: newId,
      name: `${template.name} Instance`,
      type: template.type,
      category: template.category as any,
      status: "provisioning",
      port: template.port,
      cpu: 0,
      memory: "0 MB"
    }]);

    setShowCatalog(false);
    addToast(isZh ? `正在部署: ${template.name}` : `Provisioning: ${template.name}`, "info");

    setTimeout(() => {
      setServices(prev => prev.map(svc => 
        svc.id === newId 
          ? { ...svc, status: "running", cpu: 5, memory: "256 MB" }
          : svc
      ));
      addToast(isZh ? `服务已准备就绪: ${template.name}` : `Service ready: ${template.name}`, "success");
    }, 2500);
  };

  const filteredCatalog = SERVICE_CATALOG.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? "后端服务集成" : "Backend Integrations"}
          </h1>
          <p className={`text-sm mt-1 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {isZh ? "管理和监控微服务、数据库及云原生基础设施" : "Manage and monitor microservices, databases, and cloud-native infrastructure"}
          </p>
        </div>
        {activeTab === "dashboard" && (
          <button 
            onClick={() => setShowCatalog(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors cursor-pointer ${
              mode === 'dark' ? 'bg-accent hover:bg-accent/90' : 'bg-accent hover:bg-accent/90'
            }`}
          >
            <Plus className="w-4 h-4" />
            {isZh ? "部署新服务" : "Deploy Service"}
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap border-b border-gray-800 bg-gray-950/40 rounded-xl p-1 gap-1 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "dashboard" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Server className="h-3.5 w-3.5" />
          <span>{isZh ? "微服务面板" : "Services"}</span>
        </button>

        <button
          onClick={() => setActiveTab("db-persistent")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "db-persistent" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Database className="h-3.5 w-3.5 text-blue-400" />
          <span>{isZh ? "数据库持久化 (SQL)" : "Persistent Storage"}</span>
        </button>

        <button
          onClick={() => setActiveTab("sse-realtime")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "sse-realtime" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>{isZh ? "实时日志 SSE" : "Realtime SSE Push"}</span>
        </button>

        <button
          onClick={() => setActiveTab("auth-rbac")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "auth-rbac" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Shield className="h-3.5 w-3.5 text-violet-400" />
          <span>{isZh ? "Auth & RBAC" : "Auth & RBAC"}</span>
        </button>

        <button
          onClick={() => setActiveTab("vault-secrets")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "vault-secrets" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Key className="h-3.5 w-3.5 text-amber-400" />
          <span>{isZh ? "Vault 密钥证书" : "Vault Secrets"}</span>
        </button>

        <button
          onClick={() => setActiveTab("distributed-runners")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "distributed-runners" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Cpu className="h-3.5 w-3.5 text-sky-400" />
          <span>{isZh ? "物理 Runner 节点" : "Distributed Fleet"}</span>
        </button>

        <button
          onClick={() => setActiveTab("cpp-infra")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "cpp-infra" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Code className="h-3.5 w-3.5" />
          <span>{isZh ? "C++ 基础设施" : "C++ Engine"}</span>
        </button>

        <button
          onClick={() => setActiveTab("spring-boot")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "spring-boot" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{isZh ? "Spring Boot" : "Spring Boot"}</span>
        </button>
      </div>

      {/* Dashboard View */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((svc) => (
            <div key={svc.id} className={`p-5 rounded-2xl border transition-all flex flex-col ${
              mode === 'dark' ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    svc.type.includes('PostgreSQL') ? 'bg-blue-500/10 text-blue-500' :
                    svc.type.includes('Redis') ? 'bg-red-500/10 text-red-500' :
                    svc.type.includes('Node') || svc.type.includes('Python') ? 'bg-green-500/10 text-green-500' :
                    svc.type.includes('Mongo') ? 'bg-emerald-500/10 text-emerald-500' :
                    svc.type.includes('Elastic') ? 'bg-teal-500/10 text-teal-500' :
                    svc.type.includes('Kafka') || svc.type.includes('RabbitMQ') ? 'bg-orange-500/10 text-orange-500' :
                    svc.type.includes('MinIO') ? 'bg-cyan-500/10 text-cyan-500' :
                    svc.type.includes('Keycloak') ? 'bg-violet-500/10 text-violet-500' :
                    svc.type.includes('Go') ? 'bg-sky-500/10 text-sky-500' :
                    svc.type.includes('Prometheus') || svc.type.includes('Grafana') ? 'bg-fuchsia-500/10 text-fuchsia-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {svc.type.includes('PostgreSQL') || svc.type.includes('Redis') || svc.type.includes('Mongo') || svc.type.includes('Elastic') || svc.type.includes('MySQL') || svc.type.includes('Influx') ? <Database className="w-5 h-5" /> :
                     svc.type.includes('Node') || svc.type.includes('Go') || svc.type.includes('Python') ? <Server className="w-5 h-5" /> :
                     svc.type.includes('Kafka') || svc.type.includes('RabbitMQ') ? <Cloud className="w-5 h-5" /> :
                     svc.type.includes('Keycloak') ? <Shield className="w-5 h-5" /> :
                     svc.type.includes('Prometheus') || svc.type.includes('Grafana') ? <Activity className="w-5 h-5" /> :
                     <Box className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {svc.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{svc.type}</span>
                      <span className="text-gray-600 text-[10px]">•</span>
                      <span className={`text-xs flex items-center gap-1 ${
                        svc.status === 'running' ? 'text-emerald-500' :
                        svc.status === 'stopped' ? 'text-gray-500' :
                        svc.status === 'provisioning' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {svc.status === 'running' && <CheckCircle2 className="w-3 h-3" />}
                        {svc.status === 'provisioning' && <Activity className="w-3 h-3 animate-pulse" />}
                        {svc.status === 'error' && <AlertCircle className="w-3 h-3" />}
                        {svc.status === 'stopped' && <Square className="w-3 h-3" />}
                        {svc.status.charAt(0).toUpperCase() + svc.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setShowLogs(svc.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      mode === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                    title={isZh ? "查看日志" : "View Logs"}
                    disabled={svc.status !== 'running'}
                  >
                    <TerminalIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeService(svc.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      mode === 'dark' ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                    }`}
                    title={isZh ? "移除服务" : "Remove Service"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={`grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl ${
                mode === 'dark' ? 'bg-gray-950/50' : 'bg-gray-50'
              }`}>
                <div>
                  <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    CPU Usage
                  </div>
                  <div className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    {svc.cpu}%
                  </div>
                </div>
                <div>
                  <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Memory
                  </div>
                  <div className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    {svc.memory}
                  </div>
                </div>
                {svc.port && (
                  <div>
                    <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Port
                    </div>
                    <div className={`text-sm font-mono ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      :{svc.port}
                    </div>
                  </div>
                )}
                {svc.url && (
                  <div className="col-span-2">
                    <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Endpoint
                    </div>
                    <div className={`text-xs font-mono truncate ${mode === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {svc.url}
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {svc.showCredentials && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className={`p-3 rounded-xl text-xs font-mono break-all relative group ${
                      mode === 'dark' ? 'bg-black/50 text-gray-300 border border-gray-800' : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {`CONNECTION_STRING="${getConnectionString(svc)}"`}
                      <button 
                        onClick={() => copyCredentials(svc)}
                        className={`absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                        mode === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                      }`}>
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 mt-auto">
                <button 
                  onClick={() => toggleServiceStatus(svc.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    svc.status === 'running' 
                      ? (mode === 'dark' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100')
                      : (mode === 'dark' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100')
                  }`} 
                  disabled={svc.status === 'provisioning'}
                >
                  {svc.status === 'running' ? (
                    <><Square className="w-3.5 h-3.5" /> {isZh ? "停止" : "Stop"}</>
                  ) : svc.status === 'provisioning' ? (
                    <><Activity className="w-3.5 h-3.5 animate-pulse" /> {isZh ? "部署中..." : "Provisioning..."}</>
                  ) : (
                    <><Play className="w-3.5 h-3.5" /> {isZh ? "启动" : "Start"}</>
                  )}
                </button>
                <button 
                  onClick={() => toggleCredentials(svc.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                    mode === 'dark' ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" /> {isZh ? "凭证" : "Credentials"}
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setShowCatalog(true)}
            className={`p-5 rounded-2xl border border-dashed flex flex-col items-center justify-center min-h-[220px] transition-all cursor-pointer group ${
              mode === 'dark' ? 'border-gray-700 hover:border-accent hover:bg-accent/5' : 'border-gray-300 hover:border-accent hover:bg-accent/5'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
              mode === 'dark' ? 'bg-gray-800 group-hover:bg-accent/20 text-gray-400 group-hover:text-accent' : 'bg-gray-100 group-hover:bg-accent/10 text-gray-400 group-hover:text-accent'
            }`}>
              <Plus className="w-6 h-6" />
            </div>
            <span className={`font-medium ${mode === 'dark' ? 'text-gray-300 group-hover:text-accent' : 'text-gray-600 group-hover:text-accent'}`}>
              {isZh ? "添加后端服务" : "Add Backend Service"}
            </span>
            <span className={`text-xs mt-1 text-center max-w-[200px] ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {isZh ? "支持数据库、缓存、消息队列等预置模板" : "Support databases, caches, message queues and templates"}
            </span>
          </button>
        </div>
      )}

      {/* 1. Database Persistent Storage View */}
      {activeTab === "db-persistent" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {isZh ? "PostgreSQL / MySQL 统一持久化引擎" : "PostgreSQL / MySQL Persistent Engine"}
                    <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono">
                      ● {dbStatus?.status || "HEALTHY"}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {dbStatus?.engine || "PostgreSQL 15.4 Compatible"} | Pool: {dbStatus?.connectionPool?.activeConnections || 4}/{dbStatus?.connectionPool?.totalConnections || 20} Active | Disk Synced: {dbStatus?.diskSynced ? "YES" : "NO"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRunMigration}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isZh ? "执行 schema 数据库迁移" : "Run Schema Migration"}
              </button>
            </div>

            {/* Table Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              {(dbTables || []).map((tbl: any) => (
                <div key={tbl.name} className={`p-3 rounded-xl border ${mode === 'dark' ? 'bg-gray-950/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-[11px] text-gray-400 font-mono truncate">{tbl.name}</div>
                  <div className="text-lg font-bold text-white mt-1">{tbl.rowCount} <span className="text-[10px] text-gray-500 font-normal">rows</span></div>
                  <div className="text-[10px] text-gray-500 truncate">{tbl.columns?.length || 0} columns</div>
                </div>
              ))}
            </div>

            {/* SQL Console */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span>SQL Console (Real SQL Engine Query)</span>
                <span className="text-[10px] text-gray-500 font-mono">POST /api/db/query</span>
              </label>
              <div className="relative">
                <textarea
                  value={sqlQuery}
                  onChange={e => setSqlQuery(e.target.value)}
                  rows={3}
                  className="w-full font-mono text-xs p-3 rounded-xl bg-gray-950 border border-gray-800 text-emerald-400 focus:outline-none focus:border-indigo-500"
                  placeholder="SELECT * FROM builds ORDER BY created_at DESC;"
                />
                <button
                  onClick={handleRunSql}
                  disabled={isExecutingSql}
                  className="absolute right-3 bottom-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  {isExecutingSql ? (isZh ? "执行中..." : "Executing...") : (isZh ? "运行 SQL" : "Execute SQL")}
                </button>
              </div>

              {queryResult && (
                <div className="mt-4 p-4 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs overflow-x-auto">
                  <div className="flex items-center justify-between text-gray-400 mb-2 pb-2 border-b border-gray-800">
                    <span>Query Status: <span className="text-emerald-400 font-bold">SUCCESS</span></span>
                    <span>Execution Time: <span className="text-indigo-400">{queryResult.executionTimeMs} ms</span> | Returned Rows: {queryResult.rowCount}</span>
                  </div>
                  {queryResult.rows && queryResult.rows.length > 0 ? (
                    <pre className="text-gray-300 max-h-60 overflow-y-auto">{JSON.stringify(queryResult.rows, null, 2)}</pre>
                  ) : (
                    <div className="text-gray-500 italic py-2">{isZh ? "未返回匹配记录" : "No records returned"}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Realtime SSE Log & Status Streaming View */}
      {activeTab === "sse-realtime" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {isZh ? "Server-Sent Events (SSE) 实时推流控制台" : "Server-Sent Events (SSE) Push Stream"}
                    <span className={`px-2 py-0.5 text-xs border rounded-full font-mono ${sseConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {sseConnected ? "● LIVE STREAM CONNECTED" : "○ CONNECTING..."}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Endpoint: <code className="text-emerald-400 font-mono">/api/sse/stream</code> | Live log chunks, metric ticks, and build step events
                  </p>
                </div>
              </div>
            </div>

            {/* Broadcast Form */}
            <div className="flex gap-2 mb-6 p-3 rounded-xl bg-gray-950 border border-gray-800">
              <input
                type="text"
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                placeholder={isZh ? "输入实时广播消息推送给所有在线客户端..." : "Enter live broadcast event to stream to all clients..."}
                className="flex-1 bg-transparent text-xs text-gray-200 focus:outline-none px-2"
              />
              <button
                onClick={handleBroadcastSse}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                {isZh ? "实时广播" : "Broadcast SSE"}
              </button>
            </div>

            {/* Live SSE Stream Output Log */}
            <div className="rounded-xl bg-gray-950 border border-gray-800 p-4 font-mono text-xs max-h-[420px] overflow-y-auto space-y-2">
              <div className="text-gray-500 pb-2 border-b border-gray-800 flex items-center justify-between">
                <span>[SSE Stream Live Output Feed]</span>
                <span className="text-emerald-400">{sseEvents.length} events received</span>
              </div>
              {sseEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1 border-b border-gray-900/60 hover:bg-gray-900/40 px-1 rounded">
                  <span className="text-gray-600 shrink-0 text-[10px]">{evt.timestamp?.slice(11, 19) || "NOW"}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold shrink-0 ${
                    evt.type === 'CONNECTED' ? 'bg-blue-500/20 text-blue-400' :
                    evt.type === 'OPERATOR_BROADCAST' ? 'bg-purple-500/20 text-purple-400' :
                    evt.type === 'LIVE_LOG' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-300'
                  }`}>{evt.type}</span>
                  <span className="text-gray-300 break-all">{evt.message || evt.liveLogLine || JSON.stringify(evt)}</span>
                </div>
              ))}
              {sseEvents.length === 0 && (
                <div className="text-gray-600 italic text-center py-8">{isZh ? "等待 SSE 流数据推送中..." : "Listening for SSE stream events..."}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Auth & RBAC View */}
      {activeTab === "auth-rbac" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isZh ? "身份认证与企业级 RBAC 权限控制" : "Authentication & Enterprise RBAC"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    JWT Session Security | Role Permission Matrix (Admin, DevOps, Developer, Auditor)
                  </p>
                </div>
              </div>
            </div>

            {/* Add User Form */}
            <form onSubmit={handleAddUser} className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl bg-gray-950 border border-gray-800">
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="user@gameops.io"
                className="flex-1 min-w-[200px] bg-gray-900 border border-gray-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="developer">Developer</option>
                <option value="devops">DevOps Lead</option>
                <option value="admin">Admin</option>
                <option value="auditor">Auditor</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {isZh ? "添加 / 更新 RBAC 账号" : "Add RBAC Account"}
              </button>
            </form>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-800 mb-6">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-950 text-gray-400 font-mono text-[10px] uppercase border-b border-gray-800">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Email & Name</th>
                    <th className="p-3">RBAC Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                  {rbacUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-gray-800/40">
                      <td className="p-3 font-mono text-gray-400">{u.id}</td>
                      <td className="p-3 font-semibold text-white">
                        {u.name} <div className="text-[10px] text-gray-400 font-normal">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${
                          u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          u.role === 'devops' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                          u.role === 'developer' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>{u.role}</span>
                      </td>
                      <td className="p-3 text-emerald-400 font-medium">● {u.status}</td>
                      <td className="p-3 font-mono text-gray-400 text-[11px]">{u.last_login?.slice(0, 19).replace('T', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* RBAC Matrix Inspector */}
            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-300 mb-3">{isZh ? "RBAC 权限矩阵分布说明" : "Role Permission Matrix"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {rbacMatrix.map((m: any) => (
                  <div key={m.role} className="p-3 rounded-lg border border-gray-800 bg-gray-900/60">
                    <div className="font-bold text-violet-400 uppercase">{m.role}</div>
                    <div className="text-gray-400 text-[11px] mt-1">{m.description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.permissions?.map((p: string) => (
                        <span key={p} className="px-1.5 py-0.5 text-[9px] bg-gray-800 text-gray-300 font-mono rounded">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Vault & Secrets Management View */}
      {activeTab === "vault-secrets" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isZh ? "Vault 密钥与数字证书零停机轮换管理" : "Vault Secrets & Digital Certificate Manager"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    AES-256 Encrypted Storage | Automated Key & Keystore Rotation
                  </p>
                </div>
              </div>
              <button
                onClick={handleRotateVault}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isZh ? "全量轮换 Vault 数字证书" : "Rotate All Certs & Secrets"}
              </button>
            </div>

            {/* Create Secret Form */}
            <form onSubmit={handleCreateSecret} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 p-4 rounded-xl bg-gray-950 border border-gray-800">
              <input
                type="text"
                value={newSecretName}
                onChange={e => setNewSecretName(e.target.value)}
                placeholder="SECRET_KEY_NAME"
                className="bg-gray-900 border border-gray-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <input
                type="password"
                value={newSecretVal}
                onChange={e => setNewSecretVal(e.target.value)}
                placeholder="Secret raw value..."
                className="bg-gray-900 border border-gray-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newSecretEnv}
                onChange={e => setNewSecretEnv(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="all">All Environments</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {isZh ? "加密写入 Vault" : "Encrypt & Save"}
              </button>
            </form>

            {/* Secrets Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-950 text-gray-400 font-mono text-[10px] uppercase border-b border-gray-800">
                  <tr>
                    <th className="p-3">Secret Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Environment</th>
                    <th className="p-3">Masked Secret Value</th>
                    <th className="p-3">Last Rotated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                  {vaultSecrets.map((s: any) => (
                    <tr key={s.id} className="hover:bg-gray-800/40">
                      <td className="p-3 font-mono text-amber-400 font-bold">{s.name}</td>
                      <td className="p-3 text-gray-400 uppercase text-[10px]">{s.category}</td>
                      <td className="p-3 text-gray-300">{s.environment}</td>
                      <td className="p-3 font-mono text-gray-400">{s.maskedValue}</td>
                      <td className="p-3 font-mono text-gray-400 text-[11px]">{s.rotated_at?.slice(0, 19).replace('T', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Distributed Runner Fleet Agent View */}
      {activeTab === "distributed-runners" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isZh ? "真实物理 Runner 节点 Agent 协议控制台" : "Distributed Physical Runner Fleet Protocol"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Agent Heartbeats | Polling Queue | Cross-Platform Build Nodes (macOS, Windows, Bare Metal)
                  </p>
                </div>
              </div>
            </div>

            {/* Register Agent Form */}
            <form onSubmit={handleRegisterAgent} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-gray-950 border border-gray-800">
              <input
                type="text"
                value={newAgentHost}
                onChange={e => setNewAgentHost(e.target.value)}
                placeholder="PHYSICAL-NODE-HOSTNAME"
                className="bg-gray-900 border border-gray-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <input
                type="text"
                value={newAgentOs}
                onChange={e => setNewAgentOs(e.target.value)}
                placeholder="macOS Sonoma / Windows Server 2022"
                className="bg-gray-900 border border-gray-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {isZh ? "注册物理 Runner Agent 节点" : "Register Runner Agent"}
              </button>
            </form>

            {/* Runner Fleet Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-950 text-gray-400 font-mono text-[10px] uppercase border-b border-gray-800">
                  <tr>
                    <th className="p-3">Runner ID</th>
                    <th className="p-3">Hostname & OS</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">CPU / RAM Load</th>
                    <th className="p-3">Active Job</th>
                    <th className="p-3">Last Heartbeat Ping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                  {runnerAgents.map((r: any) => (
                    <tr key={r.id} className="hover:bg-gray-800/40">
                      <td className="p-3 font-mono text-sky-400 font-bold">{r.id}</td>
                      <td className="p-3 text-white font-semibold">
                        {r.hostname || r.id} <div className="text-[10px] text-gray-400 font-normal">{r.platform || r.os}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${
                          r.status === 'busy' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>{r.status}</span>
                      </td>
                      <td className="p-3 font-mono text-gray-300">
                        {r.cpuUsage || r.cpuLoad + '%'} | {r.ramUsage || r.memoryUsage}
                      </td>
                      <td className="p-3 text-gray-300 truncate max-w-[200px]">{r.activeJob || "None (Polling)"}</td>
                      <td className="p-3 font-mono text-gray-400 text-[11px]">{r.lastHeartbeat?.slice(0, 19).replace('T', ' ') || "Just Now"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* C++ Infrastructure View */}
      {activeTab === "cpp-infra" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Sidebar selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-4 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-bold text-sm mb-3 flex items-center gap-1.5 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span>{isZh ? "原生编译模板" : "C++ Templates"}</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {isZh ? "选择并定制原生 C++ 服务构建及测试模板，最大化硬件编译和执行效率。" : "Select native compilation templates configured for extreme runtime execution efficiency."}
              </p>
              
              <div className="space-y-2">
                {CPP_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedCppTemplate(tpl)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                      selectedCppTemplate.id === tpl.id
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 font-semibold"
                        : mode === 'dark'
                          ? "bg-gray-950/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="text-xs block font-mono font-bold truncate">{tpl.name}</span>
                      <span className="text-[10px] text-gray-500 block truncate">{isZh ? tpl.titleZh : tpl.titleEn}</span>
                    </div>
                    <FileCode className={`h-4 w-4 shrink-0 transition-colors ${selectedCppTemplate.id === tpl.id ? "text-indigo-400" : "text-gray-600 group-hover:text-gray-400"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Optimized Alpine Indicator */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between ${mode === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider">{isZh ? "Alpine 运行时极致优化" : "Alpine Runtime Optimization"}</h4>
              </div>
              <p className="text-xs text-gray-500 leading-normal mb-4">
                {isZh ? "采用 Alpine 极简系统镜像并合并动态依赖至多阶段构建中，将最终微服务容器体积压缩至原来的 4.8%！" : "Compiles natively on Alpine while statically including standard library links to yield a hyper-secure microservice image."}
              </p>

              {/* Gauge indicator */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                    <span>{isZh ? "标准 Debian 容器体积" : "Standard Debian Container"}</span>
                    <span>250 MB</span>
                  </div>
                  <div className="h-1.5 bg-gray-950 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-indigo-400 font-bold mb-1">
                    <span>{isZh ? "Alpine 优化原生镜像" : "Alpine Optimized Image"}</span>
                    <span>12 MB (-95.2%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[4.8%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
            <div className={`flex-1 rounded-2xl border flex flex-col overflow-hidden relative ${mode === 'dark' ? 'bg-[#0b0c10] border-gray-800' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
              <div className={`px-5 py-3 border-b flex items-center justify-between ${mode === 'dark' ? 'border-gray-800 bg-gray-950/40' : 'border-gray-200 bg-gray-100'}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs ${mode === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{isZh ? selectedCppTemplate.titleZh : selectedCppTemplate.titleEn}</span>
                  <span className="text-gray-600">|</span>
                  <span className="font-mono text-[10px] text-gray-500">{selectedCppTemplate.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyTemplate(selectedCppTemplate.code, selectedCppTemplate.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-sans font-semibold text-xs cursor-pointer"
                  >
                    {copiedId === selectedCppTemplate.id ? (
                      <><Check className="h-3.5 w-3.5" /> <span>{isZh ? "已复制" : "Copied"}</span></>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /> <span>{isZh ? "复制代码" : "Copy"}</span></>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadTemplate(selectedCppTemplate.name, selectedCppTemplate.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all font-sans font-semibold text-xs cursor-pointer ${
                      mode === 'dark' ? 'border-gray-800 bg-gray-900 hover:bg-gray-850 text-gray-300' : 'border-gray-250 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Download className="h-3.5 w-3.5 text-gray-400" />
                    <span>{isZh ? "下载模板" : "Download"}</span>
                  </button>
                </div>
              </div>

              {/* Editable Code block */}
              <div className="flex-1 overflow-auto p-5 font-mono text-xs text-gray-300 leading-relaxed bg-black/60 max-h-[400px]">
                <pre className="whitespace-pre">{selectedCppTemplate.code}</pre>
              </div>

              {/* Description footer */}
              <div className={`p-4 border-t text-xs ${mode === 'dark' ? 'border-gray-800 bg-gray-900/40 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                <span className={`font-semibold block mb-1 ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{isZh ? "编译运行指南" : "Template Guidelines"}:</span>
                <p className="leading-relaxed">{isZh ? selectedCppTemplate.descZh : selectedCppTemplate.descEn}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spring Boot Dashboard View */}
      {activeTab === "spring-boot" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Spring Boot Configuration Controls */}
          <div className={`p-5 rounded-2xl border mb-4 ${mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h3 className={`font-bold text-sm mb-4 flex items-center gap-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <Settings className="h-4 w-4 text-indigo-400" />
              {isZh ? "配置项" : "Configuration"}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-500 font-bold uppercase mb-1 block">{isZh ? "环境" : "Profile"}</label>
                <select value={springProfile} onChange={e => setSpringProfile(e.target.value as any)} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-2 py-1.5 text-gray-200">
                  <option value="dev">dev</option>
                  <option value="test">test</option>
                  <option value="prod">prod</option>
                </select>
              </div>
              <div>
                <label className="text-gray-500 font-bold uppercase mb-1 block">{isZh ? "日志" : "Log Level"}</label>
                <select value={springLogLevel} onChange={e => setSpringLogLevel(e.target.value as any)} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-2 py-1.5 text-gray-200">
                  <option value="INFO">INFO</option>
                  <option value="DEBUG">DEBUG</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-gray-500 font-bold uppercase mb-1 block">{isZh ? "堆内存限制" : "Heap Limit"}</label>
                <input type="text" value={springHeapLimit} onChange={e => setSpringHeapLimit(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-2 py-1.5 text-gray-200" />
              </div>
              <div className="col-span-2 flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={enablePrometheus} onChange={e => setEnablePrometheus(e.target.checked)} className="rounded text-indigo-500 bg-gray-950 border-gray-800" />
                  <span className="text-gray-300">Prometheus</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={springEurekaEnabled} onChange={e => setSpringEurekaEnabled(e.target.checked)} className="rounded text-indigo-500 bg-gray-950 border-gray-800" />
                  <span className="text-gray-300">Eureka</span>
                </label>
              </div>
            </div>
          </div>
          <RemoteShell />
          <NotificationSettings />
          <BuildSandbox />

          {/* Microservices Discovery list */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-400 animate-bounce" />
                  <h3 className={`font-bold text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "Netflix Eureka 注册中心" : "Eureka Service Registry"}
                  </h3>
                </div>
                <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  CLUSTER ACTIVE
                </span>
              </div>
              
              <p className="text-xs text-gray-500 mb-4 leading-normal">
                {isZh ? "实时监控 Eureka 服务网格中的 Java/Spring Boot 微服务实例生命周期及心跳对齐状态。" : "Live-updating status of registered microservices within the container service network."}
              </p>

              {/* Active Instances list */}
              <div className="space-y-2.5">
                {eurekaInstances.map((instance, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                    mode === 'dark' ? 'bg-gray-950/40 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-gray-200 truncate">{instance.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${instance.status === "UP" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" : "bg-rose-500/10 text-rose-400 border-rose-500/10"}`}>
                        {instance.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                      <span>IP: {instance.ip}</span>
                      <span className="text-gray-700">|</span>
                      <span>Heap: {instance.memory}</span>
                      <span className="text-gray-700">|</span>
                      <span>CPU: {instance.cpu}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template file list selectors */}
            <div className={`p-4 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider block mb-3">{isZh ? "Java 微服务配置文件" : "Microservice Config Files"}</span>
              <div className="grid grid-cols-1 gap-2">
                {dynamicSpringTemplates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedSpringTemplateId(tpl.id)}
                    className={`text-left p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                      selectedSpringTemplate.id === tpl.id
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                        : mode === 'dark'
                          ? "bg-gray-950/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800"
                    }`}
                  >
                    <span>{tpl.name}</span>
                    <FileCode className="h-4 w-4 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Config Code Viewer Panel */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
            <div className={`flex-1 rounded-2xl border flex flex-col overflow-hidden relative ${mode === 'dark' ? 'bg-[#0b0c10] border-gray-800' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
              <div className={`px-5 py-3 border-b flex items-center justify-between ${mode === 'dark' ? 'border-gray-800 bg-gray-950/40' : 'border-gray-200 bg-gray-100'}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs ${mode === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{isZh ? selectedSpringTemplate.titleZh : selectedSpringTemplate.titleEn}</span>
                  <span className="text-gray-600">|</span>
                  <span className="font-mono text-[10px] text-gray-500">{selectedSpringTemplate.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyTemplate(selectedSpringTemplate.code, selectedSpringTemplate.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-sans font-semibold text-xs cursor-pointer"
                  >
                    {copiedId === selectedSpringTemplate.id ? (
                      <><Check className="h-3.5 w-3.5" /> <span>{isZh ? "已复制" : "Copied"}</span></>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /> <span>{isZh ? "复制代码" : "Copy"}</span></>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadTemplate(selectedSpringTemplate.name, selectedSpringTemplate.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all font-sans font-semibold text-xs cursor-pointer ${
                      mode === 'dark' ? 'border-gray-800 bg-gray-900 hover:bg-gray-850 text-gray-300' : 'border-gray-250 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Download className="h-3.5 w-3.5 text-gray-400" />
                    <span>{isZh ? "下载配置文件" : "Download"}</span>
                  </button>
                </div>
              </div>

              {/* Code display */}
              <div className="flex-1 overflow-auto p-5 font-mono text-xs text-gray-300 leading-relaxed bg-black/60 max-h-[400px]">
                <pre className="whitespace-pre">{selectedSpringTemplate.code}</pre>
              </div>

              {/* Instructions */}
              <div className={`p-4 border-t text-xs ${mode === 'dark' ? 'border-gray-800 bg-gray-900/40 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                <span className={`font-semibold block mb-1 ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{isZh ? "微服务部署与发现指南" : "Microservices Configuration Guidelines"}:</span>
                <p className="leading-relaxed">{isZh ? selectedSpringTemplate.descZh : selectedSpringTemplate.descEn}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Catalog Modal */}
      <AnimatePresence>
        {showCatalog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
                mode === 'dark' ? 'bg-[#111111] border border-gray-800' : 'bg-white border border-gray-200'
              }`}
            >
              <div className={`p-4 border-b flex items-center justify-between ${
                mode === 'dark' ? 'border-gray-800' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${mode === 'dark' ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent'}`}>
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {isZh ? "服务目录" : "Service Catalog"}
                    </h2>
                    <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isZh ? "一键预置可扩展后端基础设施" : "One-click provisioning for scalable backend infrastructure"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCatalog(false)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    mode === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
                <div className={`w-full md:w-64 flex-shrink-0 flex flex-col gap-2`}>
                  <div className={`relative mb-4`}>
                    <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input 
                      type="text" 
                      placeholder={isZh ? "搜索服务..." : "Search services..."}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                        mode === 'dark' 
                          ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  <div className="font-semibold text-xs uppercase tracking-wider mb-2 mt-2 px-2 text-gray-500">
                    {isZh ? "类别" : "Categories"}
                  </div>
                  {[
                    { id: "all", labelZh: "全部", labelEn: "All Services" },
                    { id: "database", labelZh: "数据库", labelEn: "Databases" },
                    { id: "cache", labelZh: "缓存", labelEn: "Caches" },
                    { id: "queue", labelZh: "消息队列", labelEn: "Message Queues" },
                    { id: "storage", labelZh: "存储", labelEn: "Storage" },
                    { id: "compute", labelZh: "计算", labelEn: "Compute" }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        activeCategory === cat.id
                          ? (mode === 'dark' ? 'bg-accent/20 text-accent font-medium' : 'bg-accent/10 text-accent font-medium')
                          : (mode === 'dark' ? 'text-gray-400 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-100')
                      }`}
                    >
                      {isZh ? cat.labelZh : cat.labelEn}
                    </button>
                  ))}
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
                  {filteredCatalog.map(item => (
                    <div 
                      key={item.name}
                      onClick={() => deployService(item)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        mode === 'dark' ? 'bg-gray-900/50 border-gray-800 hover:border-accent hover:bg-accent/5' : 'bg-white border-gray-200 hover:border-accent hover:bg-accent/5 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                          item.category === 'database' ? 'bg-blue-500/10 text-blue-500' :
                          item.category === 'cache' ? 'bg-red-500/10 text-red-500' :
                          item.category === 'compute' ? 'bg-green-500/10 text-green-500' :
                          item.category === 'queue' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-cyan-500/10 text-cyan-500'
                        }`}>
                          {item.category === 'database' || item.category === 'cache' ? <Database className="w-5 h-5" /> :
                           item.category === 'compute' ? <Server className="w-5 h-5" /> :
                           item.category === 'queue' ? <Cloud className="w-5 h-5" /> :
                           <Box className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className={`font-semibold text-sm group-hover:text-accent transition-colors ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {item.name}
                          </h3>
                          <div className={`text-xs mt-0.5 mb-1.5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isZh ? item.descZh : item.descEn}
                          </div>
                          <div className={`text-[10px] inline-flex px-2 py-0.5 rounded-full ${
                            mode === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.type}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredCatalog.length === 0 && (
                    <div className="col-span-1 md:col-span-2 py-12 text-center text-gray-500">
                      {isZh ? "未找到匹配的服务" : "No matching services found"}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terminal Logs Modal */}
      <AnimatePresence>
        {showLogs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-5xl h-[70vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
                mode === 'dark' ? 'bg-[#0a0a0a] border border-gray-800' : 'bg-[#1a1b26] border border-gray-900'
              }`}
            >
              <div className={`px-4 py-3 border-b flex items-center justify-between ${
                mode === 'dark' ? 'border-gray-800 bg-[#111111]' : 'border-gray-800 bg-[#16161e]'
              }`}>
                <div className="flex items-center gap-3">
                  <TerminalIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-sm text-gray-200">
                    {services.find(s => s.id === showLogs)?.name || "Service"} / logs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowLogs(null)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-gray-300 leading-relaxed bg-[#0a0a0a]">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1 hover:bg-white/5 px-2 py-0.5 rounded transition-colors break-all flex">
                    <span className="w-10 text-gray-600 shrink-0 select-none border-r border-gray-800 mr-3">{i+1}</span>
                    <span className={
                      log.includes('[INFO]') ? 'text-blue-400' :
                      log.includes('[DEBUG]') ? 'text-gray-400' :
                      log.includes('[WARN]') ? 'text-amber-400' :
                      log.includes('[ERROR]') ? 'text-red-400' : 'text-emerald-400'
                    }>
                      {log}
                    </span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
