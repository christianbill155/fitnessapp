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
  const yDrop = progress * 46;
  const mistakeSag = showMistake ? Math.sin(progress * Math.PI) * 20 : 0;

  if (viewAngle === 'front') {
    const elbowFlare = 28 + (showMistake ? 26 : 8) * progress;
    const handX = 54;
    const chestY = 120 + yDrop;

    return (
      <g transform="translate(200, 0)">
        {/* Floor Horizon line */}
        <line x1="-160" y1="210" x2="160" y2="210" stroke="#334155" strokeWidth="2.5" strokeDasharray="6 4" />

        {/* Head Front */}
        <HumanHeadFront
          x={0}
          y={chestY - 48}
          scale={0.9}
          theme={theme}
          characterType={characterType}
        />

        {/* Muscular Shoulders (Deltoids) */}
        <ellipse cx={-34} cy={chestY - 14} rx="12" ry="9" fill="url(#skinGrad)" stroke={theme.skinShadow} strokeWidth="0.8" />
        <ellipse cx={34} cy={chestY - 14} rx="12" ry="9" fill="url(#skinGrad)" stroke={theme.skinShadow} strokeWidth="0.8" />

        {/* Torso & Athletic Tank Top */}
        <path
          d={`M -30 ${chestY - 14} C -34 ${chestY + 15}, -24 ${chestY + 45}, -20 ${chestY + 60} L 20 ${chestY + 60} C 24 ${chestY + 45}, 34 ${chestY + 15}, 30 ${chestY - 14} Z`}
          fill="url(#tankGrad)"
          stroke="#0f172a"
          strokeWidth="1.2"
        />

        {/* Tank Collar and Pectoral Contours */}
        <path d={`M -14 ${chestY - 14} Q 0 ${chestY - 6} 14 ${chestY - 14}`} fill="none" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="0" y1={chestY - 4} x2="0" y2={chestY + 28} stroke={theme.apparelShadow} strokeWidth="1.2" opacity="0.6" />
        <path d={`M -16 ${chestY + 8} Q -4 ${chestY + 12} 0 ${chestY + 10} Q 4 ${chestY + 12} 16 ${chestY + 8}`} fill="none" stroke={theme.apparelShadow} strokeWidth="1.4" opacity="0.7" />

        {/* Chest Activation Glow */}
        {showGlow && (
          <ellipse cx="0" cy={chestY + 8} rx="26" ry="14" fill="#10b981" opacity="0.65" filter="url(#muscleGlow)" />
        )}

        {/* Left Arm (Bicep -> Forearm -> Hand) */}
        <path
          d={`M -32 ${chestY - 10} C ${-36 - elbowFlare} ${chestY + 15}, ${-handX - 10} 185, -${handX} 205`}
          fill="none"
          stroke="url(#skinGrad)"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <HumanHand x={-handX} y={205} grip={false} theme={theme} scale={1.2} />

        {/* Right Arm (Bicep -> Forearm -> Hand) */}
        <path
          d={`M 32 ${chestY - 10} C ${36 + elbowFlare} ${chestY + 15}, ${handX + 10} 185, ${handX} 205`}
          fill="none"
          stroke="url(#skinGrad)"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <HumanHand x={handX} y={205} grip={false} theme={theme} scale={1.2} />

        {/* Form Metric Angle Overlay */}
        <path
          d={`M -30 ${chestY - 10} L ${-30 - elbowFlare} ${chestY + 18} L -${handX} 205`}
          stroke={showMistake ? '#f43f5e' : '#38bdf8'}
          strokeWidth="2"
          strokeDasharray="4 3"
          fill="none"
        />
        <text x={-handX - 50} y={chestY + 20} fill={showMistake ? '#f43f5e' : '#38bdf8'} fontSize="10" fontFamily="monospace" fontWeight="bold">
          {showMistake ? 'Flared 90° ❌' : '45° Arrow ✅'}
        </text>
      </g>
    );
  }

  // Side View (High-Fidelity Plank & Press Kinematics)
  const headX = 105;
  const headY = 115 + yDrop;
  const shoulderX = 138;
  const shoulderY = 125 + yDrop;
  const hipX = 220;
  const hipY = 135 + yDrop + mistakeSag;
  const kneeX = 275;
  const kneeY = 160 + (mistakeSag * 0.5);
  const footX = 330;
  const footY = 195;

  const handX = 138;
  const handY = 205;
  const elbowX = 165 - (progress * 18);
  const elbowY = 160 + (progress * 12);

  return (
    <g>
      {/* Floor with depth shadow */}
      <line x1="60" y1="205" x2="360" y2="205" stroke="#334155" strokeWidth="3" />
      <line x1="70" y1="208" x2="350" y2="208" stroke="#1e293b" strokeWidth="1.5" />

      {/* Far Sneaker (Slight offset for 3D depth) */}
      <HumanSneaker x={footX + 4} y={footY + 2} facingLeft={true} angle={15} theme={theme} scale={0.9} />

      {/* Far Leg */}
      <path
        d={`M ${hipX} ${hipY} L ${kneeX + 4} ${kneeY + 2} L ${footX + 4} ${footY + 2}`}
        fill="none"
        stroke={theme.shortsShadow}
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Torso Silhouette with realistic chest & lumbar curvature */}
      <path
        d={`M ${shoulderX} ${shoulderY} C ${shoulderX + 30} ${shoulderY - 5}, ${hipX - 30} ${hipY - 10 + mistakeSag}, ${hipX} ${hipY}`}
        fill="none"
        stroke={showMistake ? 'url(#mistakeGrad)' : 'url(#tankGrad)'}
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Muscular Chest Pectoral contour on side */}
      <path
        d={`M ${shoulderX - 4} ${shoulderY + 2} Q ${shoulderX + 6} ${shoulderY + 12} ${shoulderX + 18} ${shoulderY + 6}`}
        fill="none"
        stroke={theme.apparelShadow}
        strokeWidth="2"
      />

      {/* Near Leg (Quadriceps & Hamstring curves) */}
      <path
        d={`M ${hipX} ${hipY} C ${hipX + 25} ${hipY + 8}, ${kneeX - 10} ${kneeY - 4}, ${kneeX} ${kneeY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      {/* Calf & Shin */}
      <path
        d={`M ${kneeX} ${kneeY} C ${kneeX + 20} ${kneeY + 14}, ${footX - 15} ${footY - 8}, ${footX} ${footY}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="13"
        strokeLinecap="round"
      />

      {/* Near Sneaker on Toe */}
      <HumanSneaker x={footX} y={footY} facingLeft={true} angle={18} theme={theme} scale={1.05} />

      {/* Chest Muscle Glow */}
      {showGlow && (
        <circle cx={shoulderX + 12} cy={shoulderY + 6} r="18" fill="#10b981" opacity="0.65" filter="url(#muscleGlow)" />
      )}

      {/* Arm Kinematics: Shoulder Deltoid -> Bicep -> Elbow -> Forearm -> Hand */}
      <ellipse cx={shoulderX} cy={shoulderY} rx="9" ry="8" fill="url(#skinGrad)" stroke={theme.skinShadow} strokeWidth="0.8" />
      <path
        d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${handX} ${handY}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Hand grounded with palm on floor */}
      <HumanHand x={handX} y={handY} grip={false} theme={theme} scale={1.2} />

      {/* Head Profile */}
      <HumanHeadSide
        x={headX}
        y={headY}
        facingLeft={true}
        scale={0.95}
        theme={theme}
        characterType={characterType}
      />

      {/* Articulation nodes */}
      <circle cx={shoulderX} cy={shoulderY} r="4.5" fill={theme.joints} />
      <circle cx={elbowX} cy={elbowY} r="4.5" fill={theme.joints} />
      <circle cx={hipX} cy={hipY} r="4.5" fill={theme.joints} />

      {/* Biomechanical Spine Alignment Laser */}
      <line
        x1={headX - 10}
        y1={headY + 10}
        x2={footX}
        y2={footY}
        stroke={showMistake ? '#f43f5e' : '#10b981'}
        strokeWidth="1.6"
        strokeDasharray="4 3"
      />
      <text x="210" y={hipY - 20} fill={showMistake ? '#f43f5e' : '#10b981'} fontSize="10" fontFamily="monospace" fontWeight="bold">
        {showMistake ? '❌ Lower Back Sagging' : '✅ 180° Rigid Plank Line'}
      </text>
    </g>
  );
};

/* =========================================================================
   2. BODYWEIGHT SQUAT KINEMATIC MODEL (Side & Front View)
========================================================================= */
export const SquatCharacter: React.FC<KinematicProps> = ({
  progress,
  viewAngle,
  theme,
  characterType,
  showMistake,
  showGlow
}) => {
  const hipDrop = progress * 62;
  const hipBack = progress * 38;
  const kneeForward = progress * 14;

  if (viewAngle === 'front') {
    const kneeValgus = showMistake ? -18 * progress : 14 * progress;
    const bodyY = 55 + hipDrop;

    return (
      <g transform="translate(200, 10)">
        {/* Floor */}
        <line x1="-140" y1="210" x2="140" y2="210" stroke="#334155" strokeWidth="2.5" />

        {/* Head */}
        <HumanHeadFront
          x={0}
          y={bodyY - 42}
          scale={0.95}
          theme={theme}
          characterType={characterType}
        />

        {/* Muscular Shoulders & Traps */}
        <ellipse cx={-30} cy={bodyY - 8} rx="10" ry="8" fill="url(#skinGrad)" />
        <ellipse cx={30} cy={bodyY - 8} rx="10" ry="8" fill="url(#skinGrad)" />

        {/* Torso Tank Top */}
        <path
          d={`M -28 ${bodyY - 8} C -32 ${bodyY + 20}, -24 ${bodyY + 45}, -20 ${bodyY + 58} L 20 ${bodyY + 58} C 24 ${bodyY + 45}, 32 ${bodyY + 20}, 28 ${bodyY - 8} Z`}
          fill="url(#tankGrad)"
          stroke="#0f172a"
          strokeWidth="1.2"
        />

        {/* Arms clasped in front of chest in athletic prayer posture */}
        <path
          d={`M -26 ${bodyY - 4} Q -20 ${bodyY + 18} 0 ${bodyY + 16} Q 20 ${bodyY + 18} 26 ${bodyY - 4}`}
          fill="none"
          stroke="url(#skinGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <HumanHand x={0} y={bodyY + 16} grip={true} theme={theme} scale={1.1} />

        {/* Athletic Shorts */}
        <path
          d={`M -22 ${bodyY + 56} L -30 ${bodyY + 85} L -6 ${bodyY + 88} L 0 ${bodyY + 68} L 6 ${bodyY + 88} L 30 ${bodyY + 85} L 22 ${bodyY + 56} Z`}
          fill="url(#shortsGrad)"
          stroke="#0f172a"
          strokeWidth="1"
        />

        {/* Left Leg: Quad -> Knee -> Calf -> Sneaker */}
        <path
          d={`M -18 ${bodyY + 85} C ${-28 - kneeValgus} ${bodyY + 105}, ${-32} 175, -34 195`}
          fill="none"
          stroke="url(#skinGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <HumanSneaker x={-36} y={202} facingLeft={true} angle={-5} theme={theme} scale={1.05} />

        {/* Right Leg: Quad -> Knee -> Calf -> Sneaker */}
        <path
          d={`M 18 ${bodyY + 85} C ${28 + kneeValgus} ${bodyY + 105}, ${32} 175, 34 195`}
          fill="none"
          stroke="url(#skinGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <HumanSneaker x={36} y={202} facingLeft={false} angle={5} theme={theme} scale={1.05} />

        {/* Quad Muscle Glow */}
        {showGlow && (
          <>
            <ellipse cx={-28} cy={bodyY + 95} rx="12" ry="16" fill="#10b981" opacity="0.6" filter="url(#muscleGlow)" />
            <ellipse cx={28} cy={bodyY + 95} rx="12" ry="16" fill="#10b981" opacity="0.6" filter="url(#muscleGlow)" />
          </>
        )}

        <text x="0" y="235" fill={showMistake ? '#f43f5e' : '#10b981'} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
          {showMistake ? '❌ Knee Cave-in (Valgus Strain)' : '✅ Knees Tracking Over 2nd & 3rd Toes'}
        </text>
      </g>
    );
  }

  // Side View (Kinematic Depth & Hip Hinge)
  const ankleX = 180;
  const ankleY = 198;
  const kneeX = 162 - kneeForward;
  const kneeY = 150 + (progress * 15);
  const hipX = 205 + hipBack;
  const hipY = 95 + hipDrop;
  const shoulderX = 175 + (hipBack * 0.4);
  const shoulderY = 48 + hipDrop;
  const headX = 168 + (hipBack * 0.3);
  const headY = 18 + hipDrop;

  return (
    <g>
      {/* Floor Line */}
      <line x1="80" y1="208" x2="300" y2="208" stroke="#334155" strokeWidth="3" />

      {/* Far Arm extended forward for counterbalance */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${shoulderX - 45} ${shoulderY + 6}`}
        fill="none"
        stroke={theme.skinShadow}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Head Profile */}
      <HumanHeadSide
        x={headX}
        y={headY}
        facingLeft={true}
        scale={0.95}
        theme={theme}
        characterType={characterType}
      />

      {/* Muscular Torso with 45° Athletic Hip Hinge */}
      <path
        d={`M ${shoulderX} ${shoulderY} C ${shoulderX + 15} ${shoulderY + 20}, ${hipX - 10} ${hipY - 15}, ${hipX} ${hipY}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Near Arm extended */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${shoulderX - 52} ${shoulderY + 8}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <HumanHand x={shoulderX - 52} y={shoulderY + 8} grip={false} theme={theme} scale={1.05} />

      {/* Glutes & Thigh (Femur with Vastus Lateralis muscle contour) */}
      <path
        d={`M ${hipX} ${hipY} C ${hipX - 15} ${hipY + 12}, ${kneeX + 15} ${kneeY + 4}, ${kneeX} ${kneeY}`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="22"
        strokeLinecap="round"
      />

      {/* Shin & Gastrocnemius Calf */}
      <path
        d={`M ${kneeX} ${kneeY} C ${kneeX + 18} ${kneeY + 18}, ${ankleX - 6} ${ankleY - 12}, ${ankleX} ${ankleY}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="15"
        strokeLinecap="round"
      />

      {/* Planted Athletic Sneaker with flat heel */}
      <HumanSneaker x={ankleX} y={ankleY} facingLeft={true} angle={0} theme={theme} scale={1.15} />

      {/* Glute & Quad Muscle Glow */}
      {showGlow && (
        <>
          <circle cx={hipX - 8} cy={hipY} r="18" fill="#10b981" opacity="0.65" filter="url(#muscleGlow)" />
          <circle cx={(hipX + kneeX) / 2} cy={(hipY + kneeY) / 2} r="16" fill="#14b8a6" opacity="0.6" filter="url(#muscleGlow)" />
        </>
      )}

      {/* Articulations */}
      <circle cx={shoulderX} cy={shoulderY} r="4.5" fill={theme.joints} />
      <circle cx={hipX} cy={hipY} r="4.5" fill={theme.joints} />
      <circle cx={kneeX} cy={kneeY} r="4.5" fill={theme.joints} />
      <circle cx={ankleX} cy={ankleY} r="4.5" fill={theme.joints} />

      {/* Depth Indicator Annotation */}
      <text x="240" y={hipY - 10} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
        {progress > 0.65 ? '🎯 Thighs Parallel (90°)' : 'Hips Hinging Back'}
      </text>
    </g>
  );
};

/* =========================================================================
   3. PLANK HOLD KINEMATIC MODEL
========================================================================= */
export const PlankCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showMistake,
  showGlow
}) => {
  const sag = showMistake ? Math.sin(progress * Math.PI) * 22 : 0;
  return (
    <g transform="translate(25, 20)">
      {/* Floor */}
      <line x1="30" y1="185" x2="330" y2="185" stroke="#334155" strokeWidth="3" />

      {/* Forearms planted on ground */}
      <line x1="105" y1="185" x2="140" y2="185" stroke="url(#skinGrad)" strokeWidth="12" strokeLinecap="round" />
      <line x1="105" y1="185" x2="105" y2="135" stroke="url(#skinGrad)" strokeWidth="13" strokeLinecap="round" />

      {/* Head */}
      <HumanHeadSide
        x={72}
        y={118}
        facingLeft={true}
        scale={0.9}
        theme={theme}
        characterType={characterType}
      />

      {/* Torso with 360 abdominal brace */}
      <path
        d={`M 105 135 C 160 ${140 + sag}, 200 ${142 + sag}, 235 ${145 + sag}`}
        fill="none"
        stroke={showMistake ? 'url(#mistakeGrad)' : 'url(#tankGrad)'}
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Legs & Glutes */}
      <path
        d={`M 235 ${145 + sag} L 305 175`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <HumanSneaker x={305} y={175} facingLeft={true} angle={20} theme={theme} scale={1.05} />

      {/* Core Muscle Activation Glow */}
      {showGlow && (
        <ellipse cx="170" cy={140 + sag} rx="30" ry="14" fill="#10b981" opacity="0.7" filter="url(#muscleGlow)" />
      )}

      {/* Laser spine alignment */}
      <line x1="72" y1="125" x2="305" y2="175" stroke={showMistake ? '#f43f5e' : '#10b981'} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="175" y={sag > 5 ? 180 : 95} fill={showMistake ? '#f43f5e' : '#10b981'} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        {showMistake ? '❌ Hip Sagging / Lumbar Strain' : '✅ 360° Core Tension & Posterior Pelvic Tilt'}
      </text>
    </g>
  );
};

/* =========================================================================
   4. WALKING / STATIC LUNGE KINEMATIC MODEL
========================================================================= */
export const LungeCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const drop = progress * 42;
  return (
    <g transform="translate(100, 15)">
      {/* Floor */}
      <line x1="-10" y1="210" x2="250" y2="210" stroke="#334155" strokeWidth="3" />

      {/* Head */}
      <HumanHeadSide
        x={120}
        y={28 + drop}
        facingLeft={true}
        scale={0.95}
        theme={theme}
        characterType={characterType}
      />

      {/* Upright Muscular Torso */}
      <path
        d={`M 120 ${50 + drop} L 120 ${110 + drop}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Front Leg (90° Knee Angle) */}
      <path
        d={`M 115 ${110 + drop} L 75 ${145 + drop} L 75 200`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanSneaker x={75} y={204} facingLeft={true} angle={0} theme={theme} scale={1.1} />

      {/* Back Leg (Dropping knee towards floor) */}
      <path
        d={`M 125 ${110 + drop} L 175 ${160 + drop} L 205 200`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanSneaker x={205} y={200} facingLeft={true} angle={25} theme={theme} scale={1.05} />

      {/* Quad Muscle Glow */}
      {showGlow && (
        <circle cx="95" cy={135 + drop} r="16" fill="#10b981" opacity="0.65" filter="url(#muscleGlow)" />
      )}

      <text x="120" y="230" fill="#10b981" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        ✅ Stacked 90° Knee & Torso Perpendicular to Floor
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
  return (
    <g transform="translate(60, 20)">
      {/* Floor */}
      <line x1="10" y1="192" x2="280" y2="192" stroke="#334155" strokeWidth="3" />

      {/* Head on floor */}
      <HumanHeadSide
        x={60}
        y={165}
        facingLeft={false}
        scale={0.9}
        theme={theme}
        characterType={characterType}
      />

      {/* Grounded Arms */}
      <line x1="85" y1="182" x2="130" y2="182" stroke="url(#skinGrad)" strokeWidth="11" strokeLinecap="round" />

      {/* Elevated Torso & Spine */}
      <path
        d={`M 85 172 Q 135 ${160 - lift} 175 ${160 - lift}`}
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Glutes & Thigh */}
      <path
        d={`M 175 ${160 - lift} L 225 ${145 - lift * 0.4} L 225 186`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanSneaker x={225} y={188} facingLeft={true} angle={0} theme={theme} scale={1.1} />

      {/* Glute Muscle Peak Contraction Glow */}
      {showGlow && (
        <circle cx="165" cy={160 - lift} r="18" fill="#10b981" opacity="0.75" filter="url(#muscleGlow)" />
      )}

      <text x="150" y={105 - lift} fill="#10b981" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        {progress > 0.7 ? '🔥 Maximum Glute Contraction at Apex' : 'Drive Through Heels'}
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
  const drop = progress * 42;
  return (
    <g transform="translate(80, 15)">
      {/* Heavy Bench/Chair Structure */}
      <rect x="45" y="110" width="45" height="90" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="40" y="108" width="55" height="12" rx="3" fill="#334155" />

      {/* Head */}
      <HumanHeadSide
        x={115}
        y={55 + drop}
        facingLeft={false}
        scale={0.9}
        theme={theme}
        characterType={characterType}
      />

      {/* Torso */}
      <rect x="104" y={75 + drop} width="24" height="60" rx="10" fill="url(#tankGrad)" stroke="#0f172a" strokeWidth="1" />

      {/* Tricep Arm Flex */}
      <path
        d={`M 112 ${85 + drop} L 85 ${95 + drop * 0.5} L 85 112`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={85} y={112} grip={true} theme={theme} scale={1.1} />

      {/* Tricep Glow */}
      {showGlow && (
        <circle cx="95" cy={95 + drop * 0.5} r="14" fill="#10b981" opacity="0.7" filter="url(#muscleGlow)" />
      )}

      {/* Legs Extended Forward */}
      <path d={`M 116 ${135 + drop} L 165 175 L 195 198`} fill="none" stroke="url(#shortsGrad)" strokeWidth="17" strokeLinecap="round" />
      <HumanSneaker x={195} y={198} facingLeft={false} angle={-15} theme={theme} scale={1.1} />

      <text x="140" y="224" fill="#10b981" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        ✅ 90° Elbow Flexion & Spine Gliding Close to Bench
      </text>
    </g>
  );
};

/* =========================================================================
   7. DUMBBELL ROW KINEMATIC MODEL
========================================================================= */
export const DumbbellRowCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const pull = progress * 38;
  return (
    <g transform="translate(90, 15)">
      {/* Floor */}
      <line x1="10" y1="212" x2="250" y2="212" stroke="#334155" strokeWidth="3" />

      {/* Head at 45° angle */}
      <HumanHeadSide
        x={85}
        y={60}
        facingLeft={true}
        scale={0.9}
        theme={theme}
        characterType={characterType}
      />

      {/* 45° Hinged Torso */}
      <path
        d="M 98 75 L 165 120"
        fill="none"
        stroke="url(#tankGrad)"
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Row Arm kinematics (Pulling elbow to hip crease) */}
      <path
        d={`M 115 85 L ${145 + pull * 0.4} ${138 - pull} L ${132 + pull * 0.3} ${170 - pull}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanHand x={132 + pull * 0.3} y={170 - pull} grip={true} theme={theme} scale={1.1} />

      {/* Metallic Dumbbell */}
      <g transform={`translate(${118 + pull * 0.3}, ${164 - pull})`}>
        <rect x="0" y="0" width="30" height="12" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
        <circle cx="0" cy="6" r="8" fill="#0284c7" />
        <circle cx="30" cy="6" r="8" fill="#0284c7" />
      </g>

      {/* Latissimus Dorsi Back Glow */}
      {showGlow && (
        <circle cx="138" cy="98" r="18" fill="#10b981" opacity="0.75" filter="url(#muscleGlow)" />
      )}

      {/* Athletic Bent Knees Base */}
      <path d="M 165 120 L 175 160 L 180 206" fill="none" stroke="url(#shortsGrad)" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
      <HumanSneaker x={180} y={208} facingLeft={true} angle={0} theme={theme} scale={1.15} />

      <text x="140" y="40" fill="#10b981" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        {progress > 0.7 ? '🔥 Squeeze Rhomboid & Lat Blade at Top' : 'Pull Elbow Tight to Hip Pocket'}
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
  const kneeDrive = Math.sin(progress * Math.PI * 2) * 38;
  return (
    <g transform="translate(60, 20)">
      {/* Floor */}
      <line x1="20" y1="190" x2="270" y2="190" stroke="#334155" strokeWidth="3" />

      {/* Head */}
      <HumanHeadSide
        x={65}
        y={105}
        facingLeft={true}
        scale={0.9}
        theme={theme}
        characterType={characterType}
      />

      {/* Grounded Plank Arms */}
      <line x1="85" y1="120" x2="85" y2="185" stroke="url(#skinGrad)" strokeWidth="13" strokeLinecap="round" />
      <HumanHand x={85} y={185} grip={false} theme={theme} scale={1.15} />

      {/* Flat Torso */}
      <line x1="85" y1="120" x2="190" y2="140" stroke="url(#tankGrad)" strokeWidth="24" strokeLinecap="round" />

      {/* Driving Leg 1 (Dynamic Sprinting Cadence) */}
      <path
        d={`M 190 140 L ${140 - kneeDrive} 160 L ${195 - kneeDrive} 185`}
        fill="none"
        stroke="url(#shortsGrad)"
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <HumanSneaker x={195 - kneeDrive} y={185} facingLeft={true} angle={15} theme={theme} scale={1.05} />

      {/* Core Activation Glow */}
      {showGlow && (
        <circle cx="140" cy="135" r="18" fill="#10b981" opacity="0.65" filter="url(#muscleGlow)" />
      )}

      <text x="140" y="80" fill="#10b981" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        ⚡ Explosive Knee Drive & Locked Core Line
      </text>
    </g>
  );
};

/* =========================================================================
   9. RESISTANCE BAND / LAT PULLDOWN KINEMATIC MODEL
========================================================================= */
export const LatPulldownCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  const pullDown = progress * 38;
  return (
    <g transform="translate(200, 20)">
      {/* Head */}
      <HumanHeadFront
        x={0}
        y={40}
        scale={0.95}
        theme={theme}
        characterType={characterType}
      />

      {/* Torso */}
      <path
        d="M -26 65 C -30 90, -22 115, -18 130 L 18 130 C 22 115, 30 90, 26 65 Z"
        fill="url(#tankGrad)"
        stroke="#0f172a"
        strokeWidth="1.2"
      />

      {/* Left Arm pulling band apart */}
      <path
        d={`M -24 70 Q ${-55 - pullDown * 0.4} ${45 + pullDown} ${-65 - pullDown} ${30 + pullDown}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <HumanHand x={-65 - pullDown} y={30 + pullDown} grip={true} theme={theme} scale={1.1} />

      {/* Right Arm pulling band apart */}
      <path
        d={`M 24 70 Q ${55 + pullDown * 0.4} ${45 + pullDown} ${65 + pullDown} ${30 + pullDown}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <HumanHand x={65 + pullDown} y={30 + pullDown} grip={true} theme={theme} scale={1.1} />

      {/* Resistance Band */}
      <line
        x1={-65 - pullDown}
        y1={30 + pullDown}
        x2={65 + pullDown}
        y2={30 + pullDown}
        stroke="#f43f5e"
        strokeWidth="4"
        strokeDasharray="6 3"
      />

      {/* Latissimus Back Glow */}
      {showGlow && (
        <>
          <circle cx="-28" cy="85" r="16" fill="#10b981" opacity="0.7" filter="url(#muscleGlow)" />
          <circle cx="28" cy="85" r="16" fill="#10b981" opacity="0.7" filter="url(#muscleGlow)" />
        </>
      )}

      {/* Shorts */}
      <rect x="-20" y="130" width="40" height="55" rx="8" fill="url(#shortsGrad)" />

      <text x="0" y="215" fill="#10b981" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        {progress > 0.7 ? '🔥 Squeeze Shoulder Blades Together' : 'Pull Band to Upper Clavicle'}
      </text>
    </g>
  );
};

/* =========================================================================
   10. EXPLOSIVE BURPEE KINEMATIC MODEL
========================================================================= */
export const BurpeeCharacter: React.FC<KinematicProps> = ({
  progress,
  theme,
  characterType,
  showGlow
}) => {
  let stageText = '1. Squat Down to Floor';
  let jumpY = 0;

  if (progress < 0.25) {
    stageText = '1. Drop to Squat Hands on Floor';
  } else if (progress < 0.5) {
    stageText = '2. Kick Feet Back into Plank';
  } else if (progress < 0.75) {
    stageText = '3. Snap Feet In Toward Hands';
  } else {
    stageText = '4. Explosive Vertical Jump!';
    jumpY = -40 * Math.sin(((progress - 0.75) / 0.25) * Math.PI);
  }

  return (
    <g transform={`translate(200, ${95 + jumpY})`}>
      {/* Head */}
      <HumanHeadFront
        x={0}
        y={-35}
        scale={0.95}
        theme={theme}
        characterType={characterType}
      />

      {/* Torso */}
      <rect x="-20" y="-15" width="40" height="58" rx="10" fill="url(#tankGrad)" stroke="#0f172a" strokeWidth="1" />

      {/* High Reaching Arms for Jump */}
      {progress >= 0.75 ? (
        <>
          <path d="M -18 -8 L -28 -65" stroke="url(#skinGrad)" strokeWidth="12" strokeLinecap="round" />
          <HumanHand x={-28} y={-65} grip={false} theme={theme} scale={1.1} />
          <path d="M 18 -8 L 28 -65" stroke="url(#skinGrad)" strokeWidth="12" strokeLinecap="round" />
          <HumanHand x={28} y={-65} grip={false} theme={theme} scale={1.1} />
        </>
      ) : (
        <path d="M -16 -4 L -28 35 L 0 45" fill="none" stroke="url(#skinGrad)" strokeWidth="11" strokeLinecap="round" />
      )}

      {/* Legs & Sneakers */}
      <line x1="-12" y1="43" x2="-16" y2="85" stroke="url(#shortsGrad)" strokeWidth="16" strokeLinecap="round" />
      <HumanSneaker x={-16} y={88} facingLeft={true} angle={0} theme={theme} scale={1.05} />

      <line x1="12" y1="43" x2="16" y2="85" stroke="url(#shortsGrad)" strokeWidth="16" strokeLinecap="round" />
      <HumanSneaker x={16} y={88} facingLeft={false} angle={0} theme={theme} scale={1.05} />

      {/* Full Body Explosive Glow */}
      {showGlow && (
        <circle cx="0" cy="15" r="32" fill="#10b981" opacity="0.6" filter="url(#muscleGlow)" />
      )}

      <text x="0" y="125" fill="#10b981" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        {stageText}
      </text>
    </g>
  );
};

/* =========================================================================
   11. GENERIC ATHLETIC COACH POSTURE
========================================================================= */
export const GenericAthleticCharacter: React.FC<{
  progress: number;
  viewAngle: ViewAngle;
  theme: CharacterTheme;
  characterType: CoachCharacter;
  exerciseName: string;
  targetMuscle: string;
  showGlow: boolean;
}> = ({
  progress,
  theme,
  characterType,
  targetMuscle,
  showGlow
}) => {
  const bob = Math.sin(progress * Math.PI * 2) * 8;
  return (
    <g transform="translate(200, 25)">
      {/* Head */}
      <HumanHeadFront
        x={0}
        y={35 + bob}
        scale={0.95}
        theme={theme}
        characterType={characterType}
      />

      {/* Torso */}
      <path
        d={`M -25 ${58 + bob} C -30 ${85 + bob}, -22 ${110 + bob}, -18 ${125 + bob} L 18 ${125 + bob} C 22 ${110 + bob}, 30 ${85 + bob}, 25 ${58 + bob} Z`}
        fill="url(#tankGrad)"
        stroke="#0f172a"
        strokeWidth="1.2"
      />

      {/* Athletic Guard Posture Arms */}
      <path
        d={`M -24 ${68 + bob} Q -42 ${95 + bob} -25 ${115 + bob}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <HumanHand x={-25} y={115 + bob} grip={true} theme={theme} scale={1.1} />

      <path
        d={`M 24 ${68 + bob} Q 42 ${95 + bob} 25 ${115 + bob}`}
        fill="none"
        stroke="url(#skinGrad)"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <HumanHand x={25} y={115 + bob} grip={true} theme={theme} scale={1.1} />

      {/* Target Muscle Glow */}
      {showGlow && (
        <circle cx="0" cy={85 + bob} r="22" fill="#10b981" opacity="0.65" filter="url(#muscleGlow)" />
      )}

      {/* Lower Body */}
      <rect x="-18" y={125 + bob} width="16" height="55" rx="6" fill="url(#shortsGrad)" />
      <HumanSneaker x={-10} y={185 + bob} facingLeft={true} angle={0} theme={theme} scale={1.05} />

      <rect x="2" y={125 + bob} width="16" height="55" rx="6" fill="url(#shortsGrad)" />
      <HumanSneaker x={10} y={185 + bob} facingLeft={false} angle={0} theme={theme} scale={1.05} />

      <text x="0" y={220} fill="#10b981" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
        Active Target: {targetMuscle}
      </text>
    </g>
  );
};
