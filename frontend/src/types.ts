export interface UserProfile {
    name: string;
    age: number;
    gender: string;
    location: string;
    openness: number;
    extroversion: number;
    agreeableness: number;
    neuroticism: number;
    conscientiousness: number;
    words_of_affirmation: number;
    quality_time: number;
    gifts: number;
    physical_touch: number;
    acts_of_service: number;
    likes_music: number;
    likes_travel: number;
    likes_pets: number;
    foodie: number;
    gym_person: number;
    movie_lover: number;
    gamer: number;
    reader: number;
    night_owl: number;
    early_bird: number;
    zodiac_sign: string;
    relationship_goal: string;
    fav_music_genre: string;
    bio_text: string;
    jobTitle?: string;
    school?: string;
    height?: number;
    loveLanguage?: string;
    aura?: 'Vibrant' | 'Ethereal' | 'Grounded' | 'Electric' | 'Mystic';
    lifestyle?: {
        smoking?: 'Never' | 'Socially' | 'Regularly';
        drinking?: 'Never' | 'Socially' | 'Regularly';
        fitness?: 'Daily' | 'Often' | 'Sometimes' | 'Rarely';
    };
    photos?: string[];
}

export interface PredictionResponse {
    compatibility_score: number;
    ghosting_probability: number;
    conversation_success: number;
    bio_feedback: string;

    // Phase 2
    safety_score: number;
    match_details: {
        personality_strength: number;
        love_style_intensity: number;
        lifestyle_match: number;
    };
    icebreakers: string[];
    timeline: { time: string; event: string }[];
    flags: { type: string; text: string }[];
}
