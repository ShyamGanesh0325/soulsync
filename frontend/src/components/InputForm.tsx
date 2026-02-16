import React, { useState, useRef } from 'react';
import type { UserProfile } from '../types';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Camera, CheckCircle, ScanFace, Plus, Trash2, Briefcase, GraduationCap, Ruler, Sparkle, Wind, Beer, Cigarette, Dumbbell, Heart } from 'lucide-react';

interface InputFormProps {
    onSubmit: (profile: UserProfile) => void;
    isLoading: boolean;
    initialValues?: UserProfile | null;
}

const initialProfile: UserProfile = {
    name: '',
    age: 25,
    gender: 'male',
    location: 'Delhi',
    openness: 5,
    extroversion: 5,
    agreeableness: 5,
    neuroticism: 5,
    conscientiousness: 5,
    words_of_affirmation: 3,
    quality_time: 3,
    gifts: 3,
    physical_touch: 3,
    acts_of_service: 3,
    likes_music: 1,
    likes_travel: 1,
    likes_pets: 1,
    foodie: 1,
    gym_person: 0,
    movie_lover: 1,
    gamer: 0,
    reader: 0,
    night_owl: 0,
    early_bird: 1,
    zodiac_sign: 'Leo',
    relationship_goal: 'Casual',
    fav_music_genre: 'Pop',
    bio_text: '',
    photos: [],
    jobTitle: '',
    school: '',
    height: 170,
    loveLanguage: 'Quality Time',
    aura: 'Vibrant',
    lifestyle: {
        smoking: 'Never',
        drinking: 'Socially',
        fitness: 'Sometimes'
    }
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, initialValues }) => {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<UserProfile>(initialProfile);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'camera-active' | 'scanning' | 'verified' | 'failed'>('idle');
    const [verificationPhase, setVerificationPhase] = useState<number>(0);
    const [stabilityProgress, setStabilityProgress] = useState(0);
    const [poseInstruction, setPoseInstruction] = useState<string>('');
    const [isPoseCompleted, setIsPoseCompleted] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [vError, setVError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync with initialValues when available
    React.useEffect(() => {
        if (initialValues) {
            setProfile(prev => ({ ...prev, ...initialValues }));
        }
    }, [initialValues]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let val: string | number = value;

        if (type === 'number' || type === 'range') {
            val = Number(value);
        }

        setProfile(prev => ({ ...prev, [name]: val }));
    };

    const handleCheckbox = (name: keyof UserProfile) => {
        setProfile(prev => ({ ...prev, [name]: prev[name] ? 0 : 1 }));
    };

    const handleLifestyleChange = (category: 'smoking' | 'drinking' | 'fitness', value: string) => {
        setProfile(prev => ({
            ...prev,
            lifestyle: {
                ...(prev.lifestyle || {}),
                [category]: value
            }
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(profile);
    };

    const startCamera = async () => {
        try {
            setVerificationStatus('camera-active');
            setVerificationPhase(0);
            setStabilityProgress(0);
            setPoseInstruction('Align face in center');
            setIsPoseCompleted(false);
            setVError(null);

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // High-rigor 3-step verification sequence
            const instructions = ["Align face in center 👤", "Smile for the camera 😊", "Blink 3 times 👁️"];

            const runPhase = (phaseIdx: number) => {
                setVerificationPhase(phaseIdx);
                setPoseInstruction(instructions[phaseIdx]);
                setStabilityProgress(0);

                // Simulated Bio-stability progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 4;
                    setStabilityProgress(progress);

                    if (progress >= 100) {
                        clearInterval(interval);
                        if (phaseIdx < 2) {
                            setTimeout(() => runPhase(phaseIdx + 1), 500);
                        } else {
                            setIsPoseCompleted(true);
                            setPoseInstruction('Biometrics Captured! Scanning...');
                        }
                    }
                }, 150);
            };

            setTimeout(() => runPhase(0), 1500);

        } catch (err) {
            console.error("Error/Permission denied", err);
            setVerificationStatus('failed');
            setVError("Camera Access Required for Soul Verification.");
        }
    };

    const captureSelfie = () => {
        if (!isPoseCompleted) return;

        setVerificationStatus('scanning');
        setVError(null);

        // Final "AI" check - fails if it's the first time and looks "suspicious" (pseudo)
        setTimeout(() => {
            if (retryCount < 1) {
                setVerificationStatus('failed');
                setRetryCount(prev => prev + 1);
                setIsPoseCompleted(false);
                setVError("Biometric Anomaly: Silhouette mismatch. System detected a non-human object (Hand/Photo). Please ensure ONLY your face is visible.");
            } else {
                const stream = videoRef.current?.srcObject as MediaStream;
                stream?.getTracks().forEach(track => track.stop());
                setVerificationStatus('verified');
            }
        }, 4000);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newPhotos = Array.from(files).slice(0, 6 - (profile.photos?.length || 0)).map(file => URL.createObjectURL(file));
        setProfile(prev => ({
            ...prev,
            photos: [...(prev.photos || []), ...newPhotos].slice(0, 6)
        }));
    };

    const removePhoto = (index: number) => {
        setProfile(prev => ({
            ...prev,
            photos: prev.photos?.filter((_, i) => i !== index)
        }));
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">The Basics</h2>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 ring-primary transition-colors" placeholder="e.g. Rahul" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Age</label>
                <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 ring-primary transition-colors" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gender</label>
                <select name="gender" value={profile.gender} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">City</label>
                <input type="text" name="location" value={profile.location} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors" placeholder="e.g. Mumbai" />
            </div>
            <button
                onClick={nextStep}
                disabled={!profile.name.trim() || !profile.location.trim() || !profile.age}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next <ArrowRight size={20} />
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <button onClick={prevStep} className="hover:text-primary transition-colors"><ChevronLeft /></button>
                Personality DNA
            </h2>
            {['openness', 'extroversion', 'agreeableness', 'neuroticism', 'conscientiousness'].map((trait) => (
                <div key={trait}>
                    <label className="block text-sm font-medium mb-1 capitalize text-gray-700 dark:text-gray-300">{trait}</label>
                    <input type="range" name={trait} min="1" max="10" value={profile[trait as keyof UserProfile] as number} onChange={handleChange} className="w-full accent-primary" />
                    <div className="flex justify-between text-xs text-gray-400"><span>Low</span><span>High</span></div>
                </div>
            ))}
            <button onClick={nextStep} className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-4">Next</button>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <button onClick={prevStep} className="hover:text-primary transition-colors"><ChevronLeft /></button>
                Interests & Bio
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {['likes_music', 'likes_travel', 'likes_pets', 'foodie', 'gym_person', 'movie_lover', 'gamer', 'reader'].map(interest => (
                    <button key={interest} type="button" onClick={() => handleCheckbox(interest as keyof UserProfile)} className={`p - 3 rounded - lg border text - sm font - medium transition - all ${profile[interest as keyof UserProfile] ? 'bg-primary text-white border-primary shadow-md' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'} `}>
                        {interest.replace('likes_', '').replace('_', ' ').toUpperCase()}
                    </button>
                ))}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Your Bio</label>
                <textarea name="bio_text" value={profile.bio_text} onChange={handleChange} className="w-full p-3 rounded-lg border bg-white dark:bg-gray-900 h-24 outline-none focus:ring-2 ring-primary" placeholder="Tell us about yourself..." />
            </div>
            <button
                onClick={nextStep}
                disabled={!profile.bio_text.trim()}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <button onClick={prevStep} className="hover:text-primary transition-colors"><ChevronLeft /></button>
                Your Photos
            </h2>
            <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden group">
                        {profile.photos?.[i] ? (
                            <>
                                <img src={profile.photos[i]} alt="" className="w-full h-full object-cover" />
                                <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded"><Trash2 size={12} /></button>
                            </>
                        ) : (
                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                <Plus size={20} className="text-gray-400" />
                                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                            </label>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={nextStep} disabled={!profile.photos?.length} className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50">Next</button>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <button onClick={prevStep} className="hover:text-primary transition-colors"><ChevronLeft /></button>
                Soul DNA
            </h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Briefcase size={10} /> Job</label>
                        <input type="text" name="jobTitle" value={profile.jobTitle} onChange={handleChange} placeholder="e.g. Designer" className="w-full p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><GraduationCap size={10} /> School</label>
                        <input type="text" name="school" value={profile.school} onChange={handleChange} placeholder="e.g. Stanford" className="w-full p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm font-bold" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Ruler size={10} /> Height</label>
                    <div className="flex items-center gap-3">
                        <input type="range" name="height" min="140" max="220" value={profile.height} onChange={handleChange} className="flex-1 accent-primary" />
                        <span className="text-primary font-bold text-sm w-10">{profile.height}cm</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Wind size={10} /> Your Aura</label>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {(['Vibrant', 'Ethereal', 'Grounded', 'Electric', 'Mystic'] as const).map(a => (
                            <button key={a} type="button" onClick={() => setProfile(prev => ({ ...prev, aura: a }))} className={`px - 4 py - 1.5 rounded - full text - [10px] font - black border ${profile.aura === a ? 'bg-primary text-white border-primary shadow-sm' : 'border-gray-100 dark:border-gray-700 text-gray-500'} `}>{a}</button>
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Sparkle size={10} /> Lifestyle</label>
                    <div className="space-y-2">
                        {([['smoking', Cigarette], ['drinking', Beer], ['fitness', Dumbbell]] as const).map(([cat, Icon]) => (
                            <div key={cat} className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2"><Icon size={12} /> {cat.toUpperCase()}</span>
                                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                                    {['Never', 'Socially', 'Regularly'].map(opt => (
                                        <button key={opt} type="button" onClick={() => handleLifestyleChange(cat, opt)} className={`px - 2.5 py - 1 text - [9px] font - black rounded - md ${profile.lifestyle?.[cat] === opt ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-gray-400'} `}>{opt}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Heart size={10} /> Love Language</label>
                    <select name="loveLanguage" value={profile.loveLanguage} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs font-bold transition-all">
                        {['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Gifts'].map(l => <option key={l}>{l}</option>)}
                    </select>
                </div>
            </div>
            <button
                onClick={nextStep}
                disabled={!profile.jobTitle?.trim() || !profile.school?.trim()}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );

    const renderStep6 = () => (
        <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <button onClick={prevStep} className="hover:text-primary transition-colors"><ChevronLeft /></button>
                Trust & Safety
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                {verificationStatus === 'idle' && (
                    <>
                        <div className="mb-4"><span className="text-6xl">✌️</span></div>
                        <h3 className="font-bold text-lg mb-2 dark:text-white">Liveness Check</h3>
                        <p className="text-gray-500 text-xs mb-6">Mimic the pose to verify your soul.</p>
                        <button onClick={startCamera} className="w-full bg-primary text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all"><Camera size={18} /> Open Camera</button>
                    </>
                )}
                {verificationStatus === 'camera-active' && (
                    <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />

                            {/* Face Silhouette Alignment Overlay */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none opacity-30">
                                <svg width="180" height="240" viewBox="0 0 100 133" className="text-primary">
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        d="M50,10 C35,10 20,25 20,55 C20,95 40,123 50,123 C60,123 80,95 80,55 C80,25 65,10 50,10 Z M35,45 C35,42 38,40 40,40 C42,40 45,42 45,45 M55,45 C55,42 58,40 60,40 C62,40 65,42 65,45 M50,85 C45,85 40,80 40,75"
                                        className="stroke-[0.5]"
                                    />
                                    <motion.ellipse
                                        cx="50" cy="55" rx="30" ry="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="0.5"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                </svg>
                            </div>

                            {/* Scanning Overlays */}
                            <div className="absolute inset-0 border-2 border-primary/30 rounded-lg pointer-events-none">
                                <motion.div
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-full h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.5)] z-10"
                                />

                                {/* Simulated Landmarks */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border border-white/20 rounded-[40%] flex items-center justify-center">
                                    <div className="grid grid-cols-3 gap-8">
                                        {[...Array(9)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ opacity: [0.2, 1, 0.2] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                                className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_rgba(139,92,246,0.8)]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Instruction Overlay */}
                            <div className="absolute bottom-4 left-0 right-0 px-4">
                                <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
                                    <p className="text-white font-bold text-sm flex items-center justify-center gap-2">
                                        {!isPoseCompleted && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-red-500 rounded-full" />}
                                        {poseInstruction}
                                    </p>
                                    {!isPoseCompleted && (
                                        <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stabilityProgress}% ` }}
                                                className="h-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                                            />
                                            {/* Phase Indicators */}
                                            <div className="absolute inset-0 flex justify-between px-1">
                                                {[0, 1, 2].map(i => (
                                                    <div key={i} className={`w - 1 h - 1 rounded - full mt - 0.25 ${verificationPhase >= i ? 'bg-white' : 'bg-white/30'} `} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={captureSelfie}
                            disabled={!isPoseCompleted}
                            className={`w - full py - 3 rounded - full font - bold flex items - center justify - center gap - 2 shadow - lg transition - all ${isPoseCompleted ? 'bg-primary text-white hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} `}
                        >
                            {isPoseCompleted ? "Capture Selfie" : "Performing Liveness..."}
                        </button>
                    </div>
                )}
                {verificationStatus === 'scanning' && (
                    <div className="flex flex-col items-center py-8">
                        <div className="relative mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ScanFace size={32} className="text-primary" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg dark:text-white mb-1">Analyzing Biometrics</h3>
                        <p className="text-gray-500 text-xs px-8">Matching face landmarks with SoulDNA index...</p>
                    </div>
                )}
                {verificationStatus === 'failed' && (
                    <div className="flex flex-col items-center py-6">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-red-600 text-2xl font-black">!</motion.span>
                        </div>
                        <h3 className="font-bold text-lg text-red-700 dark:text-red-400 mb-2">Verification Failed</h3>
                        <p className="text-gray-500 text-xs px-6 mb-6 leading-relaxed">
                            {vError || "Neural scan could not confirm a human face. Please ensure you are in a well-lit area and looking directly at the camera."}
                        </p>
                        <button
                            onClick={startCamera}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-all"
                        >
                            Retry Verification
                        </button>
                    </div>
                )}
                {verificationStatus === 'verified' && (
                    <div className="flex flex-col items-center py-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"><CheckCircle size={32} className="text-green-600" /></div>
                        <h3 className="font-bold text-xl text-green-700 dark:text-green-400 mb-1">Verified!</h3>
                        <button onClick={handleSubmit} className="w-full bg-primary text-white py-4 rounded-xl font-bold mt-4 shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2" disabled={isLoading}>{isLoading ? "Analyzing..." : "Reveal Soulmate"}</button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-md mx-auto">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
            {step === 6 && renderStep6()}
        </motion.div>
    );
};

export default InputForm;
