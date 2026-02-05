"use client";

import TrackerCard from "./TrackerCard";
import BottomTabBar from "./BottomTabBar";
import { TransferStatus } from "@/lib/types";

interface TrackerHomeScreenProps {
  status: TransferStatus;
}

export default function TrackerHomeScreen({ status }: TrackerHomeScreenProps) {
  return (
    <div className="relative h-full">
      <div className="px-5 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <div className="flex items-center gap-1.5 bg-purple-50 rounded-full px-3 py-1.5">
            <span className="text-purple-600 text-xs font-semibold">fx</span>
            <span className="text-sm font-semibold text-gray-900">3,600</span>
          </div>
        </div>

        {/* Care section with tracker */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Care</h2>
        <TrackerCard drugName="Nizatidine" status={status} />

        {/* For you section (without transfer CTA) */}
        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">For you</h2>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2">
          <div className="bg-white rounded-2xl p-5 shadow-sm w-[200px] shrink-0">
            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
              Everyday wellness
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Hand-picked products that support your health and wellbeing.
            </p>
          </div>
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}
