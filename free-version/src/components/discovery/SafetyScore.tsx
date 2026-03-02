'use client';

import React from 'react';
import { Shield, Ghost, AlertTriangle, CheckCircle } from 'lucide-react';

interface SafetyScoreProps {
    score: number;
    ghostingProb: number;
}

const SafetyScore: React.FC<SafetyScoreProps> = ({ score, ghostingProb }) => {
    const getSafetyLevel = () => {
        if (score > 80) return { label: 'Secured', color: 'text-green-500', bg: 'bg-green-500/10' };
        if (score > 60) return { label: 'Stable', color: 'text-blue-500', bg: 'bg-blue-500/10' };
        return { label: 'Caution', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    };

    const safety = getSafetyLevel();

    return (
        <div className="flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-xl ${safety.bg} flex items-center gap-2 border border-white/10 shadow-sm`}>
                <Shield className={safety.color} size={14} />
                <span className={`text-[10px] uppercase font-black tracking-widest ${safety.color}`}>
                    {safety.label}
                </span>
            </div>

            <div className={`px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center gap-2 border border-white/5`}>
                <Ghost className={ghostingProb > 40 ? 'text-orange-400' : 'text-gray-400'} size={14} />
                <span className={`text-[10px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400`}>
                    {ghostingProb.toFixed(0)}% Ghosting Risk
                </span>
            </div>
        </div>
    );
};

export default SafetyScore;
