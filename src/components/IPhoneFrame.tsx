"use client";

export default function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 390, height: 844 }}>
      {/* Device bezel */}
      <div className="absolute inset-0 rounded-[50px] border-[8px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl overflow-hidden">
        {/* Screen area */}
        <div className="relative h-full w-full bg-[#F5F5F0] rounded-[42px] overflow-hidden">
          {/* Dynamic island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-50" />

          {/* Status bar */}
          <div className="relative z-40 flex justify-between items-center px-8 pt-4 h-[54px]">
            <span className="text-sm font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              {/* Signal bars */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <rect x="0" y="6" width="3" height="6" rx="0.5" />
                <rect x="4.5" y="4" width="3" height="8" rx="0.5" />
                <rect x="9" y="1.5" width="3" height="10.5" rx="0.5" />
                <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3" />
              </svg>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 3.5C9.8 3.5 11.4 4.2 12.6 5.3L14 3.9C12.4 2.4 10.3 1.5 8 1.5S3.6 2.4 2 3.9L3.4 5.3C4.6 4.2 6.2 3.5 8 3.5Z" />
                <path d="M8 7C9 7 9.9 7.4 10.5 8L12 6.5C11 5.6 9.6 5 8 5S5 5.6 4 6.5L5.5 8C6.1 7.4 7 7 8 7Z" />
                <circle cx="8" cy="10.5" r="1.5" />
              </svg>
              {/* Battery */}
              <svg width="27" height="13" viewBox="0 0 27 13" fill="currentColor">
                <rect x="0" y="1" width="23" height="11" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                <rect x="1.5" y="2.5" width="19" height="8" rx="1" />
                <rect x="24" y="4.5" width="2.5" height="4" rx="1" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* App content */}
          <div className="h-[calc(100%-54px)] overflow-y-auto">
            {children}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full opacity-20 z-50" />
        </div>
      </div>
    </div>
  );
}
