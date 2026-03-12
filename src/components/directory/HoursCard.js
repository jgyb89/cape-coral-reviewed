// components/directory/HoursCard.js

export default function HoursCard({ hours }) {
  // 1. Get today's index using standard JavaScript Date
  const currentDayIndex = new Date().getDay();

  // 2. Map the ACF fields to an array of objects from the listingdata wrapper
  const listingdata = hours.listingdata || {};
  const daysOfWeek = [
    { label: 'Sunday', value: listingdata.hoursSunday, index: 0 },
    { label: 'Monday', value: listingdata.hoursMonday, index: 1 },
    { label: 'Tuesday', value: listingdata.hoursTuesday, index: 2 },
    { label: 'Wednesday', value: listingdata.hoursWednesday, index: 3 },
    { label: 'Thursday', value: listingdata.hoursThursday, index: 4 },
    { label: 'Friday', value: listingdata.hoursFriday, index: 5 },
    { label: 'Saturday', value: listingdata.hoursSaturday, index: 6 },
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
                {/* Fallback to 'Closed' if the field is empty */}
                {day.value ? day.value : 'Closed'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
