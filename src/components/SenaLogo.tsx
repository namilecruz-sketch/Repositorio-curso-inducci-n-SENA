import React from 'react';

interface SenaLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const SenaSymbol: React.FC<SenaLogoProps> = ({
  className = '',
  size = 32,
  color = '#39A900',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo oficial SENA"
    >
      <path
        fill={color}
        d="M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6 c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6 c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3 c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1 l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4 c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2 c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1 l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z M280.6,268.9 l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z M557.5,269c0,0-51.9,0-77.9,0l0,137.7 l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7 l13.9,24.9l68.8,0L874,269.2L805.6,269.2z M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z M10.6,445.6l0.5,75l280.1-1 c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9 c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699 c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z"
      />
    </svg>
  );
};

export const SenaEscudoSvg: React.FC<{ size?: number; className?: string; highlightedPart?: string | null }> = ({
  size = 180,
  className = '',
  highlightedPart = null,
}) => {
  const isPinon = highlightedPart === 'pinon';
  const isCaduceo = highlightedPart === 'caduceo';
  const isCafe = highlightedPart === 'cafe';

  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 200 230"
      className={`transition-all duration-300 ${className}`}
      aria-label="Escudo oficial del SENA"
    >
      <defs>
        <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
        <filter id="shieldShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Main Shield Outline */}
      <path
        d="M20 20 H180 V130 C180 180 100 215 100 215 C100 215 20 180 20 130 Z"
        fill="url(#shieldBg)"
        stroke="#00324D"
        strokeWidth="6"
        filter="url(#shieldShadow)"
      />

      {/* Internal border trim */}
      <path
        d="M28 28 H172 V126 C172 170 100 202 100 202 C100 202 28 170 28 126 Z"
        fill="none"
        stroke="#39A900"
        strokeWidth="2.5"
      />

      {/* Sector 1: Piñón (Industria y Construcción) - Top Right */}
      <g
        className={`cursor-pointer transition-all duration-200 ${
          isPinon ? 'scale-105 origin-center' : ''
        }`}
        opacity={highlightedPart && !isPinon ? 0.35 : 1}
      >
        <circle cx="140" cy="80" r="26" fill="#39A900" />
        <circle cx="140" cy="80" r="14" fill="#FFFFFF" stroke="#00324D" strokeWidth="2" />
        <circle cx="140" cy="80" r="6" fill="#39A900" />
        {/* Gear Teeth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="136"
            y="50"
            width="8"
            height="7"
            rx="1.5"
            fill="#39A900"
            transform={`rotate(${deg} 140 80)`}
          />
        ))}
      </g>

      {/* Sector 2: Caduceo de Mercurio (Comercio y Servicios) - Top Left */}
      <g
        className={`cursor-pointer transition-all duration-200 ${
          isCaduceo ? 'scale-105 origin-center' : ''
        }`}
        opacity={highlightedPart && !isCaduceo ? 0.35 : 1}
      >
        {/* Central staff */}
        <line x1="60" y1="48" x2="60" y2="114" stroke="#00324D" strokeWidth="3.5" strokeLinecap="round" />
        {/* Staff topper orb */}
        <circle cx="60" cy="46" r="4.5" fill="#39A900" />
        {/* Caduceus Wings */}
        <path
          d="M60 52 C50 44 42 48 38 52 C45 54 53 54 60 52 Z"
          fill="#39A900"
        />
        <path
          d="M60 52 C70 44 78 48 82 52 C75 54 67 54 60 52 Z"
          fill="#39A900"
        />
        {/* Entwined Serpents */}
        <path
          d="M48 64 C54 64 66 70 66 78 C66 84 54 88 54 96 C54 102 66 106 60 110"
          fill="none"
          stroke="#39A900"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M72 64 C66 64 54 70 54 78 C54 84 66 88 66 96 C66 102 54 106 60 110"
          fill="none"
          stroke="#00324D"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Sector 3: Rama de Café (Sector Agropecuario) - Bottom Center */}
      <g
        className={`cursor-pointer transition-all duration-200 ${
          isCafe ? 'scale-105 origin-center' : ''
        }`}
        opacity={highlightedPart && !isCafe ? 0.35 : 1}
      >
        {/* Branch stem */}
        <path
          d="M65 175 Q100 135 135 170"
          fill="none"
          stroke="#5c4033"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Green Coffee leaves */}
        <path
          d="M100 148 Q118 132 114 118 Q98 122 100 148 Z"
          fill="#39A900"
          stroke="#007832"
          strokeWidth="1.5"
        />
        <path
          d="M100 148 Q82 132 86 118 Q102 122 100 148 Z"
          fill="#39A900"
          stroke="#007832"
          strokeWidth="1.5"
        />
        <path
          d="M76 166 Q64 148 70 138 Q82 144 76 166 Z"
          fill="#39A900"
        />
        <path
          d="M124 166 Q136 148 130 138 Q118 144 124 166 Z"
          fill="#39A900"
        />
        {/* Red Coffee Berries */}
        <circle cx="95" cy="148" r="4" fill="#DC2626" />
        <circle cx="105" cy="148" r="4" fill="#EF4444" />
        <circle cx="100" cy="142" r="3.5" fill="#B91C1C" />
      </g>

      {/* Ribbon Banner SENA at bottom */}
      <path
        d="M38 198 Q100 220 162 198 L156 186 Q100 206 44 186 Z"
        fill="#00324D"
      />
      <text
        x="100"
        y="199"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="12"
        fontWeight="800"
        letterSpacing="2.5"
        fontFamily="sans-serif"
      >
        SENA
      </text>
    </svg>
  );
};

export const SenaFlagSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 140,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 200 130"
      className={`rounded shadow-md border border-slate-200 dark:border-slate-700 ${className}`}
      aria-label="Bandera oficial del SENA"
    >
      {/* White Flag Field (Peace, serenity, ethical transparency) */}
      <rect width="200" height="130" fill="#FFFFFF" />
      
      {/* Green decorative edge piping */}
      <line x1="0" y1="2" x2="200" y2="2" stroke="#39A900" strokeWidth="3" />
      <line x1="0" y1="128" x2="200" y2="128" stroke="#39A900" strokeWidth="3" />
      
      {/* Central Shield Outline in Green */}
      <g transform="translate(75, 25) scale(0.25)">
        <SenaEscudoSvg size={200} />
      </g>
    </svg>
  );
};
