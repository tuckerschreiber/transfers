"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Pharmacy } from "@/lib/types";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pharmacyId: string) => void;
}

export default function TransferModal({ isOpen, onClose, onSubmit }: TransferModalProps) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [address, setAddress] = useState("101 Peter St, Toronto, ON, M5V 0G6");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/pharmacies")
        .then((r) => r.json())
        .then(setPharmacies);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-40"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 flex flex-col"
            style={{ height: "92%" }}
          >
            {/* Close button */}
            <button onClick={onClose} className="p-5 self-start">
              <X size={20} className="text-gray-900" />
            </button>

            <div className="px-5 flex-1 overflow-y-auto pb-24">
              <h2 className="text-2xl font-bold text-gray-900">Transfer your prescription</h2>
              <p className="text-gray-500 mt-1">Search and select your current pharmacy.</p>

              {/* Address input */}
              <div className="mt-6 flex items-center bg-gray-100 rounded-full px-4 py-3">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                />
                {address && (
                  <button onClick={() => setAddress("")}>
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Pharmacy list */}
              <p className="text-sm text-gray-500 mt-6 mb-3">Choose a pharmacy below</p>
              <div className="flex flex-col gap-2">
                {pharmacies.map((pharmacy) => (
                  <button
                    key={pharmacy.id}
                    onClick={() => setSelectedId(pharmacy.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                      selectedId === pharmacy.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 text-sm">{pharmacy.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{pharmacy.address}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedId === pharmacy.id ? "border-gray-900" : "border-gray-300"
                    }`}>
                      {selectedId === pharmacy.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue button */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white">
              <button
                onClick={() => selectedId && onSubmit(selectedId)}
                disabled={!selectedId}
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-full font-semibold text-sm disabled:opacity-40 transition-opacity"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
