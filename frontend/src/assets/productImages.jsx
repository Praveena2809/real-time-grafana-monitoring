import React from 'react';

export function ProductImage({ id, category, name }) {
  // Returns tailored SVG artwork for each product
  switch (id) {
    case 101:
      // Mechanical Keyboard
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <defs>
            <linearGradient id="kb-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="rgb-bar" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          <rect x="25" y="45" width="270" height="110" rx="12" fill="url(#kb-grad)" stroke="#334155" strokeWidth="2" />
          <rect x="35" y="145" width="250" height="3" rx="1.5" fill="url(#rgb-bar)" />
          {/* Key Rows */}
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                <rect
                  key={col}
                  x={40 + col * 24}
                  y={55 + row * 20}
                  width="18"
                  height="14"
                  rx="3"
                  fill="#1E293B"
                  stroke={row === 1 && (col === 3 || col === 4) ? '#38BDF8' : '#475569'}
                  strokeWidth="1"
                />
              ))}
            </g>
          ))}
          {/* Spacebar */}
          <rect x="100" y="125" width="100" height="14" rx="3" fill="#334155" stroke="#64748B" strokeWidth="1" />
          {/* Status LED */}
          <circle cx="275" cy="58" r="3" fill="#10B981" />
        </svg>
      );

    case 102:
      // Ultra-Wide Curved Monitor
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <defs>
            <linearGradient id="screen-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          {/* Curved Screen Frame */}
          <path
            d="M 30 50 Q 160 38 290 50 L 285 130 Q 160 142 35 130 Z"
            fill="url(#screen-grad)"
            stroke="#38BDF8"
            strokeWidth="2"
          />
          {/* Code lines on screen */}
          <path d="M 60 75 L 140 75" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
          <path d="M 60 90 L 190 90" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 60 105 L 120 105" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
          {/* Stand */}
          <path d="M 152 138 L 145 165 L 175 165 L 168 138 Z" fill="#475569" />
          <ellipse cx="160" cy="168" rx="45" ry="8" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      );

    case 103:
      // Active Noise-Cancelling Headphones
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <defs>
            <linearGradient id="metal-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          {/* Headband Arch */}
          <path
            d="M 95 120 C 95 50, 225 50, 225 120"
            stroke="url(#metal-grad)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          {/* Soft Cushion Top */}
          <path
            d="M 120 65 C 145 55, 175 55, 200 65"
            stroke="#1E293B"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left Ear Cup */}
          <rect x="75" y="105" width="36" height="55" rx="18" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          <rect x="80" y="112" width="10" height="40" rx="5" fill="#0F172A" />
          {/* Right Ear Cup */}
          <rect x="209" y="105" width="36" height="55" rx="18" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          <rect x="230" y="112" width="10" height="40" rx="5" fill="#0F172A" />
          {/* Sound Wave Indicator */}
          <circle cx="160" cy="140" r="16" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 104:
      // Ergonomic Chair
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          {/* Headrest */}
          <rect x="135" y="25" width="50" height="22" rx="8" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
          {/* Spine connector */}
          <path d="M 160 47 L 160 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          {/* Mesh Backrest */}
          <path
            d="M 125 55 C 120 85, 120 100, 130 115 L 190 115 C 200 100, 200 85, 195 55 Z"
            fill="#1E293B"
            stroke="#38BDF8"
            strokeWidth="1.5"
          />
          {/* Seat Cushion */}
          <rect x="110" y="115" width="100" height="20" rx="7" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          {/* Gas Lift */}
          <rect x="156" y="135" width="8" height="28" fill="#94A3B8" />
          {/* 5-Star Base */}
          <path d="M 160 163 L 120 178 M 160 163 L 200 178 M 160 163 L 160 180" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="120" cy="180" r="4" fill="#38BDF8" />
          <circle cx="200" cy="180" r="4" fill="#38BDF8" />
          <circle cx="160" cy="182" r="4" fill="#38BDF8" />
        </svg>
      );

    case 105:
      // Thunderbolt Dock
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <defs>
            <linearGradient id="dock-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          {/* Dock Chassis */}
          <rect x="50" y="70" width="220" height="60" rx="8" fill="url(#dock-metal)" stroke="#64748B" strokeWidth="2" />
          {/* Thunderbolt Logo */}
          <path d="M 80 92 L 88 102 L 84 102 L 92 114 L 84 105 L 88 105 Z" fill="#38BDF8" />
          {/* Front Ports */}
          <rect x="110" y="93" width="16" height="7" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
          <rect x="135" y="93" width="16" height="7" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
          <rect x="165" y="91" width="24" height="11" rx="2" fill="#0F172A" stroke="#94A3B8" strokeWidth="1" />
          <rect x="200" y="91" width="24" height="11" rx="2" fill="#0F172A" stroke="#94A3B8" strokeWidth="1" />
          {/* SD slot */}
          <line x1="238" y1="92" x2="238" y2="108" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          {/* Power LED */}
          <circle cx="65" cy="100" r="3" fill="#10B981" />
        </svg>
      );

    case 106:
      // High-Precision Mouse
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <defs>
            <linearGradient id="mouse-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          {/* Mouse Body */}
          <path
            d="M 125 70 C 125 45, 195 45, 195 70 L 195 130 C 195 160, 125 160, 125 130 Z"
            fill="url(#mouse-grad)"
            stroke="#64748B"
            strokeWidth="2"
          />
          {/* Center Seam */}
          <line x1="160" y1="50" x2="160" y2="95" stroke="#64748B" strokeWidth="1.5" />
          {/* Scroll Wheel */}
          <rect x="156" y="65" width="8" height="18" rx="4" fill="#38BDF8" />
          {/* Ergonomic thumb flare */}
          <path d="M 125 90 C 115 110, 115 130, 125 140" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
        </svg>
      );

    case 107:
      // Studio Microphone
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          {/* Boom Arm */}
          <line x1="40" y1="180" x2="120" y2="100" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
          <line x1="120" y1="100" x2="155" y2="70" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
          <circle cx="120" cy="100" r="6" fill="#38BDF8" />
          {/* Shockmount Ring */}
          <circle cx="180" cy="85" r="32" stroke="#94A3B8" strokeWidth="2.5" fill="none" />
          {/* Mic Capsule */}
          <rect x="168" y="55" width="24" height="60" rx="12" fill="#1E293B" stroke="#F43F5E" strokeWidth="1.5" />
          {/* Mesh Grille */}
          <rect x="170" y="58" width="20" height="24" rx="8" fill="#334155" />
          {/* Volume Knob */}
          <circle cx="180" cy="95" r="3" fill="#38BDF8" />
        </svg>
      );

    case 108:
      // ScreenBar Light
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          {/* Horizontal Light Bar */}
          <rect x="40" y="60" width="240" height="14" rx="7" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          {/* Light Glow downwards */}
          <path
            d="M 50 74 L 270 74 L 290 150 L 30 150 Z"
            fill="url(#light-glow)"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="light-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Counterweight Clamp */}
          <rect x="150" y="74" width="20" height="22" rx="4" fill="#334155" />
          <circle cx="160" cy="98" r="8" fill="#475569" />
          {/* Touch Sensor Indicator */}
          <circle cx="160" cy="67" r="2.5" fill="#38BDF8" />
        </svg>
      );

    default:
      // Generic product icon
      return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="product-svg">
          <rect width="320" height="200" rx="12" fill="#0B132B" />
          <rect x="110" y="50" width="100" height="100" rx="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          <text x="160" y="110" fill="#38BDF8" fontSize="36" textAnchor="middle">📦</text>
        </svg>
      );
  }
}
