"use client";

import { ArrowRight } from "lucide-react";

interface PrescriptionCardProps {
  drugName: string;
  ordersLeft: number;
  nextOrder: string;
}

export default function PrescriptionCard({
  drugName,
  ordersLeft,
  nextOrder,
}: PrescriptionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-sm font-semibold">fx</span>
          <span className="font-semibold text-gray-900">{drugName}</span>
        </div>
        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
          <ArrowRight size={14} className="text-gray-600" />
        </button>
      </div>
      <div className="mt-3 flex justify-between text-xs">
        <span className="text-gray-400 uppercase tracking-wider">Orders left</span>
        <span className="text-gray-900 font-medium">{ordersLeft}</span>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-gray-400 uppercase tracking-wider">Next order</span>
        <span className="text-gray-900 font-medium">{nextOrder}</span>
      </div>
    </div>
  );
}
