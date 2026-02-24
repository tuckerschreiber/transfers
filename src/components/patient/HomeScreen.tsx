"use client";

import { useState, useEffect } from "react";
import PrescriptionCard from "./PrescriptionCard";
import TransferCTACard from "./TransferCTACard";
import BottomTabBar from "./BottomTabBar";
import { Transfer, Prescription } from "@/lib/types";

interface CompletedPrescription {
  id: string;
  drugName: string;
  refillsRemaining: number;
}

function getNextRefillDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 28); // 4 weeks from now
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface HomeScreenProps {
  onTransferPress: () => void;
}

export default function HomeScreen({ onTransferPress }: HomeScreenProps) {
  const [completedRx, setCompletedRx] = useState<CompletedPrescription[]>([]);

  useEffect(() => {
    let active = true;
    const fetchCompleted = async () => {
      const transfers: Transfer[] = await fetch("/api/transfers").then((r) => r.json());
      const completed = transfers.filter((t) => t.status === "completed");

      const allPrescriptions: Prescription[] = [];
      for (const t of completed) {
        const rxList: Prescription[] = await Promise.all(
          t.prescriptionIds.map((id: string) =>
            fetch(`/api/prescriptions/${id}`).then((r) => r.json())
          )
        );
        allPrescriptions.push(...rxList);
      }

      if (active) {
        setCompletedRx(
          allPrescriptions.map((rx) => ({
            id: rx.id,
            drugName: rx.drugName,
            refillsRemaining: rx.refillsRemaining,
          }))
        );
      }
    };
    fetchCompleted();
    const interval = setInterval(fetchCompleted, 3000);
    return () => { active = false; clearInterval(interval); };
  }, []);

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

        {/* Care section */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Care</h2>
        <div className="space-y-3">
          <PrescriptionCard
            drugName="Smoking cessation"
            ordersLeft={3}
            nextOrder="Oct 31"
          />
          {completedRx.map((rx) => (
            <PrescriptionCard
              key={rx.id}
              drugName={rx.drugName}
              ordersLeft={rx.refillsRemaining}
              nextOrder={getNextRefillDate()}
            />
          ))}
        </div>

        {/* For you section */}
        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">For you</h2>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2">
          <TransferCTACard onPress={onTransferPress} />
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
