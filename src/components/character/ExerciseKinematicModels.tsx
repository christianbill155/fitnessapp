import React from 'react';
import { CoachCharacter, ViewAngle } from '../HumanExerciseVisualizer';
import { 
  CharacterTheme, 
  HumanHeadFront, 
  HumanHeadSide, 
  HumanSneaker, 
  HumanHand 
} from './HumanAnatomyParts';

interface KinematicProps {
  progress: number;
  viewAngle: ViewAngle;
  colors: any;
  theme: CharacterTheme;
  characterType: CoachCharacter;
  showMistake: boolean;
  showGlow: boolean;
}

/* =========================================================================
   1. PUSH-UP KINEMATIC MODEL (Side & Front View)
========================================================================= */
export const PushupCharacter: React.FC<KinematicProps> = ({
  progress,
  viewAngle,
  theme,
  characterType,
  showMistake,
  showGlow
}) => {
  const yDrop = progress * 48;
  const mistakeSag = showMistake ? Math.sin(progress * Math.PI) * 22 : 0;

  if (viewAngle === 'front') {
    const elbowFlare = 28 + (showMistake ? 30 : 8) * progress;
    const handX = 58;
    const chestY = 118 + yDrop;

    return (
      <g transform="translate(200, 0)">
        {/* Floor Horizon & Ambient Shadow */}
        <ellipse cx="0" cy="214" rx="90" ry="12" fill="#000000" opacity={0.3 + progress * 0.2} filter="url(#contactShadow)" />
        <line x1="-160" y1="210" x2="160" y2="210" stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />

        {/* Head Front with Neck */}
        <HumanHeadFront
          x={0}
          y={chestY - 50}
          scale={0.92}
          theme={theme}
          characterType={characterType}
        />

        {/* Muscular Shoulders (Deltoid Caps) */}
        <ellipse cx={-36} cy={chestY - 14} rx="13" ry="10" fill="url(#skinGrad)" stroke={theme.skinDeepShadow} strokeWidth="0.8" />
        <ellipse cx={36} cy={chestY - 14} rx="13" ry="10" fill="url(#skinGrad)" stroke={theme.skinDeepShadow} strokeWidth="0.8" />

        {/* Athletic Torso & Compression Tank Top */}
        <path
          d={`M -32 ${chestY - 14} C -36 ${chestY + 16}, -26 ${chestY + 48}, -22 ${chestY + 62} L 22 ${chestY + 62} C 26 ${chestY + 48}, 36 ${chestY + 16}, 32 ${chestY - 14} Z`}
          fill="url(#tankGrad)"
          stroke="#0f172a"
          strokeWidth="1.2"
        />

        {/* Athletic Tank Seams & Pectoral Contours */}
        <path d={`M -15 ${chestY - 14} Q 0 ${chestY - 6} 15 ${chestY - 14}`} fill="none" stroke="#0f172a" strokeWidth="1.6" />
        <line x1="0" y1={chestY - 4} x2="0" y2={chestY + 30} stroke={theme.apparelShadow} strokeWidth="1.4" opacity="0.6" />
        <path d={`M -18 ${chestY + 8} Q -4 ${chestY + 12} 0 ${chestY + 10} Q 4 ${chestY + 12} 18 ${chestY + 8}`} fill="none" stroke={theme.apparelShadow} strokeWidth="1.5" opacity="0.7" />

        {/* Chest Activation Heatmap Pulse */}
        {showGlow && (
          <ellipse cx="0" cy={chestY + 8} rx="28" ry="15" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.6 + progress * 0.35} />
        )}

        {/* Left Arm: Deltoid -> Bicep -> Forearm */}
        <path
          d={`M -34 ${chestY - 10} C ${-38 - elbowFlare} ${chestY + 18}, ${-handX - 8} 185, -${handX} 205`}
          fill="none"
          stroke="url(#limbGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <HumanHand x={-handX} y={205} grip={false} theme={theme} scale={1.2} hasWatch={true} />

        {/* Right Arm: Deltoid -> Bicep -> Forearm */}
        <path
          d={`M 34 ${chestY - 10} C ${38 + elbowFlare} ${chestY + 18}, ${handX + 8} 185, ${handX} 205`}
          fill="none"
          stroke="url(#limbGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <HumanHand x={handX} y={205} grip={false} theme={theme} scale={1.2} />

        {/* Form Angle Telemetry */}
        <path
          d={`M -32 ${chestY - 10} L ${-34 - elbowFlare} ${chestY + 18} L -${handX} 205`}
          stroke={showMistake ? '#f43f5e' : '#10b981'}
          strokeWidth="2"
          strokeDasharray="4 3"
          fill="none"
        />
        <text x={-handX - 56} y={chestY + 22} fill={showMistake ? '#f43f5e' : '#10b981'} fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          {showMistake ? 'Flared 90° ❌' : '45° Arrow ✅'}
        </text>
      </g>
    );
  }

  // Side View (High-Fidelity Athletic Pushup Kinematics)
  const headX = 105;
  const headY = 114 + yDrop;
  const shoulderX = 138;
  const shoulderY = 124 + yDrop;
  const hipX = 222;
  const hipY = 134 + yDrop + mistakeSag;
  const kneeX = 278;
  const kneeY = 160 + (mistakeSag * 0.5);
  const footX = 332;
  const footY = 195;

  const handX = 138;
  const handY = 205;
  const elbowX = 168 - (progress * 18);
  const elbowY = 162 + (progress * 14);

  return (
    <g>
      {/* Studio Floor & Dynamic Shadow */}
      <line x1="50" y1="205" x2="370" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />
      <ellipse cx={230} cy="207" rx={120} ry="10" fill="#000000" opacity={0.3 + progress * 0.25} filter="url(#contactShadow)" />

      {/* Far Sneaker (Slight 3D depth offset) */}
      <HumanSneaker x={footX + 5} y={footY + 2} facingLeft={true} angle={15} theme={theme} scale={0.92} />

      {/* Far Leg */}
      <path
        d={`M ${hipX} ${hipY} L ${kneeX + 4} ${kneeY + 2} L ${footX + 4} ${footY + 2}`}
        fill="none"
        stroke={theme.shortsShadow}
        strokeWidth="15"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Muscular Torso Silhouette with Athletic Compression Tank */}
      <path
        d={`M ${shoulderX} ${shoulderY} C ${shoulderX + 30} ${shoulderY - 5}, ${hipX - 30} ${hipY - 10 + mistakeSag}, ${hipX} ${hipY}`}
        fill="none"
        stroke={showMistake ? 'url(#mistakeGrad)' : 'url(#tankGrad)'}
        strokeWidth="25"
        strokeLinecap="round"
      />

      {/* Pectoral Side Contour */}
      <path
        d={`M ${shoulderX - 5} ${shoulderY + 2} Q ${shoulderX + 6} ${shoulderY + 12} ${shoulderX + 18} ${shoulderY + 6}`}
        fill="none"
        stroke={theme.apparelShadow}
        strokeWidth="2"
      />

      {/* Near Thigh (Quadriceps / Hamstring Contour) */}
      <path
        d={`M ${hipX} ${hipY} C ${hipX + 25} ${hipY + 8}, ${kneeX - 10} ${kneeY - 4}, ${kneeX} ${kneeY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="19"
        strokeLinecap="round"
      />
      {/* Side Racing Stripe on Shorts */}
      <path
        d={`M ${hipX} ${hipY} Q ${hipX + 22} ${hipY + 5} ${kneeX - 4} ${kneeY - 2}`}
        fill="none"
        stroke={theme.shortsAccent}
        strokeWidth="2"
      />

      {/* Sculpted Calf & Shin */}
      <path
        d={`M ${kneeX} ${kneeY} C ${kneeX + 20} ${kneeY + 14}, ${footX - 15} ${footY - 8}, ${footX} ${footY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Near Sneaker on Toe */}
      <HumanSneaker x={footX} y={footY} facingLeft={true} angle={18} theme={theme} scale={1.05} />

      {/* Chest & Tricep Activation Heatmap Glow */}
      {showGlow && (
        <circle cx={shoulderX + 12} cy={shoulderY + 6} r="20" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.65 + progress * 0.3} />
      )}

      {/* Arm Kinematics: Shoulder Deltoid -> Bicep -> Elbow -> Forearm -> Hand */}
      <ellipse cx={shoulderX} cy={shoulderY} rx="10" ry="9" fill="url(#skinGrad)" stroke={theme.skinDeepShadow} strokeWidth="0.8" />
      <path
        d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${handX} ${handY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stable Grounded Hand with Smartwatch */}
      <HumanHand x={handX} y={handY} grip={false} theme={theme} scale={1.2} hasWatch={true} />

      {/* Head Profile */}
      <HumanHeadSide
        x={headX}
        y={headY}
        facingLeft={true}
        scale={0.92}
        theme={theme}
        characterType={characterType}
      />

      {/* Neutral Spine Laser Line / Form Indicator */}
      <line
        x1={headX - 10}
        y1={headY + 15}
        x2={footX + 10}
        y2={footY}
        stroke={showMistake ? '#f43f5e' : '#10b981'}
        strokeWidth="1.8"
        strokeDasharray="5 3"
        opacity="0.8"
      />
      <text x="180" y="75" fill={showMistake ? '#f43f5e' : '#10b981'} fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        {showMistake ? '❌ Hip Sag / Broken Core' : '✅ Rigid Neutral Spine Alignment'}
      </text>
    </g>
  );
};

/* =========================================================================
   2. SQUAT KINEMATIC MODEL (Side & Front View)
========================================================================= */
export const SquatCharacter: React.FC<KinematicProps> = ({
  progress,
  viewAngle,
  theme,
  characterType,
  showMistake,
  showGlow
}) => {
  const depth = progress * 62;
  const torsoLean = progress * 16;
  const kneeValgus = showMistake ? Math.sin(progress * Math.PI) * 16 : 0;

  if (viewAngle === 'front') {
    const standWidth = 36;
    const kneeX = standWidth + 10 - kneeValgus;
    const hipY = 125 + depth;
    const headY = hipY - 78;

    return (
      <g transform="translate(200, 0)">
        {/* Floor Horizon & Shadow */}
        <ellipse cx="0" cy="208" rx={60 + progress * 10} ry="10" fill="#000000" opacity="0.3" filter="url(#contactShadow)" />
        <line x1="-150" y1="205" x2="150" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />

        {/* Head */}
        <HumanHeadFront x={0} y={headY} scale={0.92} theme={theme} characterType={characterType} />

        {/* Upper Body Torso */}
        <path
          d={`M -26 ${headY + 26} C -30 ${hipY - 25}, -22 ${hipY - 10}, -18 ${hipY} L 18 ${hipY} C 22 ${hipY - 10}, 30 ${hipY - 25}, 26 ${headY + 26} Z`}
          fill="url(#tankGrad)"
          stroke="#0f172a"
          strokeWidth="1.2"
        />

        {/* Chest & Deltoids */}
        <ellipse cx="-28" cy={headY + 28} rx="10" ry="8" fill="url(#skinGrad)" stroke={theme.skinDeepShadow} strokeWidth="0.8" />
        <ellipse cx="28" cy={headY + 28} rx="10" ry="8" fill="url(#skinGrad)" stroke={theme.skinDeepShadow} strokeWidth="0.8" />

        {/* Hands in Athletic Prayer / Counterbalance Stance */}
        <path
          d={`M -28 ${headY + 30} Q -18 ${headY + 50} 0 ${headY + 46}`}
          fill="none"
          stroke="url(#limbGrad)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M 28 ${headY + 30} Q 18 ${headY + 50} 0 ${headY + 46}`}
          fill="none"
          stroke="url(#limbGrad)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <HumanHand x={0} y={headY + 46} grip={true} theme={theme} scale={1.1} />

        {/* Athletic Shorts */}
        <path
          d={`M -20 ${hipY} L -26 ${hipY + 24} L 0 ${hipY + 18} L 26 ${hipY + 24} L 20 ${hipY} Z`}
          fill="url(#shortsGrad)"
          stroke="#0f172a"
          strokeWidth="1.2"
        />

        {/* Quads Activation Heatmap Glow */}
        {showGlow && (
          <>
            <ellipse cx={-kneeX / 2 - 4} cy={hipY + 28} rx="16" ry="22" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.6 + progress * 0.35} />
            <ellipse cx={kneeX / 2 + 4} cy={hipY + 28} rx="16" ry="22" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.6 + progress * 0.35} />
          </>
        )}

        {/* Left Leg: Hip -> Knee -> Foot */}
        <path
          d={`M -18 ${hipY + 12} L -${kneeX} ${hipY + 42} L -${standWidth} 200`}
          fill="none"
          stroke="url(#limbGrad)"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <HumanSneaker x={-standWidth} y={200} facingLeft={true} theme={theme} scale={1.05} />

        {/* Right Leg: Hip -> Knee -> Foot */}
        <path
          d={`M 18 ${hipY + 12} L ${kneeX} ${hipY + 42} L ${standWidth} 200`}
          fill="none"
          stroke="url(#limbGrad)"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <HumanSneaker x={standWidth} y={200} facingLeft={false} theme={theme} scale={1.05} />

        {/* Knee Tracking Indicators */}
        <text x="-90" y="195" fill={showMistake ? '#f43f5e' : '#10b981'} fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          {showMistake ? '❌ Valgus Knee Cave' : '✅ Knees Tracking Toes'}
        </text>
      </g>
    );
  }

  // Side View (High-Fidelity Squat Kinematics)
  const hipX = 220 - (progress * 35);
  const hipY = 120 + depth;
  const kneeX = 180 + (progress * 12);
  const kneeY = 158 + (progress * 18);
  const footX = 175;
  const footY = 200;

  const shoulderX = hipX - 25 + (progress * torsoLean);
  const shoulderY = hipY - 65;
  const headX = shoulderX - 10;
  const headY = shoulderY - 26;

  const handX = shoulderX - 35;
  const handY = shoulderY + 20;

  return (
    <g>
      {/* Studio Floor & Dynamic Shadow */}
      <line x1="80" y1="205" x2="320" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />
      <ellipse cx={hipX - 10} cy="207" rx={65} ry="10" fill="#000000" opacity="0.32" filter="url(#contactShadow)" />

      {/* Quadriceps & Glute Muscle Activation Glow */}
      {showGlow && (
        <>
          {/* Gluteus Glow */}
          <circle cx={hipX + 10} cy={hipY} r="22" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.6 + progress * 0.35} />
          {/* Quad Glow */}
          <ellipse cx={(hipX + kneeX) / 2} cy={(hipY + kneeY) / 2} rx="22" ry="14" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.6 + progress * 0.35} />
        </>
      )}

      {/* Muscular Torso & Tank */}
      <path
        d={`M ${shoulderX} ${shoulderY} C ${shoulderX + 5} ${shoulderY + 25}, ${hipX - 10} ${hipY - 25}, ${hipX} ${hipY}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Athletic Shorts */}
      <path
        d={`M ${hipX} ${hipY} C ${hipX - 10} ${hipY + 15}, ${kneeX + 15} ${kneeY - 10}, ${kneeX} ${kneeY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="20"
        strokeLinecap="round"
      />
      {/* Shorts Stripe */}
      <path
        d={`M ${hipX + 4} ${hipY} Q ${hipX - 2} ${hipY + 12} ${kneeX + 8} ${kneeY - 4}`}
        fill="none"
        stroke={theme.shortsAccent}
        strokeWidth="2"
      />

      {/* Lower Leg (Shin & Sculpted Calf) */}
      <path
        d={`M ${kneeX} ${kneeY} C ${kneeX - 2} ${kneeY + 20}, ${footX + 5} ${footY - 15}, ${footX} ${footY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="15"
        strokeLinecap="round"
      />

      {/* Sneaker Flat on Floor */}
      <HumanSneaker x={footX} y={footY} facingLeft={true} theme={theme} scale={1.05} />

      {/* Counterbalance Arms: Shoulder -> Elbow -> Hands */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${shoulderX - 20} ${shoulderY + 12} L ${handX} ${handY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={handX} y={handY} grip={true} theme={theme} scale={1.1} />

      {/* Head Profile */}
      <HumanHeadSide x={headX} y={headY} facingLeft={true} scale={0.92} theme={theme} characterType={characterType} />

      {/* 90° Squat Depth Angle Telemetry Gauge */}
      <path
        d={`M ${hipX} ${hipY} L ${kneeX} ${kneeY} L ${footX} ${footY}`}
        stroke={showMistake ? '#f43f5e' : '#10b981'}
        strokeWidth="2"
        strokeDasharray="4 3"
        fill="none"
      />
      <text x={kneeX + 25} y={kneeY - 10} fill={showMistake ? '#f43f5e' : '#10b981'} fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        {progress > 0.75 ? '90° Thigh Parallel ✅' : 'Controlled Descent'}
      </text>
    </g>
  );
};

/* =========================================================================
   3. PLANK & CORE KINEMATIC MODEL
========================================================================= */
export const PlankCharacter: React.FC<KinematicProps> = ({
  progress,
  viewAngle,
  theme,
  characterType,
  showMistake,
  showGlow
}) => {
  const breath = Math.sin(progress * Math.PI * 2) * 2;
  const mistakeSag = showMistake ? 22 : 0;

  const headX = 100;
  const headY = 125;
  const shoulderX = 135;
  const shoulderY = 135;
  const hipX = 225;
  const hipY = 145 + mistakeSag + breath;
  const footX = 330;
  const footY = 195;

  const elbowX = 135;
  const elbowY = 195;
  const handX = 105;
  const handY = 195;

  return (
    <g>
      {/* Studio Floor */}
      <line x1="50" y1="195" x2="370" y2="195" stroke="#475569" strokeWidth="2.5" opacity="0.6" />
      <ellipse cx="220" cy="197" rx="125" ry="10" fill="#000000" opacity="0.32" filter="url(#contactShadow)" />

      {/* Core Muscle Heatmap Activation Glow */}
      {showGlow && (
        <ellipse cx="180" cy={140 + mistakeSag} rx="35" ry="16" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity="0.8" />
      )}

      {/* Legs */}
      <path
        d={`M ${hipX} ${hipY} L 275 168 L ${footX} ${footY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d={`M 275 168 L ${footX} ${footY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <HumanSneaker x={footX} y={footY} facingLeft={true} angle={18} theme={theme} scale={1.05} />

      {/* Torso */}
      <path
        d={`M ${shoulderX} ${shoulderY} C 165 ${138 + mistakeSag}, 195 ${142 + mistakeSag}, ${hipX} ${hipY}`}
        fill="none"
        stroke={showMistake ? 'url(#mistakeGrad)' : 'url(#tankGrad)'}
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Forearm Plank Support: Shoulder -> Elbow -> Grounded Forearm */}
      <ellipse cx={shoulderX} cy={shoulderY} rx="10" ry="9" fill="url(#skinGrad)" stroke={theme.skinDeepShadow} strokeWidth="0.8" />
      <path
        d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${handX} ${handY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={handX} y={handY} grip={true} theme={theme} scale={1.1} hasWatch={true} />

      {/* Head Profile */}
      <HumanHeadSide x={headX} y={headY} facingLeft={true} scale={0.92} theme={theme} characterType={characterType} />

      {/* Laser Alignment Line */}
      <line x1={headX - 10} y1={headY + 15} x2={footX + 10} y2={footY} stroke={showMistake ? '#f43f5e' : '#10b981'} strokeWidth="1.8" strokeDasharray="5 3" />
      <text x="170" y="85" fill={showMistake ? '#f43f5e' : '#10b981'} fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        {showMistake ? '❌ Hip Sagging / Inactive Core' : '✅ 360° Cylindrical Core Brace'}
      </text>
    </g>
  );
};

/* =========================================================================
   4. LUNGE KINEMATIC MODEL
========================================================================= */
export const LungeCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showMistake,
  showGlow
}) => {
  const depth = progress * 40;
  const hipY = 120 + depth;
  const frontKneeX = 145;
  const frontKneeY = 160 + depth;
  const frontFootX = 145;
  const frontFootY = 200;

  const backKneeX = 235;
  const backKneeY = 165 + depth;
  const backFootX = 275;
  const backFootY = 195;

  const shoulderX = 190;
  const shoulderY = hipY - 65;
  const headX = shoulderX - 5;
  const headY = shoulderY - 26;

  return (
    <g>
      {/* Studio Floor */}
      <line x1="80" y1="205" x2="320" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />
      <ellipse cx="205" cy="207" rx="80" ry="10" fill="#000000" opacity="0.32" filter="url(#contactShadow)" />

      {/* Muscle Heatmap */}
      {showGlow && (
        <ellipse cx={frontKneeX + 15} cy={frontKneeY - 10} rx="18" ry="24" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.7 + progress * 0.25} />
      )}

      {/* Back Leg (Trailing) */}
      <path
        d={`M 195 ${hipY} L ${backKneeX} ${backKneeY} L ${backFootX} ${backFootY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanSneaker x={backFootX} y={backFootY} facingLeft={true} angle={25} theme={theme} scale={0.95} />

      {/* Muscular Torso */}
      <path
        d={`M ${shoulderX} ${shoulderY} C ${shoulderX} ${shoulderY + 25}, 190 ${hipY - 25}, 190 ${hipY}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Front Leg (Leading) */}
      <path
        d={`M 190 ${hipY} L ${frontKneeX} ${frontKneeY} L ${frontFootX} ${frontFootY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${frontKneeX} ${frontKneeY} L ${frontFootX} ${frontFootY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <HumanSneaker x={frontFootX} y={frontFootY} facingLeft={true} theme={theme} scale={1.05} />

      {/* Hands on Hips */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${shoulderX - 18} ${shoulderY + 28} L 186 ${hipY - 8}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={186} y={hipY - 8} grip={true} theme={theme} scale={1.1} />

      {/* Head */}
      <HumanHeadSide x={headX} y={headY} facingLeft={true} scale={0.92} theme={theme} characterType={characterType} />

      <text x="140" y="80" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        ✅ 90° / 90° Dual Knee Geometry
      </text>
    </g>
  );
};

/* =========================================================================
   5. GLUTE BRIDGE KINEMATIC MODEL
========================================================================= */
export const GluteBridgeCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const lift = progress * 42;
  const shoulderX = 110;
  const shoulderY = 190;
  const hipX = 185;
  const hipY = 190 - lift;
  const kneeX = 250;
  const kneeY = 145 - (lift * 0.2);
  const footX = 265;
  const footY = 195;

  return (
    <g>
      {/* Studio Floor */}
      <line x1="50" y1="195" x2="350" y2="195" stroke="#475569" strokeWidth="2.5" opacity="0.6" />

      {/* Glute Activation Glow */}
      {showGlow && (
        <circle cx={hipX} cy={hipY} r="24" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.6 + progress * 0.35} />
      )}

      {/* Head on Floor */}
      <HumanHeadSide x={85} y={185} facingLeft={false} scale={0.92} theme={theme} characterType={characterType} />

      {/* Grounded Arms */}
      <path d={`M ${shoulderX} ${shoulderY} L 160 195 L 180 195`} fill="none" stroke="url(#limbGrad)" strokeWidth="13" strokeLinecap="round" />
      <HumanHand x={180} y={195} grip={false} theme={theme} scale={1.1} />

      {/* Torso Bridge Line */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${hipX} ${hipY}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Thighs & Glutes */}
      <path
        d={`M ${hipX} ${hipY} L ${kneeX} ${kneeY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="20"
        strokeLinecap="round"
      />

      {/* Calves to Ground */}
      <path
        d={`M ${kneeX} ${kneeY} L ${footX} ${footY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <HumanSneaker x={footX} y={footY} facingLeft={true} theme={theme} scale={1.05} />

      <text x="135" y="90" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        ✅ Posterior Chain Apex Squeeze
      </text>
    </g>
  );
};

/* =========================================================================
   6. CHAIR DIP KINEMATIC MODEL
========================================================================= */
export const ChairDipCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const yDrop = progress * 38;
  const shoulderX = 145;
  const shoulderY = 120 + yDrop;
  const hipX = 160;
  const hipY = 150 + yDrop;
  const kneeX = 210;
  const kneeY = 155 + yDrop;
  const footX = 250;
  const footY = 200;

  const benchX = 110;
  const elbowX = 125;
  const elbowY = 135 + (progress * 15);

  return (
    <g>
      {/* Studio Floor & Bench */}
      <line x1="60" y1="205" x2="340" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />
      {/* Sturdy Training Bench */}
      <rect x={benchX - 25} y={150} width="50" height="55" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />

      {/* Triceps Activation Glow */}
      {showGlow && (
        <circle cx={elbowX} cy={elbowY} r="18" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.7 + progress * 0.25} />
      )}

      {/* Torso */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${hipX} ${hipY}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Legs */}
      <path
        d={`M ${hipX} ${hipY} L ${kneeX} ${kneeY} L ${footX} ${footY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanSneaker x={footX} y={footY} facingLeft={true} theme={theme} scale={1.05} />

      {/* Arms Braced on Bench: Shoulder -> Elbow -> Hand on Bench Edge */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${benchX + 22} 150`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={benchX + 22} y={150} grip={true} theme={theme} scale={1.1} />

      {/* Head */}
      <HumanHeadSide x={shoulderX} y={shoulderY - 26} facingLeft={true} scale={0.92} theme={theme} characterType={characterType} />

      <text x="140" y="70" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        ✅ 90° Tricep Lock & Open Chest
      </text>
    </g>
  );
};

/* =========================================================================
   7. DUMBBELL / BACK ROW KINEMATIC MODEL
========================================================================= */
export const DumbbellRowCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const pull = progress * 36;
  const shoulderX = 145;
  const shoulderY = 125;
  const hipX = 220;
  const hipY = 140;
  const kneeX = 230;
  const kneeY = 175;
  const footX = 235;
  const footY = 205;

  const elbowX = 165 + (progress * 15);
  const elbowY = 160 - pull;
  const handX = 155;
  const handY = 195 - pull;

  return (
    <g>
      {/* Studio Floor */}
      <line x1="80" y1="205" x2="320" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />

      {/* Latissimus Dorsi Back Glow */}
      {showGlow && (
        <ellipse cx="180" cy="130" rx="26" ry="14" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.6 + progress * 0.35} />
      )}

      {/* Legs (Hinged at hips) */}
      <path
        d={`M ${hipX} ${hipY} L ${kneeX} ${kneeY} L ${footX} ${footY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="19"
        strokeLinecap="round"
      />
      <HumanSneaker x={footX} y={footY} facingLeft={true} theme={theme} scale={1.05} />

      {/* Torso Hinged at 45° */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${hipX} ${hipY}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Rowing Arm: Shoulder -> Elbow -> Hand gripping dumbbell */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${handX} ${handY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={handX} y={handY} grip={true} theme={theme} scale={1.1} />

      {/* Ergonomic Cast Iron Dumbbell */}
      <g transform={`translate(${handX}, ${handY})`}>
        <rect x="-14" y="-3" width="28" height="6" rx="2" fill="#334155" />
        <rect x="-18" y="-9" width="8" height="18" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
        <rect x="10" y="-9" width="8" height="18" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
      </g>

      {/* Head */}
      <HumanHeadSide x={shoulderX - 10} y={shoulderY - 24} facingLeft={true} scale={0.92} theme={theme} characterType={characterType} />

      <text x="135" y="80" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        ✅ Scapular Retraction & Elbow Drive
      </text>
    </g>
  );
};

/* =========================================================================
   8. MOUNTAIN CLIMBER KINEMATIC MODEL
========================================================================= */
export const MountainClimberCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const kneeDrive = Math.sin(progress * Math.PI * 2);
  const activeKneeX = 190 - (kneeDrive * 40);
  const activeKneeY = 175 - (Math.abs(kneeDrive) * 20);

  const headX = 95;
  const headY = 115;
  const shoulderX = 130;
  const shoulderY = 125;
  const hipX = 220;
  const hipY = 140;

  return (
    <g>
      {/* Studio Floor */}
      <line x1="50" y1="205" x2="370" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />

      {/* Core Glow */}
      {showGlow && (
        <ellipse cx="175" cy="140" rx="30" ry="16" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity="0.75" />
      )}

      {/* Back Extended Leg */}
      <path d={`M ${hipX} ${hipY} L 275 168 L 330 195`} fill="none" stroke="url(#shortsGrad)" strokeWidth="18" strokeLinecap="round" />
      <HumanSneaker x={330} y={195} facingLeft={true} angle={18} theme={theme} scale={1.0} />

      {/* Dynamic Driving Leg (Cycling knee to chest) */}
      <path
        d={`M ${hipX} ${hipY} L ${activeKneeX} ${activeKneeY} L ${activeKneeX + 30} 190`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanSneaker x={activeKneeX + 30} y={190} facingLeft={true} theme={theme} scale={1.05} />

      {/* Torso */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${hipX} ${hipY}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Straight Support Arms */}
      <path d={`M ${shoulderX} ${shoulderY} L 130 205`} fill="none" stroke="url(#limbGrad)" strokeWidth="14" strokeLinecap="round" />
      <HumanHand x={130} y={205} grip={false} theme={theme} scale={1.2} />

      {/* Head */}
      <HumanHeadSide x={headX} y={headY} facingLeft={true} scale={0.92} theme={theme} characterType={characterType} />

      <text x="140" y="75" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        ✅ Explosive Knee Drive & Stable Hips
      </text>
    </g>
  );
};

/* =========================================================================
   9. LAT PULLDOWN / PULL-APART KINEMATIC MODEL
========================================================================= */
export const LatPulldownCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const pull = progress * 40;
  const elbowY = 95 + pull;
  const handY = 70 + pull;

  return (
    <g transform="translate(200, 0)">
      {/* Studio Floor */}
      <line x1="-120" y1="205" x2="120" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />

      {/* Lats Activation Glow */}
      {showGlow && (
        <ellipse cx="0" cy="115" rx="38" ry="20" fill="url(#primaryMuscleHeat)" filter="url(#muscleGlow)" opacity={0.6 + progress * 0.35} />
      )}

      {/* Head Front */}
      <HumanHeadFront x={0} y={65} scale={0.92} theme={theme} characterType={characterType} />

      {/* Muscular Torso & V-Taper Back */}
      <path
        d="M -30 90 C -34 125, -24 150, -20 165 L 20 165 C 24 150, 34 125, 30 90 Z"
        fill="url(#tankGrad)"
        stroke="#0f172a"
        strokeWidth="1.2"
      />

      {/* Athletic Shorts & Seated Stance */}
      <path d="M -22 165 L -34 200 L 34 200 L 22 165 Z" fill="url(#shortsGrad)" stroke="#0f172a" strokeWidth="1.2" />

      {/* Resistance Band / Bar Overhead */}
      <line x1="-70" y1={handY} x2="70" y2={handY} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />

      {/* Left Arm Pull: Shoulder -> Flare Elbow -> Hand */}
      <path
        d={`M -28 92 L -52 ${elbowY} L -45 ${handY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={-45} y={handY} grip={true} theme={theme} scale={1.1} />

      {/* Right Arm Pull: Shoulder -> Flare Elbow -> Hand */}
      <path
        d={`M 28 92 L 52 ${elbowY} L 45 ${handY}`}
        fill="none"
        stroke="url(#limbGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={45} y={handY} grip={true} theme={theme} scale={1.1} />

      <text x="-75" y="35" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        ✅ Squeeze Latissimus Dorsi to Pockets
      </text>
    </g>
  );
};

/* =========================================================================
   10. BURPEE KINEMATIC MODEL
========================================================================= */
export const BurpeeCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  // 3-phase burpee cycle (Jump -> Drop to Plank -> Jump)
  const isJumping = progress > 0.75;
  const isFloor = progress > 0.25 && progress <= 0.6;

  if (isFloor) {
    return <PushupCharacter progress={0.5} viewAngle="side" colors={{}} theme={theme} characterType={characterType} showMistake={false} showGlow={showGlow} />;
  }

  const jumpHeight = isJumping ? (progress - 0.75) * 4 * 45 : 0;
  const yBase = 160 - jumpHeight;

  return (
    <g transform="translate(200, 0)">
      {/* Studio Floor & Dynamic Jumping Shadow */}
      <line x1="-120" y1="205" x2="120" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />
      <ellipse cx="0" cy="207" rx={45 - jumpHeight * 0.4} ry={8 - jumpHeight * 0.1} fill="#000000" opacity={0.35 - jumpHeight * 0.005} filter="url(#contactShadow)" />

      {/* Head Front */}
      <HumanHeadFront x={0} y={yBase - 85} scale={0.92} theme={theme} characterType={characterType} />

      {/* Torso */}
      <path
        d={`M -25 ${yBase - 55} C -28 ${yBase - 25}, -20 ${yBase - 5}, -18 ${yBase} L 18 ${yBase} C 20 ${yBase - 5}, 28 ${yBase - 25}, 25 ${yBase - 55} Z`}
        fill="url(#tankGrad)"
        stroke="#0f172a"
        strokeWidth="1.2"
      />

      {/* Overhead Explosive Reach Arms */}
      <path d={`M -25 ${yBase - 50} L -35 ${yBase - 100}`} fill="none" stroke="url(#limbGrad)" strokeWidth="13" strokeLinecap="round" />
      <HumanHand x={-35} y={yBase - 100} grip={false} theme={theme} scale={1.1} />

      <path d={`M 25 ${yBase - 50} L 35 ${yBase - 100}`} fill="none" stroke="url(#limbGrad)" strokeWidth="13" strokeLinecap="round" />
      <HumanHand x={35} y={yBase - 100} grip={false} theme={theme} scale={1.1} />

      {/* Legs */}
      <path d={`M -15 ${yBase} L -22 195`} fill="none" stroke="url(#shortsGrad)" strokeWidth="16" strokeLinecap="round" />
      <HumanSneaker x={-22} y={195 - jumpHeight} facingLeft={true} theme={theme} scale={1.05} />

      <path d={`M 15 ${yBase} L 22 195`} fill="none" stroke="url(#shortsGrad)" strokeWidth="16" strokeLinecap="round" />
      <HumanSneaker x={22} y={195 - jumpHeight} facingLeft={false} theme={theme} scale={1.05} />

      <text x="-65" y="40" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        ✅ Explosive Triple Extension
      </text>
    </g>
  );
};

/* =========================================================================
   11. GENERIC ATHLETIC / CARDIO KINEMATIC MODEL
========================================================================= */
export const GenericAthleticCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const bounce = Math.sin(progress * Math.PI * 2) * 8;
  const yBase = 150 + bounce;

  return (
    <g transform="translate(200, 0)">
      {/* Studio Floor & Shadow */}
      <line x1="-120" y1="205" x2="120" y2="205" stroke="#475569" strokeWidth="2.5" opacity="0.6" />
      <ellipse cx="0" cy="207" rx="55" ry="9" fill="#000000" opacity="0.3" filter="url(#contactShadow)" />

      {/* Head */}
      <HumanHeadFront x={0} y={yBase - 82} scale={0.92} theme={theme} characterType={characterType} />

      {/* Torso */}
      <path
        d={`M -25 ${yBase - 55} C -28 ${yBase - 25}, -20 ${yBase - 5}, -18 ${yBase} L 18 ${yBase} C 20 ${yBase - 5}, 28 ${yBase - 25}, 25 ${yBase - 55} Z`}
        fill="url(#tankGrad)"
        stroke="#0f172a"
        strokeWidth="1.2"
      />

      {/* Arms in Athletic Running Motion */}
      <path d={`M -25 ${yBase - 50} L -38 ${yBase - 15}`} fill="none" stroke="url(#limbGrad)" strokeWidth="13" strokeLinecap="round" />
      <HumanHand x={-38} y={yBase - 15} grip={true} theme={theme} scale={1.1} />

      <path d={`M 25 ${yBase - 50} L 38 ${yBase - 15}`} fill="none" stroke="url(#limbGrad)" strokeWidth="13" strokeLinecap="round" />
      <HumanHand x={38} y={yBase - 15} grip={true} theme={theme} scale={1.1} />

      {/* Legs */}
      <path d={`M -15 ${yBase} L -22 195`} fill="none" stroke="url(#shortsGrad)" strokeWidth="17" strokeLinecap="round" />
      <HumanSneaker x={-22} y={195} facingLeft={true} theme={theme} scale={1.05} />

      <path d={`M 15 ${yBase} L 22 195`} fill="none" stroke="url(#shortsGrad)" strokeWidth="17" strokeLinecap="round" />
      <HumanSneaker x={22} y={195} facingLeft={false} theme={theme} scale={1.05} />

      <text x="-65" y="45" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        ✅ Steady Rhythm & Controlled Breathing
      </text>
    </g>
  );
};
