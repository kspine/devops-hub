import React from "react";
import { Bell, Slack, Mail, MessageSquare } from "lucide-react";

export default function NotificationSettings() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-bold text-gray-200">Notification Rules</h3>
      <div className="space-y-3">
        {[
          { label: "C++ Build Error", icon: Mail },
          { label: "Test Failure", icon: Slack },
          { label: "Pipeline Timeout", icon: MessageSquare },
        ].map(rule => (
          <div key={rule.label} className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800 rounded-lg">
            <span className="flex items-center gap-2 text-xs text-gray-300">
              <rule.icon className="h-4 w-4 text-indigo-400" />
              {rule.label}
            </span>
            <input type="checkbox" className="accent-indigo-600" defaultChecked />
          </div>
        ))}
      </div>
    </div>
  );
}
