import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Activity, Cpu, Box, Zap } from 'lucide-react';

const InsightsDashboard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    activeNodes: 124,
    queuedJobs: 12,
    avgTime: '4m 12s',
    successRate: '99.4%'
  });

  // Generate mock real-time data
  useEffect(() => {
    const generateData = () => {
      const points = [];
      const now = new Date();
      for (let i = 20; i >= 0; i--) {
        points.push({
          time: new Date(now.getTime() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          throughput: 40 + Math.random() * 40,
          latency: 2 + Math.random() * 5
        });
      }
      setData(points);
    };

    generateData();
    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1)];
        next.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          throughput: 40 + Math.random() * 40,
          latency: 2 + Math.random() * 5
        });
        return next;
      });

      // Fluctuate metrics slightly
      setMetrics(prev => ({
        ...prev,
        activeNodes: Math.max(100, prev.activeNodes + (Math.random() > 0.5 ? 1 : -1)),
        queuedJobs: Math.max(5, prev.queuedJobs + (Math.random() > 0.5 ? 2 : -2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const resourceData = [
    { name: 'Compute', value: 400 },
    { name: 'Storage', value: 300 },
    { name: 'Network', value: 200 },
    { name: 'Cache', value: 278 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

  return (
    <div className="mt-24 w-full">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {t('insights.title')}
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{t('insights.live')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Cpu, label: t('insights.metrics.active'), value: metrics.activeNodes, color: 'text-indigo-400' },
          { icon: Activity, label: t('insights.metrics.queued'), value: metrics.queuedJobs, color: 'text-amber-400' },
          { icon: Zap, label: t('insights.metrics.avgTime'), value: metrics.avgTime, color: 'text-emerald-400' },
          { icon: Box, label: t('insights.metrics.success'), value: metrics.successRate, color: 'text-rose-400' },
        ].map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/5 rounded-2xl p-6 shadow-xl"
          >
            <m.icon className={`w-5 h-5 ${m.color} mb-4`} />
            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white/5 border border-white/5 rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-white">{t('insights.throughput')}</h3>
            <div className="flex gap-4 text-[10px] text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> BW (Gbps)</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500/30" /> Latency (ms)</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  minTickGap={30}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorThroughput)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Charts */}
        <div className="grid grid-cols-1 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-xl"
          >
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">{t('insights.resource')}</h3>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {resourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {resourceData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] text-gray-400 font-medium">{d.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
