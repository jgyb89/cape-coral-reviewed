/**
 * Utility to check if a business is currently open based on its ACF hours.
 * Uses Florida timezone (America/New_York).
 */
export function checkIfOpenNow(listingData) {
  if (!listingData) return false;

  // 1. Get current time in Cape Coral (Florida)
  const capeCoralTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const localDate = new Date(capeCoralTime);
  
  const currentDay = localDate.getDay(); // 0 (Sun) to 6 (Sat)
  const currentMinutes = localDate.getHours() * 60 + localDate.getMinutes();

  // 2. Map day to ACF key
  const dayMap = {
    1: 'hoursMonday',
    2: 'hoursTuesday',
    3: 'hoursWednesday',
    4: 'hoursThursday',
    5: 'hoursFriday',
    6: 'hoursSaturday',
    0: 'hoursSunday'
  };

  const dayKey = dayMap[currentDay];
  const hoursStr = listingData[dayKey];

  // 3. Basic status checks
  if (!hoursStr || hoursStr.toLowerCase() === 'closed') return false;
  if (hoursStr.toLowerCase() === '24 hours') return true;

  // 4. Parse "09:00 AM - 05:00 PM"
  // Remove ^ and $ anchors, trim string, and allow various dashes
  const safeHoursStr = hoursStr.trim();
  const match = safeHoursStr.match(/(\d{1,2}:\d{2})\s*(AM|PM)\s*[-–—to]+\s*(\d{1,2}:\d{2})\s*(AM|PM)/i);
  if (!match) return false;

  const [_, startTime, startPeriod, endTime, endPeriod] = match;

  const timeToMinutes = (timeStr, period) => {
    let [hours, minutes] = timeStr.split(':').map(Number);
    const isPM = period.toUpperCase() === 'PM';
    
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  const openMinutes = timeToMinutes(startTime, startPeriod);
  let closeMinutes = timeToMinutes(endTime, endPeriod);

  // 5. Comparison
  // Handle shifts that cross midnight (e.g., 5 PM - 2 AM)
  if (closeMinutes < openMinutes) {
    // Current time is either after opening today or before closing tomorrow morning
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}
