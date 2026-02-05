"use client";

import { useState } from "react";
import IPhoneFrame from "@/components/IPhoneFrame";
import DemoSidebar from "@/components/DemoSidebar";
import HomeScreen from "@/components/patient/HomeScreen";
import { TransferStatus } from "@/lib/types";

type DemoView = "home" | "transfer-modal" | "tracker";

export default function Home() {
  const [currentView, setCurrentView] = useState<DemoView>("home");
  const [trackerState, setTrackerState] = useState<TransferStatus>("submitted");

  return (
    <div className="flex h-screen bg-gray-50">
      <DemoSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        trackerState={trackerState}
        onTrackerStateChange={setTrackerState}
      />
      <div className="flex-1 flex items-center justify-center">
        <IPhoneFrame>
          {(currentView === "home" || currentView === "transfer-modal") && (
            <HomeScreen onTransferPress={() => setCurrentView("transfer-modal")} />
          )}
          {currentView === "tracker" && (
            <div className="p-4 pt-2 text-gray-900">
              <p className="text-sm text-gray-400">Tracker view (coming in Task 7)</p>
            </div>
          )}
        </IPhoneFrame>
      </div>
    </div>
  );
}
