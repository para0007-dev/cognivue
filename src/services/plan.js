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
 * Activity suggestions based on weather conditions
 */
const ACTIVITY_POOL = {
  morning: [
    "Morning walk",
    "Sunrise yoga",
    "Light gardening",
    "Park visit",
    "Gentle cycling"
  ],
  afternoon: [
    "Afternoon stroll",
    "Outdoor exercise",
    "Nature walk",
    "Garden activities",
    "Light sports"
  ],
  indoor: [
    "Indoor mobility",
    "Stretching routine",
    "Balance exercises",
    "Home workout",
    "Yoga session"
  ]
};

function pickActivity(condition, timeOfDay = 'morning', isIndoor = false) {
  const c = (condition || "").toLowerCase();
  
  // Weather-based adjustments
  if (c.includes("rain") || c.includes("storm")) {
    const indoor = ACTIVITY_POOL.indoor[Math.floor(Math.random() * ACTIVITY_POOL.indoor.length)];
    return { label: indoor, indoor: true };
  }
  
  // Time-based selection
  const pool = timeOfDay === 'morning' ? ACTIVITY_POOL.morning : ACTIVITY_POOL.afternoon;
  const activity = pool[Math.floor(Math.random() * pool.length)];
  
  // Add weather context
  if (c.includes("wind")) return { label: `${activity} (sheltered area)` };
  if (c.includes("cloud")) return { label: `${activity} (cloudy)` };
  
  return { label: activity };
}

/**
 * Build daily plan with morning and afternoon slots
 */
export function buildDailyPlan({ skinType, clothing = "normal", hours }) {
  // Parse questionnaire formats
  const parsedSkin = parseSkinType(skinType);
  const clothingType = typeof clothing === 'string' && clothing.includes('-') 
    ? parseClothing(clothing) 
    : clothing;
  
  // Clothing multiplier
  const mult = clothingType === "covered" ? 1.3 : 
               clothingType === "minimal" ? 0.75 : 
               1.0;

  // Define time windows
  const morningHours = hours.filter(h => {
    const hr = new Date(h.timeISO).getHours();
    return hr >= 7 && hr <= 10; // Early morning for vitamin D
  });
  
  const afternoonHours = hours.filter(h => {
    const hr = new Date(h.timeISO).getHours();
    return hr >= 16 && hr <= 19; // Late afternoon when UV drops
  });

  /**
   * Find best slot in a time window
   */
  function findBestSlot(bucket, timeOfDay) {
    if (!bucket.length) return null;
    
    // Filter viable hours (UV > 0 but not extreme)
    const viable = bucket.filter(h => h.uv > 0 && h.uv <= 10);
    if (!viable.length) return null;
    
    // For morning: prefer UV 2-3 (optimal for vitamin D)
    // For afternoon: prefer lowest UV (safety)
    const sorted = timeOfDay === 'morning'
      ? viable.sort((a, b) => Math.abs(a.uv - 2.5) - Math.abs(b.uv - 2.5))
      : viable.sort((a, b) => a.uv - b.uv);
    
    const best = sorted[0];
    const minutes = Math.round(minutesForUv(parsedSkin, best.uv) * mult);
    const act = pickActivity(best.condition, timeOfDay);
    
    // Generate warnings based on UV level
    let warning = null;
    if (best.uv >= 8) {
      warning = "Very high UV - Sunscreen SPF 50+, hat, and seek shade";
    } else if (best.uv >= 6) {
      warning = "High UV - Sunscreen SPF 30+, hat recommended";
    } else if (best.uv >= 3 && minutes > 20) {
      warning = "Apply sunscreen if staying longer than recommended time";
    }
    
    return {
      timeISO: best.timeISO,
      uv: Math.round(best.uv * 10) / 10,
      condition: best.condition,
      tempC: best.tempC ?? 20,
      minutes: Math.max(5, minutes),
      activity: act.label,
      indoor: !!act.indoor,
      warning: warning,
      timeOfDay: timeOfDay
    };
  }

  return {
    morning: findBestSlot(morningHours, 'morning'),
    afternoon: findBestSlot(afternoonHours, 'afternoon')
  };
}

/**
 * Build weekly plan from forecast data
 */
export function buildWeeklyPlan({ profile, forecastDaily }) {
  return forecastDaily.map(d => ({
    dateISO: d.dateISO,
    ...buildDailyPlan({ 
      skinType: profile.skinType, 
      clothing: profile.clothing, 
      hours: d.hours 
    })
  }));
}

/**
 * Generate vitamin D nutrition nudge based on questionnaire result
 */
export function vitaminDNudge(result) {
  if (!result) return "";
  
  const resultLower = result.toLowerCase();
  
  if (resultLower === "inadequate") {
    return "⚠️ This week: Add oily fish, eggs, or fortified milk 3-4 times for vitamin D boost.";
  }
  
  return "✅ Your vitamin D levels look good! Keep up balanced meals with vitamin D-rich foods.";
}

/**
 * Read and parse questionnaire result from localStorage
 */
export function getQuestionnaireProfile() {
  try {
    const stored = localStorage.getItem('questionnaire_result');
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // Parse skin type (handle "I-II" format)
    const skinType = parseSkinType(data.skin_type || data.skinType);
    
    // Parse clothing
    const clothing = parseClothing(data.clothing_coverage || data.clothingCoverage);
    
    return {
      skinType: skinType,
      clothing: clothing,
      vitaminDStatus: data.result || data.vitaminDStatus,
      riskScore: data.risk_score,
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