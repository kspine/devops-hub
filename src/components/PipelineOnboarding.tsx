import React, { useState } from "react";
import { Wand2 } from "lucide-react";

export default function PipelineOnboarding() {
  const [step, setStep] = useState(1);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <Wand2 className="h-4 w-4 text-purple-400" />
        Pipeline Onboarding Wizard (Step {step}/3)
      </h3>
      <p className="text-xs text-gray-400">Import your local Unity build settings to auto-configure runners.</p>
      <button 
        onClick={() => setStep(s => s < 3 ? s + 1 : 1)}
        className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded text-xs text-white"
      >
        Next Step
      </button>
    </div>
  );
}
