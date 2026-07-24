import { Clock } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function BuildQueue() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const queue = [
    { id: 1, name: "Nightly Beta Delivery", platform: "Android", status: "Active" },
    { id: 2, name: "WebGL Diagnostics", platform: "WebGL", status: "Queued" },
    { id: 3, name: "iOS Release Prep", platform: "iOS", status: "Queued" }
  ];

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans flex items-center gap-2">
        <Clock className="h-4 w-4 text-indigo-400" />
        {isZh ? "构建排队队列 (Queue)" : "Pending Build Queue"}
      </h3>
      <div className="space-y-2">
        {queue.map(job => (
          <div key={job.id} className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800">
            <div>
              <p className="text-xs font-semibold text-gray-200">{job.name}</p>
              <p className="text-[10px] text-gray-500">{job.platform}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${job.status === "Active" ? "bg-indigo-950 text-indigo-300 border border-indigo-900" : "bg-gray-800 text-gray-400"}`}>
              {job.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
