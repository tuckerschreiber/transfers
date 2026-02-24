"use client";

interface TransferCTACardProps {
  onPress: () => void;
}

export default function TransferCTACard({ onPress }: TransferCTACardProps) {
  return (
    <button onClick={onPress} className="bg-white rounded-2xl p-5 shadow-sm text-left w-[200px] shrink-0">
      <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
        Transfer your prescriptions to Tucker&apos;s Pharmacy
      </h3>
      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
        Free delivery, auto refills &amp; renewals.
      </p>
      {/* Pill imagery placeholder - colored circles */}
      <div className="flex gap-2 mt-4">
        <div className="w-12 h-12 rounded-full bg-cyan-200" />
        <div className="w-12 h-12 rounded-full bg-amber-300" />
        <div className="w-12 h-12 rounded-full bg-gray-100" />
      </div>
    </button>
  );
}
