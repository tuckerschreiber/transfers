"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IPhoneFrame from "@/components/IPhoneFrame";
import DemoSidebar from "@/components/DemoSidebar";
import HomeScreen from "@/components/patient/HomeScreen";
import TrackerHomeScreen from "@/components/patient/TrackerHomeScreen";
import TransferModal from "@/components/patient/TransferModal";
import { TransferStatus } from "@/lib/types";

type DemoView = "home" | "transfer-modal" | "tracker";

export default function Home() {
  const [currentView, setCurrentView] = useState<DemoView>("home");
  const [trackerState, setTrackerState] = useState<TransferStatus>("submitted");

  // Sync sidebar tracker state with API so pharmacy dashboard reflects changes
  useEffect(() => {
    if (currentView === "tracker") {
      fetch("/api/transfers/tx-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: trackerState }),
      });
    }
  }, [trackerState, currentView]);

  // Determine the view key for crossfade (home and transfer-modal share the same base screen)
  const viewKey = currentView === "transfer-modal" ? "home" : currentView;

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
          <AnimatePresence mode="wait">
            <motion.div
              key={viewKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {(currentView === "home" || currentView === "transfer-modal") && (
                <HomeScreen onTransferPress={() => setCurrentView("transfer-modal")} />
              )}
              {currentView === "tracker" && (
                <TrackerHomeScreen status={trackerState} />
              )}
            </motion.div>
          </AnimatePresence>
          <TransferModal
            isOpen={currentView === "transfer-modal"}
            onClose={() => setCurrentView("home")}
            onSubmit={async (pharmacyId) => {
              await fetch("/api/transfers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prescriptionId: "rx-1", sourcePharmacyId: pharmacyId }),
              });
              setTrackerState("submitted");
              setCurrentView("tracker");
            }}
          />
        </IPhoneFrame>
      </div>
    </div>
  );
}
