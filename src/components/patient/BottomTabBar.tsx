"use client";

import { Home, Heart, ShoppingBag, User } from "lucide-react";

const tabs = [
  { icon: Home, label: "Home", active: true },
  { icon: Heart, label: "Care", active: false },
  { icon: ShoppingBag, label: "Shop", active: false },
  { icon: User, label: "Profile", active: false },
];

export default function BottomTabBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pb-6 pt-2 z-40">
      <div className="flex justify-between">
        {tabs.map((tab) => (
          <button key={tab.label} className="flex flex-col items-center gap-0.5">
            <tab.icon
              size={22}
              strokeWidth={tab.active ? 2.5 : 1.5}
              className={tab.active ? "text-gray-900" : "text-gray-400"}
            />
            <span className={`text-[10px] ${tab.active ? "text-gray-900 font-medium" : "text-gray-400"}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
