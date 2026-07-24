import { useState, createContext, useContext, ReactNode, useCallback } from "react";
import { XCircle, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{
  addToast: (message: string, type: ToastType) => void;
} | null>(null);

let toastIdCounter = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    toastIdCounter += 1;
    const id = Date.now() + toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${
              toast.type === "error"
                ? "bg-red-950 border-red-800 text-red-200"
                : toast.type === "warning"
                ? "bg-amber-950 border-amber-800 text-amber-200"
                : "bg-gray-900 border-gray-700 text-gray-200"
            }`}
          >
            {toast.type === "error" && <XCircle className="h-5 w-5" />}
            {toast.type === "warning" && <AlertCircle className="h-5 w-5" />}
            {toast.type === "success" && <CheckCircle className="h-5 w-5" />}
            {toast.type === "info" && <Info className="h-5 w-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
