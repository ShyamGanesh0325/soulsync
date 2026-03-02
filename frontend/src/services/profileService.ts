import { getCurrentUser, updateCurrentUser } from '../api';
import type { UserResponse } from '../types';

/**
 * Centralized service to update the user profile with "Bulletproof" sanitization.
 * This ensures that every update request includes all required fields with 
 * correct data types (Number, Boolean, Array) as expected by the backend.
 */
export const updateFullProfile = async (currentUser: UserResponse | null, updates: Partial<UserResponse>): Promise<UserResponse> => {
    // 1. Fetch latest if not provided
    const baseUser = currentUser || await getCurrentUser();

    // 2. Merge current state with new changes
    const mergedData = {
        ...baseUser,
        ...updates
    };

    // 3. Data Sanitization (The "Bulletproof" layer)
    const sanitizedPayload = {
        // Basic Info
        name: mergedData.name || "User",
        age: Number(mergedData.age || 18),
        gender: mergedData.gender || "Other",
        location: mergedData.location || "Unknown",

        // Personality (Must be Numbers)
        openness: Number(mergedData.openness ?? 5),
        extroversion: Number(mergedData.extroversion ?? 5),
        agreeableness: Number(mergedData.agreeableness ?? 5),
        neuroticism: Number(mergedData.neuroticism ?? 5),
        conscientiousness: Number(mergedData.conscientiousness ?? 5),

        // Love Languages (Must be Numbers)
        words_of_affirmation: Number(mergedData.words_of_affirmation ?? 0),
        quality_time: Number(mergedData.quality_time ?? 0),
        gifts: Number(mergedData.gifts ?? 0),
        physical_touch: Number(mergedData.physical_touch ?? 0),
        acts_of_service: Number(mergedData.acts_of_service ?? 0),

        // Interests (Must be Numbers/0 or 1)
        likes_music: Number(mergedData.likes_music ?? 0),
        likes_travel: Number(mergedData.likes_travel ?? 0),
        likes_pets: Number(mergedData.likes_pets ?? 0),
        foodie: Number(mergedData.foodie ?? 0),
        gym_person: Number(mergedData.gym_person ?? 0),
        movie_lover: Number(mergedData.movie_lover ?? 0),
        gamer: Number(mergedData.gamer ?? 0),
        reader: Number(mergedData.reader ?? 0),
        night_owl: Number(mergedData.night_owl ?? 0),
        early_bird: Number(mergedData.early_bird ?? 0),

        // Strings
        zodiac_sign: mergedData.zodiac_sign || "Unknown",
        relationship_goal: mergedData.relationship_goal || "Unknown",
        fav_music_genre: mergedData.fav_music_genre || "Unknown",
        bio_text: mergedData.bio_text || "No bio yet",

        // Filters
        max_distance: Number(mergedData.max_distance ?? 50),
        min_age_pref: Number(mergedData.min_age_pref ?? 18),
        max_age_pref: Number(mergedData.max_age_pref ?? 100),
        min_compatibility: Number(mergedData.min_compatibility ?? 0),
        required_love_language: mergedData.required_love_language || "any",
        min_openness: Number(mergedData.min_openness ?? 0),
        min_extroversion: Number(mergedData.min_extroversion ?? 0),
        min_agreeableness: Number(mergedData.min_agreeableness ?? 0),
        min_neuroticism: Number(mergedData.min_neuroticism ?? 0),
        min_conscientiousness: Number(mergedData.min_conscientiousness ?? 0),

        // Arrays & Booleans (Crucial for PUT requests)
        photos: mergedData.photos || [],
        notifications_enabled: Boolean(mergedData.notifications_enabled ?? true),
        safe_mode_enabled: Boolean(mergedData.safe_mode_enabled ?? false),

        // Optional fields
        jobTitle: mergedData.jobTitle,
        school: mergedData.school,
        height: mergedData.height ? Number(mergedData.height) : undefined,
        loveLanguage: mergedData.loveLanguage,
        aura: mergedData.aura,
        lifestyle: mergedData.lifestyle
    } as UserResponse;

    console.log("🚀 Bulletproof Service: Sending payload to /auth/me", sanitizedPayload);
    return await updateCurrentUser(sanitizedPayload);
};
