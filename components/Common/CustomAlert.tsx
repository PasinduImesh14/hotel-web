"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, X, Info, AlertTriangle } from "lucide-react";

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      icon: "text-green-600",
      iconBg: "bg-green-100",
      button: "bg-green-600 hover:bg-green-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      icon: "text-red-600",
      iconBg: "bg-red-100",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      icon: "text-yellow-600",
      iconBg: "bg-yellow-100",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const style = typeStyles[type];

  const icons = {
    success: <CheckCircle size={24} />,
    error: <X size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className={`${style.bg} border-2 ${style.border} rounded-2xl shadow-2xl p-6 max-w-md w-full`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`${style.icon} ${style.iconBg} flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center`}
          >
            {icons[type]}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`w-full mt-6 py-3 ${style.button} text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg`}
        >
          OK
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CustomAlert;