// src/services/plan.js

// Base minutes for vitamin D synthesis by skin type (Fitzpatrick scale)
const MINUTES_BY_SKIN = { 
  'I': 10,   // Very fair
  'II': 12,  // Fair
  'III': 15, // Medium
  'IV': 18,  // Olive
  'V': 22,   // Dark
  'VI': 25   // Very dark
};

/**
 * Parse questionnaire skin type (e.g., "I-II", "III-IV") to middle value
 */
function parseSkinType(skinTypeStr) {
  if (!skinTypeStr) return 'III'; // Default to medium
  
  // Handle formats like "I-II", "III-IV", "V-VI"
  if (skinTypeStr.includes('-')) {
    const parts = skinTypeStr.split('-');
    // Convert roman numerals to numbers, average them, convert back
    const nums = parts.map(romanToNumber);
    const avg = Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
    return numberToRoman(avg);
  }
  
  // Already single value like "III"
  return skinTypeStr;
}

function romanToNumber(roman) {
  const map = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6 };
  return map[roman] || 3;
}

function numberToRoman(num) {
  const map = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };
  return map[Math.max(1, Math.min(6, num))] || 'III';
}

/**
 * Parse clothing coverage from questionnaire
 */
function parseClothing(clothingCoverage) {
  if (!clothingCoverage) return 'normal';
  
  if (clothingCoverage.includes('arms-legs-exposed')) return 'minimal';
  if (clothingCoverage.includes('full-coverage')) return 'covered';
  return 'normal';
}

/**
 * Calculate recommended exposure time based on skin type and UV index
 */
export function minutesForUv(skinType, uv) {
  // Parse if it's a range like "I-II"
  const parsedType = parseSkinType(skinType);
  const base = MINUTES_BY_SKIN[parsedType] ?? 15;
  
  // Adjust based on UV level
  if (uv <= 0) return 0; // No sun
  if (uv <= 2) return Math.round(base * 1.3); // Low UV - can stay longer
  if (uv <= 3) return base; // Optimal UV - base time
  if (uv <= 5) return Math.round(base * 0.9); // Moderate - slightly less
  if (uv <= 7) return Math.max(8, Math.round(base * 0.6)); // High - much less
  if (uv <= 9) return Math.max(5, Math.round(base * 0.4)); // Very high - minimal
  return 0; // Extreme - avoid
}

/**
 * IMPROVED: Activity suggestions that match your Vue component's activity pool
 * Now returns consistent activity names with proper weather context
 */
const ACTIVITY_POOL = {
  veryLowUV: [
    "Morning Walk",
    "Beach Yoga",
    "Tai Chi",
    "Bird Watching"
  ],
  lowUV: [
    "Park Cycling",
    "Garden Visit",
    "Nature Hike",
    "River Trail"
  ],
  moderateUV: [
    "Morning Walk",
    "Tai Chi",
    "Bird Watching",
    "Garden Visit"
  ],
  highUV: [
    "Morning Walk",
    "Tai Chi"
  ],
  indoor: [
    "Indoor mobility",
    "Stretching routine",
    "Balance exercises",
    "Home workout",
    "Yoga session"
  ]
};

/**
 * SIMPLIFIED: Smart activity picker - NO WEATHER CONTEXT
 * Returns clean activity names without (sunny), (cloudy), etc.
 */
function pickActivity(uv, condition, timeOfDay = 'morning') {
  const c = (condition || "").toLowerCase();
  
  // Extreme weather - force indoor
  if (c.includes("rain") || c.includes("storm") || c.includes("thunder")) {
    const indoor = ACTIVITY_POOL.indoor[Math.floor(Math.random() * ACTIVITY_POOL.indoor.length)];
    return { label: indoor, indoor: true };
  }
  
  // UV-based activity selection
  let pool;
  if (uv <= 2) {
    pool = ACTIVITY_POOL.veryLowUV;
  } else if (uv <= 3) {
    pool = ACTIVITY_POOL.lowUV;
  } else if (uv <= 5) {
    pool = ACTIVITY_POOL.moderateUV;
  } else if (uv <= 7) {
    pool = ACTIVITY_POOL.highUV;
  } else {
    // Very high UV - indoor only
    const indoor = ACTIVITY_POOL.indoor[Math.floor(Math.random() * ACTIVITY_POOL.indoor.length)];
    return { label: indoor, indoor: true };
  }
  
  // Select random activity from appropriate pool
  let activity = pool[Math.floor(Math.random() * pool.length)];
  
  // REMOVED: Weather context - just return clean activity name
  return { label: activity };
}

/**
 * IMPROVED: Build daily plan with better time windows and smarter logic
 */
export function buildDailyPlan({ skinType, clothing = "normal", hours }) {
  // Parse questionnaire formats
  const parsedSkin = parseSkinType(skinType);
  const clothingType = typeof clothing === 'string' && clothing.includes('-') 
    ? parseClothing(clothing) 
    : clothing;
  
  // Clothing multiplier (more coverage = can stay longer)
  const mult = clothingType === "covered" ? 1.3 : 
               clothingType === "minimal" ? 0.75 : 
               1.0;

  // IMPROVED: Better time windows for Australian climate
  const morningHours = hours.filter(h => {
    const hr = new Date(h.timeISO).getHours();
    return hr >= 6 && hr <= 10; // Early morning (6am-10am) - best for vitamin D
  });
  
  const afternoonHours = hours.filter(h => {
    const hr = new Date(h.timeISO).getHours();
    return hr >= 15 && hr <= 19; // Late afternoon (3pm-7pm) - UV typically lower
  });

  /**
   * IMPROVED: Find best slot with better scoring algorithm
   */
  function findBestSlot(bucket, timeOfDay) {
    if (!bucket.length) return null;
    
    // Filter viable hours (UV > 0 but not extreme)
    const viable = bucket.filter(h => h.uv > 0 && h.uv <= 10);
    if (!viable.length) return null;
    
    // IMPROVED SCORING SYSTEM
    // For morning: prefer UV 2-3 (optimal for vitamin D synthesis)
    // For afternoon: prefer UV < 3 (safety first)
    const scored = viable.map(h => {
      let score = 0;
      
      if (timeOfDay === 'morning') {
        // Morning: reward UV 2-3 (sweet spot for vitamin D)
        if (h.uv >= 2 && h.uv <= 3) {
          score += 100;
        } else if (h.uv >= 1 && h.uv < 2) {
          score += 80; // Still good, just slower
        } else if (h.uv > 3 && h.uv <= 5) {
          score += 60; // Acceptable with caution
        } else {
          score += 20; // Too high or too low
        }
        
        // Prefer earlier morning hours (before 9am)
        const hour = new Date(h.timeISO).getHours();
        if (hour <= 8) score += 20;
        if (hour === 9) score += 10;
        
      } else {
        // Afternoon: reward lower UV (safety)
        if (h.uv <= 2) {
          score += 100;
        } else if (h.uv <= 3) {
          score += 80;
        } else if (h.uv <= 5) {
          score += 50;
        } else {
          score += 20;
        }
        
        // Prefer later hours (after 5pm)
        const hour = new Date(h.timeISO).getHours();
        if (hour >= 17) score += 20;
        if (hour === 16) score += 10;
      }
      
      // Weather bonuses
      const cond = (h.condition || '').toLowerCase();
      if (cond.includes('clear') || cond.includes('sunny')) score += 10;
      if (cond.includes('cloud')) score += 5; // Clouds reduce UV naturally
      if (cond.includes('rain') || cond.includes('storm')) score -= 50; // Avoid
      
      // Temperature comfort (15-25°C is ideal)
      const temp = h.tempC ?? 20;
      if (temp >= 15 && temp <= 25) score += 15;
      if (temp < 10 || temp > 30) score -= 10;
      
      return { ...h, score };
    });
    
    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    
    // Calculate safe exposure time
    const minutes = Math.round(minutesForUv(parsedSkin, best.uv) * mult);
    
    // Pick appropriate activity
    const act = pickActivity(best.uv, best.condition, timeOfDay);
    
    // IMPROVED: Generate comprehensive warnings
    let warning = null;
    if (best.uv >= 8) {
      warning = "Very high UV - Sunscreen SPF 50+, hat, sunglasses, and seek shade frequently";
    } else if (best.uv >= 6) {
      warning = "High UV - Sunscreen SPF 30+, hat and sunglasses recommended";
    } else if (best.uv >= 4) {
      warning = "Moderate UV - Consider sunscreen if staying longer than recommended time";
    } else if (best.uv >= 3 && minutes > 20) {
      warning = "Apply sunscreen if staying longer than recommended time";
    }
    
    return {
      timeISO: best.timeISO,
      uv: Math.round(best.uv * 10) / 10,
      condition: best.condition,
      tempC: best.tempC ?? 20,
      minutes: Math.max(5, Math.min(60, minutes)), // Cap at 60 minutes
      activity: act.label,
      indoor: !!act.indoor,
      warning: warning,
      timeOfDay: timeOfDay,
      score: best.score // Include score for debugging
    };
  }

  const morning = findBestSlot(morningHours, 'morning');
  const afternoon = findBestSlot(afternoonHours, 'afternoon');
  
  // If no safe slots found, provide indoor alternative
  if (!morning && !afternoon) {
    return {
      morning: null,
      afternoon: null,
      fallback: {
        activity: "Indoor mobility",
        minutes: 15,
        indoor: true,
        warning: "UV levels too high today - stay indoors or wait for evening",
        uv: 0
      }
    };
  }

  return {
    morning,
    afternoon
  };
}

/**
 * Build weekly plan from forecast data
 */
export function buildWeeklyPlan({ profile, forecastDaily }) {
  return forecastDaily.map(d => {
    const dailyPlan = buildDailyPlan({ 
      skinType: profile.skinType, 
      clothing: profile.clothing, 
      hours: d.hours 
    });
    
    return {
      dateISO: d.dateISO,
      morning: dailyPlan.morning,
      afternoon: dailyPlan.afternoon,
      fallback: dailyPlan.fallback
    };
  });
}

/**
 * IMPROVED: Generate vitamin D nutrition nudge based on questionnaire result
 */
export function vitaminDNudge(result) {
  if (!result) return "Keep up your outdoor routine for healthy vitamin D levels!";
  
  const resultLower = result.toLowerCase();
  
  if (resultLower === "inadequate" || resultLower === "low" || resultLower === "deficient") {
    return "⚠️ Your vitamin D may be low. This week: Add oily fish (salmon, mackerel), eggs, or fortified milk 3-4 times. Consider discussing supplements with your GP.";
  }
  
  if (resultLower === "adequate" || resultLower === "normal" || resultLower === "sufficient") {
    return "✅ Your vitamin D levels look good! Keep up balanced meals with vitamin D-rich foods and regular outdoor time.";
  }
  
  if (resultLower === "high" || resultLower === "optimal") {
    return "🌟 Excellent vitamin D status! Continue your current routine with outdoor activities and vitamin D-rich foods.";
  }
  
  // Default message
  return "💪 Maintain healthy vitamin D levels through safe sun exposure and balanced nutrition!";
}

/**
 * Read and parse questionnaire result from localStorage
 */
export function getQuestionnaireProfile() {
  try {
    // Try multiple possible localStorage keys
    const keys = ['questionnaire_result', 'vd_questionnaire_result', 'questionnaireResult'];
    let data = null;
    
    for (const key of keys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        data = JSON.parse(stored);
        break;
      }
    }
    
    if (!data) return null;
    
    // Parse skin type (handle "I-II" format)
    const skinType = parseSkinType(data.skin_type || data.skinType);
    
    // Parse clothing
    const clothing = parseClothing(data.clothing_coverage || data.clothingCoverage || data.clothing);
    
    return {
      skinType: skinType,
      clothing: clothing,
      vitaminDStatus: data.result || data.vitaminDStatus || data.vitamin_d_status,
      riskScore: data.risk_score || data.riskScore,
      outdoorTime: data.outdoor_time || data.outdoorTime,
      workPattern: data.work_pattern || data.workPattern,
      location: data.location,
      vitaminDSupplement: data.vitamin_d_supplement || data.vitaminDSupplement,
      vitaminDFoods: data.vitamin_d_foods || data.vitaminDFoods
    };
  } catch (error) {
    console.error('Error parsing questionnaire result:', error);
    return null;
  }
}

/**
 * BONUS: Helper to get UV level description
 */
export function getUVDescription(uv) {
  if (uv <= 2) return { level: 'Low', color: '#22c55e', advice: 'Safe for extended outdoor time' };
  if (uv <= 5) return { level: 'Moderate', color: '#f59e0b', advice: 'Sunscreen recommended for extended exposure' };
  if (uv <= 7) return { level: 'High', color: '#ef4444', advice: 'Sun protection required' };
  if (uv <= 10) return { level: 'Very High', color: '#dc2626', advice: 'Extra protection essential' };
  return { level: 'Extreme', color: '#7c3aed', advice: 'Avoid sun exposure' };
}

/**
 * BONUS: Calculate daily vitamin D potential (IU)
 * Based on UV exposure and skin type
 */
export function estimateDailyVitaminD(skinType, minutes, uv) {
  if (uv < 3 || minutes <= 0) return 0;
  
  const parsedType = parseSkinType(skinType);
  const skinFactor = {
    'I': 1.2,   // Fair skin produces more quickly
    'II': 1.15,
    'III': 1.0, // Baseline
    'IV': 0.85,
    'V': 0.7,   // Darker skin needs more time
    'VI': 0.6
  }[parsedType] || 1.0;
  
  // Rough estimate: 10-15 minutes at UV 3+ = ~1000 IU for medium skin
  const baseIU = 1000;
  const uvFactor = Math.min(uv / 3, 2); // UV 3 = 1x, UV 6 = 2x, capped
  const timeFactor = minutes / 15;
  
  return Math.round(baseIU * skinFactor * uvFactor * timeFactor);
}