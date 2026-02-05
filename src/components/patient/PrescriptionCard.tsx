"use client";

import { ArrowRight } from "lucide-react";

export default function PrescriptionCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-sm font-semibold">fx</span>
          <span className="font-semibold text-gray-900">Smoking cessation</span>
        </div>
        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
          <ArrowRight size={14} className="text-gray-600" />
        </button>
      </div>
      <div className="mt-3 flex justify-between text-xs">
        <span className="text-gray-400 uppercase tracking-wider">Orders left</span>
        <span className="text-gray-900 font-medium">3</span>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-gray-400 uppercase tracking-wider">Next order</span>
        <span className="text-gray-900 font-medium">Oct 31</span>
      </div>
    </div>
  );
}
