import React from 'react';
import { CoachCharacter } from '../HumanExerciseVisualizer';

export interface CharacterTheme {
  skin: string;
  skinShadow: string;
  skinHighlight: string;
  hair: string;
  hairHighlight: string;
  apparel: string;
  apparelShadow: string;
  shorts: string;
  shortsShadow: string;
  shoes: string;
  shoesSole: string;
  joints: string;
  headband: string;
  name: string;
}

export const CHARACTER_THEMES: Record<CoachCharacter, CharacterTheme> = {
  marcus: {
    skin: '#d49b6a',
    skinShadow: '#ab6e3d',
    skinHighlight: '#f3c498',
    hair: '#1a181b',
    hairHighlight: '#2e2b30',
    apparel: '#059669', // Emerald athletic performance tank
    apparelShadow: '#047857',
    shorts: '#0f172a',
    shortsShadow: '#020617',
    shoes: '#0284c7',
    shoesSole: '#f8fafc',
    joints: '#38bdf8',
    headband: '#10b981',
    name: 'Coach Marcus'
  },
  maya: {
    skin: '#f5c696',
    skinShadow: '#cf9761',
    skinHighlight: '#fde0c2',
    hair: '#451a03',
    hairHighlight: '#78350f',
    apparel: '#0891b2', // Cyan athletic crop / tank
    apparelShadow: '#0e7490',
    shorts: '#312e81',
    shortsShadow: '#1e1b4b',
    shoes: '#f43f5e',
    shoesSole: '#ffffff',
    joints: '#c084fc',
    headband: '#06b6d4',
    name: 'Coach Maya'
  },
  biomech: {
    skin: '#475569',
    skinShadow: '#334155',
    skinHighlight: '#64748b',
    hair: '#0f172a',
    hairHighlight: '#1e293b',
    apparel: '#0d9488', // Titanium biomechanical weave
    apparelShadow: '#115e59',
    shorts: '#020617',
    shortsShadow: '#000000',
    shoes: '#10b981',
    shoesSole: '#22c55e',
    joints: '#22c55e',
    headband: '#22c55e',
    name: 'Biomech Skeletal'
  }
};

/* =========================================================================
   SVG DEFINITIONS: GRADIENTS, FILTERS & LIGHTING
========================================================================= */
export const AnatomyDefs: React.FC<{ theme: CharacterTheme; idPrefix?: string }> = ({ 
  theme, 
  idPrefix = '' 
}) => {
  const p = idPrefix;
  return (
    <defs>
      {/* Muscle glow filter */}
      <filter id={`${p}muscleGlow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* Subtle drop shadow */}
      <filter id={`${p}dropShadow`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.4" />
      </filter>

      {/* Skin Lighting Gradients */}
      <linearGradient id={`${p}skinGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={theme.skinHighlight} />
        <stop offset="60%" stopColor={theme.skin} />
        <stop offset="100%" stopColor={theme.skinShadow} />
      </linearGradient>

      <linearGradient id={`${p}skinVerticalGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={theme.skinHighlight} />
        <stop offset="70%" stopColor={theme.skin} />
        <stop offset="100%" stopColor={theme.skinShadow} />
      </linearGradient>

      {/* Apparel Tank Top Gradient */}
      <linearGradient id={`${p}tankGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={theme.apparel} />
        <stop offset="100%" stopColor={theme.apparelShadow} />
      </linearGradient>

      {/* Athletic Shorts Gradient */}
      <linearGradient id={`${p}shortsGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={theme.shorts} />
        <stop offset="100%" stopColor={theme.shortsShadow} />
      </linearGradient>

      {/* Mistake Red Alert Gradient */}
      <linearGradient id={`${p}mistakeGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#9f1239" />
      </linearGradient>
    </defs>
  );
};

/* =========================================================================
   HUMAN HEAD (FRONT VIEW) - Minimalist Anatomical Mannequin Form
========================================================================= */
export const HumanHeadFront: React.FC<{
  x: number;
  y: number;
  scale?: number;
  theme: CharacterTheme;
  characterType?: CoachCharacter;
}> = ({ x, y, scale = 1, theme, characterType }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Neck with subtle shading */}
      <path
        d="M -7 8 L -11 22 L 11 22 L 7 8 Z"
        fill="url(#skinVerticalGrad)"
        stroke={theme.skinShadow}
        strokeWidth="0.6"
      />

      {/* Clean Anatomical Mannequin Head (Smooth Oval) */}
      <ellipse
        cx="0"
        cy="-1"
        rx="12"
        ry="14.5"
        fill="url(#skinGrad)"
        stroke={theme.skinShadow}
        strokeWidth="0.8"
      />

      {/* Optional Sleek Athletic Headband / Cap Silhouette */}
      {characterType === 'marcus' && (
        <>
          <rect x="-12.5" y="-8" width="25" height="4" rx="2" fill={theme.headband} />
          <line x1="-10" y1="-6" x2="10" y2="-6" stroke="#ffffff" strokeWidth="0.6" opacity="0.7" />
        </>
      )}

      {characterType === 'maya' && (
        <>
          <rect x="-12.5" y="-8" width="25" height="3.5" rx="1.8" fill={theme.headband} />
          {/* Subtle ponytail silhouette on top-right */}
          <path
            d="M 6 -14 C 12 -20, 18 -12, 14 -5 C 11 -8, 7 -10, 6 -14 Z"
            fill={theme.hair}
            opacity="0.85"
          />
        </>
      )}

      {characterType === 'biomech' && (
        <rect x="-10" y="-3" width="20" height="3.5" rx="1.8" fill="#22c55e" opacity="0.85" />
      )}
    </g>
  );
};

/* =========================================================================
   HUMAN HEAD (SIDE VIEW - PROFILE) - Minimalist Anatomical Mannequin Form
========================================================================= */
export const HumanHeadSide: React.FC<{
  x: number;
  y: number;
  facingLeft?: boolean;
  scale?: number;
  theme: CharacterTheme;
  characterType?: CoachCharacter;
}> = ({ x, y, facingLeft = true, scale = 1, theme, characterType }) => {
  const flip = facingLeft ? 1 : -1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${flip * scale}, ${scale})`}>
      {/* Neck */}
      <path
        d="M 2 8 L 5 22 L -5 22 L -2 8 Z"
        fill="url(#skinVerticalGrad)"
        stroke={theme.skinShadow}
        strokeWidth="0.6"
      />

      {/* Sleek Profile Head (Smooth Anatomical Silhouette with subtle jaw angle) */}
      <ellipse
        cx="-1"
        cy="-1"
        rx="13.5"
        ry="14.5"
        fill="url(#skinGrad)"
        stroke={theme.skinShadow}
        strokeWidth="0.8"
      />

      {/* Athletic Headband / Visor Accent */}
      {characterType === 'marcus' && (
        <rect x="-8" y="-7.5" width="14" height="3.5" rx="1.5" fill={theme.headband} />
      )}

      {characterType === 'maya' && (
        <>
          <rect x="-8" y="-7.5" width="14" height="3.5" rx="1.5" fill={theme.headband} />
          {/* Subtle ponytail tail */}
          <path
            d="M -7 -9 C -16 -12, -18 -4, -14 2 C -11 -1, -9 -4, -7 -7 Z"
            fill={theme.hair}
            opacity="0.85"
          />
        </>
      )}

      {characterType === 'biomech' && (
        <rect x="2" y="-3" width="9" height="3.5" rx="1.5" fill="#22c55e" opacity="0.85" />
      )}
    </g>
  );
};

/* =========================================================================
   HUMAN ATHLETIC SNEAKER / FOOTWEAR
========================================================================= */
export const HumanSneaker: React.FC<{
  x: number;
  y: number;
  facingLeft?: boolean;
  angle?: number;
  theme: CharacterTheme;
  scale?: number;
}> = ({ x, y, facingLeft = true, angle = 0, theme, scale = 1 }) => {
  const flip = facingLeft ? 1 : -1;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${flip * scale}, ${scale})`}>
      {/* Sneaker Upper Body (Ergonomic Running Shoe) */}
      <path
        d="M -10 -8 C -7 -10, -2 -7, 4 -2 C 9 1, 14 3, 16 7 C 14 9, 8 9, -10 9 C -13 9, -14 2, -13 -4 C -12 -8, -11 -8, -10 -8 Z"
        fill={theme.shoes}
        stroke="#0f172a"
        strokeWidth="0.8"
      />
      {/* High-cushion EVA Midsole (White/Light) */}
      <path
        d="M -12 7 C -5 7, 5 7, 16 7 C 16 10.5, 14 12, 11 12 C 3 12, -7 12, -12 12 C -14 12, -14 9, -12 7 Z"
        fill={theme.shoesSole}
        stroke="#334155"
        strokeWidth="0.6"
      />
      {/* Outsole Tread Grip Accent */}
      <line x1="-10" y1="12" x2="12" y2="12" stroke="#0f172a" strokeWidth="1.2" strokeDasharray="2 2" />
      {/* Laces & Heel Tab */}
      <path d="M 0 -3 L 4 -1" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 2 -1 L 6 1" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="-11" y1="-5" x2="-8" y2="-7" stroke={theme.apparel} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
};

/* =========================================================================
   HUMAN HAND (FINGERS & ATHLETIC TRAINING GLOVE)
========================================================================= */
export const HumanHand: React.FC<{
  x: number;
  y: number;
  angle?: number;
  grip?: boolean;
  theme: CharacterTheme;
  scale?: number;
}> = ({ x, y, angle = 0, grip = false, theme, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}>
      {/* Wrist wrap */}
      <rect x="-4" y="-3" width="8" height="4" rx="1.5" fill="#1e293b" />
      {grip ? (
        // Closed athletic fist / barbell grip
        <g>
          <rect x="-4" y="0" width="8" height="7" rx="3" fill="url(#skinGrad)" stroke={theme.skinShadow} strokeWidth="0.6" />
          <line x1="-2" y1="2" x2="2" y2="2" stroke={theme.skinShadow} strokeWidth="0.8" />
          <line x1="-2" y1="4" x2="2" y2="4" stroke={theme.skinShadow} strokeWidth="0.8" />
          {/* Thumb */}
          <ellipse cx="-3.5" cy="2.5" rx="2" ry="3" fill={theme.skin} stroke={theme.skinShadow} strokeWidth="0.5" />
        </g>
      ) : (
        // Open stable palm with splayed fingers for pushup / floor stability
        <g>
          <path
            d="M -4 1 C -4 5, -2 8, 0 8 C 2 8, 4 5, 4 1 Z"
            fill="url(#skinGrad)"
            stroke={theme.skinShadow}
            strokeWidth="0.6"
          />
          {/* Finger definitions */}
          <line x1="-2" y1="3" x2="-2" y2="7.5" stroke={theme.skinShadow} strokeWidth="0.7" strokeLinecap="round" />
          <line x1="0" y1="3" x2="0" y2="8" stroke={theme.skinShadow} strokeWidth="0.7" strokeLinecap="round" />
          <line x1="2" y1="3" x2="2" y2="7.5" stroke={theme.skinShadow} strokeWidth="0.7" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};
