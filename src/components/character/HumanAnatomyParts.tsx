import React from 'react';
import { CoachCharacter } from '../HumanExerciseVisualizer';

export interface CharacterTheme {
  id: CoachCharacter;
  name: string;
  subtitle: string;
  gender: 'male' | 'female' | 'biomech';
  skin: string;
  skinShadow: string;
  skinHighlight: string;
  skinDeepShadow: string;
  hair: string;
  hairHighlight: string;
  hairStyle: 'fade' | 'ponytail' | 'buzz' | 'hologram';
  apparel: string;
  apparelShadow: string;
  apparelHighlight: string;
  shorts: string;
  shortsShadow: string;
  shortsAccent: string;
  shoes: string;
  shoesSole: string;
  shoesAccent: string;
  joints: string;
  headband: string;
  watch: string;
}

export const COACH_PROFILES: Record<CoachCharacter, CharacterTheme> = {
  marcus: {
    id: 'marcus',
    name: 'Coach Marcus',
    subtitle: 'Athletic Strength & Hypertrophy',
    gender: 'male',
    skin: '#c68b59',
    skinShadow: '#9c6235',
    skinHighlight: '#e5aa7a',
    skinDeepShadow: '#784520',
    hair: '#1c1917',
    hairHighlight: '#292524',
    hairStyle: 'fade',
    apparel: '#059669', // Emerald performance tank
    apparelShadow: '#047857',
    apparelHighlight: '#34d399',
    shorts: '#0f172a',
    shortsShadow: '#020617',
    shortsAccent: '#10b981',
    shoes: '#0284c7',
    shoesSole: '#ffffff',
    shoesAccent: '#38bdf8',
    joints: '#38bdf8',
    headband: '#10b981',
    watch: '#0284c7'
  },
  maya: {
    id: 'maya',
    name: 'Coach Maya',
    subtitle: 'Functional Mobility & Calisthenics',
    gender: 'female',
    skin: '#e0a97a',
    skinShadow: '#b87c4c',
    skinHighlight: '#f7caa0',
    skinDeepShadow: '#8f562a',
    hair: '#451a03',
    hairHighlight: '#78350f',
    hairStyle: 'ponytail',
    apparel: '#0891b2', // Vibrant Cyan sports top
    apparelShadow: '#0e7490',
    apparelHighlight: '#22d3ee',
    shorts: '#312e81',
    shortsShadow: '#1e1b4b',
    shortsAccent: '#818cf8',
    shoes: '#f43f5e',
    shoesSole: '#ffffff',
    shoesAccent: '#fb7185',
    joints: '#c084fc',
    headband: '#06b6d4',
    watch: '#f43f5e'
  },
  jordan: {
    id: 'jordan',
    name: 'Coach Jordan',
    subtitle: 'HIIT & Explosive Conditioning',
    gender: 'male',
    skin: '#8d5534',
    skinShadow: '#5c3116',
    skinHighlight: '#b37750',
    skinDeepShadow: '#40200c',
    hair: '#0c0a09',
    hairHighlight: '#1c1917',
    hairStyle: 'buzz',
    apparel: '#d97706', // Amber athletic performance wear
    apparelShadow: '#b45309',
    apparelHighlight: '#fbbf24',
    shorts: '#18181b',
    shortsShadow: '#09090b',
    shortsAccent: '#f59e0b',
    shoes: '#e11d48',
    shoesSole: '#ffffff',
    shoesAccent: '#fb7185',
    joints: '#fbbf24',
    headband: '#f59e0b',
    watch: '#d97706'
  },
  biomech: {
    id: 'biomech',
    name: 'Biomech Titan',
    subtitle: '3D Anatomical Muscle Kinetic Rig',
    gender: 'biomech',
    skin: '#475569',
    skinShadow: '#334155',
    skinHighlight: '#64748b',
    skinDeepShadow: '#1e293b',
    hair: '#0f172a',
    hairHighlight: '#1e293b',
    hairStyle: 'hologram',
    apparel: '#0d9488',
    apparelShadow: '#115e59',
    apparelHighlight: '#14b8a6',
    shorts: '#020617',
    shortsShadow: '#000000',
    shortsAccent: '#22c55e',
    shoes: '#10b981',
    shoesSole: '#22c55e',
    shoesAccent: '#4ade80',
    joints: '#22c55e',
    headband: '#22c55e',
    watch: '#22c55e'
  }
};

export const CHARACTER_THEMES = COACH_PROFILES;

/* =========================================================================
   SVG DEFINITIONS: REALISTIC SHADING, MULTI-STOP GRADIENTS & MUSCLE GLOWS
========================================================================= */
export const AnatomyDefs: React.FC<{ theme: CharacterTheme; idPrefix?: string }> = ({ 
  theme, 
  idPrefix = '' 
}) => {
  const p = idPrefix;
  return (
    <defs>
      {/* High-definition muscle heat-glow filter */}
      <filter id={`${p}muscleGlow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Soft contact shadow filter for floor */}
      <filter id={`${p}contactShadow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
      </filter>

      {/* Realistic 3D drop shadow for limbs & torso */}
      <filter id={`${p}bodyShadow`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.45" />
      </filter>

      {/* Specular skin highlight gradient (Organic 3D Cylindrical Light) */}
      <linearGradient id={`${p}skinGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={theme.skinHighlight} />
        <stop offset="45%" stopColor={theme.skin} />
        <stop offset="85%" stopColor={theme.skinShadow} />
        <stop offset="100%" stopColor={theme.skinDeepShadow} />
      </linearGradient>

      {/* Vertical torso skin lighting */}
      <linearGradient id={`${p}skinVerticalGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={theme.skinHighlight} />
        <stop offset="35%" stopColor={theme.skin} />
        <stop offset="85%" stopColor={theme.skinShadow} />
        <stop offset="100%" stopColor={theme.skinDeepShadow} />
      </linearGradient>

      {/* Muscle contour linear gradient for arms & legs */}
      <linearGradient id={`${p}limbGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={theme.skinHighlight} />
        <stop offset="30%" stopColor={theme.skin} />
        <stop offset="75%" stopColor={theme.skinShadow} />
        <stop offset="100%" stopColor={theme.skinDeepShadow} />
      </linearGradient>

      {/* Athletic Tank / Top Gradient with Specular Sheen */}
      <linearGradient id={`${p}tankGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={theme.apparelHighlight} stopOpacity="0.9" />
        <stop offset="25%" stopColor={theme.apparel} />
        <stop offset="80%" stopColor={theme.apparelShadow} />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>

      {/* Athletic Shorts Gradient */}
      <linearGradient id={`${p}shortsGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="20%" stopColor={theme.shorts} />
        <stop offset="90%" stopColor={theme.shortsShadow} />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>

      {/* Muscle Contraction Heatmap Gradients */}
      <radialGradient id={`${p}primaryMuscleHeat`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#10b981" stopOpacity="0.75" />
        <stop offset="85%" stopColor="#059669" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${p}secondaryMuscleHeat`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#0284c7" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
      </radialGradient>

      {/* Form Error Red Warning Gradient */}
      <linearGradient id={`${p}mistakeGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>

      {/* Hair Gradient */}
      <linearGradient id={`${p}hairGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={theme.hairHighlight} />
        <stop offset="60%" stopColor={theme.hair} />
        <stop offset="100%" stopColor="#09090b" />
      </linearGradient>
    </defs>
  );
};

/* =========================================================================
   1. SLEEK ATHLETIC MANNEQUIN HEAD (FRONT VIEW)
========================================================================= */
export const HumanHeadFront: React.FC<{
  x: number;
  y: number;
  scale?: number;
  theme: CharacterTheme;
  characterType?: CoachCharacter;
}> = ({ x, y, scale = 1, theme, characterType = 'marcus' }) => {
  const isFemale = theme.gender === 'female';
  const isBiomech = theme.gender === 'biomech';

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 1. Neck with Sternocleidomastoid & Trapezius Contours */}
      <path
        d="M -7 10 C -9 18, -12 24, -15 28 L 15 28 C 12 24, 9 18, 7 10 Z"
        fill="url(#skinVerticalGrad)"
        stroke={theme.skinDeepShadow}
        strokeWidth="0.8"
      />
      {/* Neck tendon subtle highlights */}
      <line x1="-3" y1="12" x2="-6" y2="26" stroke={theme.skinHighlight} strokeWidth="0.8" opacity="0.4" />
      <line x1="3" y1="12" x2="6" y2="26" stroke={theme.skinShadow} strokeWidth="0.8" opacity="0.4" />

      {/* 2. Sleek Athletic Cranium & Jawline Sculpt */}
      {isFemale ? (
        // Sleek, contoured feminine athletic head form
        <path
          d="M 0 -18 C -11 -18, -13 -8, -12 2 C -11 9, -7 15, 0 17 C 7 15, 11 9, 12 2 C 13 -8, 11 -18, 0 -18 Z"
          fill="url(#skinGrad)"
          stroke={theme.skinDeepShadow}
          strokeWidth="0.9"
        />
      ) : (
        // Strong, chiseled athletic masculine head form
        <path
          d="M 0 -19 C -12 -19, -14 -8, -13 2 C -12 9, -8 16.5, 0 18 C 8 16.5, 12 9, 13 2 C 14 -8, 12 -19, 0 -19 Z"
          fill="url(#skinGrad)"
          stroke={theme.skinDeepShadow}
          strokeWidth="1"
        />
      )}

      {/* 3. Subtle Athletic Jaw Shading & Cheek Plane */}
      <path
        d="M -9 3 C -7 9, -5 13, 0 15 C 5 13, 7 9, 9 3"
        fill="none"
        stroke={theme.skinShadow}
        strokeWidth="0.7"
        opacity="0.3"
      />

      {/* 4. Sleek Ear Silhouettes */}
      <path d="M -13 -3 C -15 -5, -16 2, -13 4 Z" fill={theme.skin} stroke={theme.skinShadow} strokeWidth="0.7" />
      <path d="M 13 -3 C 15 -5, 16 2, 13 4 Z" fill={theme.skin} stroke={theme.skinShadow} strokeWidth="0.7" />

      {/* 5. Biomech Visor (Only for Cyber/Biomech Theme) */}
      {isBiomech && (
        <g id="biomech-hud">
          <rect x="-11" y="-6" width="22" height="6" rx="3" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
          <line x1="-9" y1="-3" x2="9" y2="-3" stroke="#4ade80" strokeWidth="1.5" />
          <circle cx="0" cy="5" r="1.5" fill="#22c55e" opacity="0.8" />
        </g>
      )}

      {/* 6. Styled Athletic Hair & Headwear */}
      {theme.hairStyle === 'fade' && (
        <g id="fade-hair">
          {/* Clean modern textured crop / high-fade */}
          <path
            d="M -13 -8 C -14 -17, -8 -22, 0 -22 C 8 -22, 14 -17, 13 -8 C 11 -12, 6 -15, 0 -15 C -6 -15, -11 -12, -13 -8 Z"
            fill="url(#hairGrad)"
          />
          {/* Subtle side fade shadow */}
          <path d="M -13 -7 C -13.5 -3, -12 2, -11.5 2 C -11.5 -1, -12.5 -4, -13 -7 Z" fill={theme.hair} opacity="0.7" />
          <path d="M 13 -7 C 13.5 -3, 12 2, 11.5 2 C 11.5 -1, 12.5 -4, 13 -7 Z" fill={theme.hair} opacity="0.7" />
          {/* Performance Sweatband */}
          <rect x="-13" y="-10" width="26" height="4" rx="2" fill={theme.headband} />
          <line x1="-10" y1="-8" x2="10" y2="-8" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
        </g>
      )}

      {theme.hairStyle === 'ponytail' && (
        <g id="ponytail-hair">
          {/* High athletic ponytail top volume */}
          <path
            d="M -13 -6 C -14 -18, -6 -23, 0 -23 C 6 -23, 14 -18, 13 -6 C 11 -12, 5 -16, 0 -16 C -5 -16, -11 -12, -13 -6 Z"
            fill="url(#hairGrad)"
          />
          {/* High ponytail flowing hair behind head */}
          <path
            d="M 6 -20 C 14 -28, 22 -18, 17 -6 C 14 -12, 9 -16, 6 -20 Z"
            fill="url(#hairGrad)"
            stroke={theme.hairHighlight}
            strokeWidth="0.6"
          />
          {/* Hairband / Scrunchie */}
          <ellipse cx="6" cy="-20" rx="3.5" ry="2.5" fill={theme.headband} />
        </g>
      )}

      {theme.hairStyle === 'buzz' && (
        <g id="buzz-hair">
          <path
            d="M -13 -8 C -14 -18, -7 -21, 0 -21 C 7 -21, 14 -18, 13 -8 C 11 -12, 6 -14, 0 -14 C -6 -14, -11 -12, -13 -8 Z"
            fill="url(#hairGrad)"
          />
          <rect x="-13" y="-10" width="26" height="3.5" rx="1.7" fill={theme.headband} />
        </g>
      )}

      {theme.hairStyle === 'hologram' && (
        <path
          d="M -12 -8 C -13 -18, -6 -21, 0 -21 C 6 -21, 13 -18, 12 -8 Z"
          fill="#1e293b"
          stroke="#22c55e"
          strokeWidth="0.8"
        />
      )}
    </g>
  );
};

/* =========================================================================
   2. SLEEK ATHLETIC HEAD (PROFILE / SIDE VIEW)
========================================================================= */
export const HumanHeadSide: React.FC<{
  x: number;
  y: number;
  facingLeft?: boolean;
  scale?: number;
  theme: CharacterTheme;
  characterType?: CoachCharacter;
}> = ({ x, y, facingLeft = true, scale = 1, theme, characterType = 'marcus' }) => {
  const flip = facingLeft ? 1 : -1;
  const isFemale = theme.gender === 'female';
  const isBiomech = theme.gender === 'biomech';

  return (
    <g transform={`translate(${x}, ${y}) scale(${flip * scale}, ${scale})`}>
      {/* 1. Neck with Muscle Tendons & Cervical Spine alignment */}
      <path
        d="M 5 8 C 8 16, 12 24, 15 28 L -10 28 C -8 22, -4 14, -2 8 Z"
        fill="url(#skinVerticalGrad)"
        stroke={theme.skinDeepShadow}
        strokeWidth="0.8"
      />

      {/* 2. Sleek Athletic Profile Cranium and Jaw Silhouette */}
      {isFemale ? (
        <path
          d="M 2 -18 C -7 -18, -15 -10, -15 2 C -15 10, -9 16, -2 17 C 2 17, 5 15, 6 13 C 8 13, 10 12, 11 10 C 10 9, 8 9, 8 8 C 10 7, 13 4, 14 2 C 12 1, 9 0, 8 -3 C 8 -8, 6 -15, 2 -18 Z"
          fill="url(#skinGrad)"
          stroke={theme.skinDeepShadow}
          strokeWidth="0.9"
        />
      ) : (
        <path
          d="M 3 -19 C -6 -19, -15 -11, -15 2 C -15 10, -9 17, -2 18 C 3 18, 6 16, 8 14 C 9.5 14, 11 13, 12 11 C 10.5 10, 8.5 10, 8.5 9 C 11 8, 14 5, 15 3 C 13 2, 10 1, 9 -2 C 9 -9, 7 -16, 3 -19 Z"
          fill="url(#skinGrad)"
          stroke={theme.skinDeepShadow}
          strokeWidth="1"
        />
      )}

      {/* 3. Anatomical Ear */}
      <path
        d="M -4 -2 C -7 -4, -8 4, -4 6 C -2 6, -1 2, -4 -2 Z"
        fill={theme.skin}
        stroke={theme.skinDeepShadow}
        strokeWidth="0.8"
      />

      {/* 4. Biomech Visor Side Sensor */}
      {isBiomech && (
        <path d="M 4 -5 L 12 -4 L 8 -1 Z" fill="#22c55e" stroke="#16a34a" strokeWidth="0.6" />
      )}

      {/* 5. Hair in Profile */}
      {theme.hairStyle === 'fade' && (
        <g id="profile-fade">
          <path
            d="M -15 -2 C -16 -12, -7 -21, 2 -21 C 8 -21, 10 -15, 9 -10 C 6 -14, 0 -16, -6 -14 C -12 -12, -14 -6, -15 -2 Z"
            fill="url(#hairGrad)"
          />
          <rect x="-8" y="-11" width="18" height="4" rx="2" fill={theme.headband} transform="rotate(-6)" />
        </g>
      )}

      {theme.hairStyle === 'ponytail' && (
        <g id="profile-ponytail">
          <path
            d="M -15 0 C -16 -12, -7 -22, 2 -22 C 7 -22, 10 -16, 9 -11 C 6 -15, 0 -17, -6 -15 C -12 -13, -14 -6, -15 0 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M -8 -16 C -18 -22, -26 -14, -22 -2 C -17 -6, -12 -10, -8 -16 Z"
            fill="url(#hairGrad)"
            stroke={theme.hairHighlight}
            strokeWidth="0.8"
          />
          <ellipse cx="-8" cy="-16" rx="3.5" ry="2.5" fill={theme.headband} />
        </g>
      )}

      {theme.hairStyle === 'buzz' && (
        <g id="profile-buzz">
          <path
            d="M -15 -2 C -16 -12, -7 -21, 2 -21 C 8 -21, 10 -15, 9 -10 C 6 -14, 0 -16, -6 -14 C -12 -12, -14 -6, -15 -2 Z"
            fill="url(#hairGrad)"
          />
          <rect x="-8" y="-11" width="18" height="3.5" rx="1.7" fill={theme.headband} transform="rotate(-6)" />
        </g>
      )}

      {theme.hairStyle === 'hologram' && (
        <path
          d="M -14 -2 C -15 -12, -6 -21, 2 -21 C 7 -21, 9 -15, 8 -10 Z"
          fill="#1e293b"
          stroke="#22c55e"
          strokeWidth="0.8"
        />
      )}
    </g>
  );
};

/* =========================================================================
   3. HIGH-PERFORMANCE ATHLETIC RUNNING SHOE / SNEAKER
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
      {/* Dynamic Floor Contact Shadow */}
      <ellipse cx="2" cy="14" rx="14" ry="4" fill="#000000" opacity="0.35" filter="url(#contactShadow)" />

      {/* Ergonomic Sneaker Upper Body */}
      <path
        d="M -12 -9 C -9 -11, -3 -8, 4 -3 C 10 1, 16 3, 18 7 C 15 9, 8 9, -12 9 C -15 9, -16 2, -15 -4 C -14 -8, -13 -9, -12 -9 Z"
        fill={theme.shoes}
        stroke="#0f172a"
        strokeWidth="1"
      />

      {/* Aerodynamic Speed Stripe / Athletic Accent */}
      <path
        d="M -10 -4 Q 0 0 10 4"
        fill="none"
        stroke={theme.shoesAccent}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* High-cushion Responsive Midsole (White/Light) */}
      <path
        d="M -14 7 C -6 7, 6 7, 18 7 C 18 11, 15 13, 12 13 C 3 13, -7 13, -14 13 C -16 13, -16 9, -14 7 Z"
        fill={theme.shoesSole}
        stroke="#334155"
        strokeWidth="0.8"
      />

      {/* Outsole Traction Flex Grooves */}
      <line x1="-12" y1="13" x2="14" y2="13" stroke="#0f172a" strokeWidth="1.6" strokeDasharray="3 2" />

      {/* Laces & Padded Collar */}
      <path d="M -1 -4 L 3 -2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 2 -2 L 6 0" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 5 0 L 9 2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
      {/* Heel Pull Tab */}
      <line x1="-13" y1="-6" x2="-10" y2="-9" stroke={theme.apparelHighlight} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};

/* =========================================================================
   4. ATHLETIC HUMAN HAND & WRIST / SMARTWATCH
========================================================================= */
export const HumanHand: React.FC<{
  x: number;
  y: number;
  angle?: number;
  grip?: boolean;
  theme: CharacterTheme;
  scale?: number;
  hasWatch?: boolean;
}> = ({ x, y, angle = 0, grip = false, theme, scale = 1, hasWatch = false }) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}>
      {/* Fitness Smartwatch / Training Wristband */}
      {hasWatch ? (
        <g id="smartwatch">
          <rect x="-4.5" y="-5" width="9" height="4" rx="1.5" fill="#1e293b" stroke="#0f172a" strokeWidth="0.6" />
          <rect x="-2.5" y="-6" width="5" height="4.5" rx="1" fill="#0284c7" />
          <circle cx="0" cy="-3.8" r="0.6" fill="#38bdf8" />
        </g>
      ) : (
        // Wrist contour
        <rect x="-4" y="-4" width="8" height="3.5" rx="1.5" fill="url(#skinGrad)" />
      )}

      {grip ? (
        // Closed Athletic Fist / Barbell Grip with Knuckles & Thumb
        <g id="athletic-fist">
          <rect x="-4.5" y="-0.5" width="9" height="8" rx="3.5" fill="url(#skinGrad)" stroke={theme.skinDeepShadow} strokeWidth="0.8" />
          {/* Finger Knuckle Creases */}
          <line x1="-2.5" y1="2" x2="2.5" y2="2" stroke={theme.skinShadow} strokeWidth="0.9" strokeLinecap="round" />
          <line x1="-2.5" y1="4.5" x2="2.5" y2="4.5" stroke={theme.skinShadow} strokeWidth="0.9" strokeLinecap="round" />
          {/* Thumb wrap */}
          <ellipse cx="-4" cy="3" rx="2.2" ry="3.2" fill="url(#skinGrad)" stroke={theme.skinDeepShadow} strokeWidth="0.7" />
        </g>
      ) : (
        // Open Stable Palm with Splayed Fingers for Pushups / Planks
        <g id="stable-palm">
          <path
            d="M -5 0 C -5 5, -3 9, 0 9.5 C 3 9, 5 5, 5 0 Z"
            fill="url(#skinGrad)"
            stroke={theme.skinDeepShadow}
            strokeWidth="0.8"
          />
          {/* 4 Anatomical Finger Creases & Nails */}
          <line x1="-3" y1="2.5" x2="-3" y2="8" stroke={theme.skinShadow} strokeWidth="0.8" strokeLinecap="round" />
          <line x1="-1" y1="2.5" x2="-1" y2="9" stroke={theme.skinShadow} strokeWidth="0.8" strokeLinecap="round" />
          <line x1="1" y1="2.5" x2="1" y2="9" stroke={theme.skinShadow} strokeWidth="0.8" strokeLinecap="round" />
          <line x1="3" y1="2.5" x2="3" y2="8" stroke={theme.skinShadow} strokeWidth="0.8" strokeLinecap="round" />
          {/* Thumb */}
          <path d="M -5 1 C -7 3, -6 6, -4 6" fill="none" stroke={theme.skinDeepShadow} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};
