import React from 'react';

interface SatyakLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const SatyakLogo: React.FC<SatyakLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subtitleSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Custom Emblem: Shield + Trust Pillars + Document Checkmark */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-lg shadow-sm"
        style={{
          width: iconSize,
          height: iconSize,
          background: 'linear-gradient(135deg, #142B4A 0%, #203C5B 100%)',
          border: '1px solid #DCE4ED',
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Outer Shield Outline */}
          <path
            d="M24 6L38 11V22C38 31 32 38.5 24 42C16 38.5 10 31 10 22V11L24 6Z"
            stroke="#087F8C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#142B4A"
          />
          {/* Institutional Pillars of Trust */}
          <path
            d="M18 20V29M24 17V29M30 20V29"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <path
            d="M16 30H32"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          {/* Verified Document Checkmark Badge in Teal */}
          <circle cx="33" cy="15" r="5.5" fill="#087F8C" stroke="#FFFFFF" strokeWidth="1.5" />
          <path
            d="M31 15L32.5 16.5L35.5 13.5"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-extrabold tracking-tight text-[#142B4A] ${textSize}`}>
            SATYAK
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E6F4F3] text-[#087F8C] border border-[#087F8C]/20 uppercase tracking-wider">
            Prototype
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-medium text-[#637287] tracking-normal leading-tight ${subtitleSize}`}>
            Application Validation & Compliance Assistance
          </span>
        )}
      </div>
    </div>
  );
};
