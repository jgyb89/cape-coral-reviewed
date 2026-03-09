// components/directory/HoursCard.js

export default function HoursCard({ hours }) {
  // 1. Get today's index using standard JavaScript Date
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  const currentDayIndex = new Date().getDay();

  // 2. Map the WordPress fields to an array of objects
  // This allows us to easily map over them in the UI and apply logic
  const daysOfWeek = [
    { label: 'Sunday', value: hours.hoursSunday, index: 0 },
    { label: 'Monday', value: hours.hoursMonday, index: 1 },
    { label: 'Tuesday', value: hours.hoursTuesday, index: 2 },
    { label: 'Wednesday', value: hours.hoursWednesday, index: 3 },
    { label: 'Thursday', value: hours.hoursThursday, index: 4 },
    { label: 'Friday', value: hours.hoursFriday, index: 5 },
    { label: 'Saturday', value: hours.hoursSaturday, index: 6 },
  ];

  // 3. Reorder the array so Monday is the first day of the week in the UI
  const displayOrder = [
    daysOfWeek[1], daysOfWeek[2], daysOfWeek[3], 
    daysOfWeek[4], daysOfWeek[5], daysOfWeek[6], daysOfWeek[0]
  ];

  return (
    <div className="hours-card">
      <div className="hours-card__header">
        <h3 className="hours-card__title">Business Hours</h3>
      </div>

      <ul className="hours-card__list">
        {displayOrder.map((day) => {
          // Check if this specific list item represents today
          const isToday = day.index === currentDayIndex;

          return (
            <li 
              key={day.label} 
              className={`hours-card__item ${isToday ? 'hours-card__item--today' : ''}`}
            >
              <span className="hours-card__day">
                {day.label} 
                {isToday && <span className="hours-card__badge"> (Today)</span>}
              </span>
              
              <span className="hours-card__time">
                {/* Fallback to 'Closed' if the WordPress field is empty */}
                {day.value ? day.value : 'Closed'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
