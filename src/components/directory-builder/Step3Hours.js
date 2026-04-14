'use client';
import React, { useState } from 'react';
import styles from './StepForm.module.css';
import wizardStyles from './ListingWizard.module.css';

const Step3Hours = ({ formData, updateFormData, nextStep, prevStep }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Local state holds temporary typing values so we don't format mid-keystroke
  const [tempInputs, setTempInputs] = useState({});

  // Smart Parser: Converts "9", "1430", "2100", etc. into standard "HH:MM PM"
  const parseTimeInput = (val, currentAmPm) => {
    let digits = val.replace(/\D/g, '');
    if (!digits) return { time: '12:00', ampm: currentAmPm }; // Fallback

    let hours = 0;
    let minutes = 0;
    let ampm = currentAmPm;

    if (digits.length <= 2) {
      let h = parseInt(digits, 10);
      if (h > 24) h = 24;
      if (h === 0 || h === 24) { hours = 12; ampm = 'AM'; }
      else if (h === 12) { hours = 12; ampm = 'PM'; }
      else if (h > 12) { hours = h - 12; ampm = 'PM'; }
      else { hours = h; }
    } else if (digits.length === 3) {
      let h = parseInt(digits.slice(0, 1), 10);
      let m = parseInt(digits.slice(1, 3), 10);
      if (m > 59) m = 59;
      if (h === 0) { hours = 12; ampm = 'AM'; }
      else { hours = h; }
      minutes = m;
    } else {
      let h = parseInt(digits.slice(0, 2), 10);
      let m = parseInt(digits.slice(2, 4), 10);
      if (m > 59) m = 59;
      if (h > 24) h = 24;
      if (h === 0 || h === 24) { hours = 12; ampm = 'AM'; }
      else if (h === 12) { hours = 12; ampm = 'PM'; }
      else if (h > 12) { hours = h - 12; ampm = 'PM'; }
      else { hours = h; }
      minutes = m;
    }

    return { time: `${hours}:${minutes.toString().padStart(2, '0')}`, ampm };
  };

  const handleTimeBlur = (day, type, value) => {
    const current = formData.hours?.[day] || '9:00 AM - 5:00 PM';
    const [openStr, closeStr] = current === 'Closed' ? ['9:00 AM', '5:00 PM'] : current.split(' - ');

    let [openTime, openAmPm] = openStr.split(' ');
    let [closeTime, closeAmPm] = closeStr.split(' ');

    if (type === 'open') {
      const parsed = parseTimeInput(value, openAmPm);
      openTime = parsed.time; openAmPm = parsed.ampm;
    } else {
      const parsed = parseTimeInput(value, closeAmPm);
      closeTime = parsed.time; closeAmPm = parsed.ampm;
    }

    updateFormData({ hours: { ...formData.hours, [day]: `${openTime} ${openAmPm} - ${closeTime} ${closeAmPm}` } });

    // Clear temporary input so it snaps to the globally formatted string
    setTempInputs(prev => {
      const newState = { ...prev };
      delete newState[`${day}-${type}`];
      return newState;
    });
  };

  const handleAmPmChange = (day, type, newAmPm) => {
    const current = formData.hours?.[day] || '9:00 AM - 5:00 PM';
    const [openStr, closeStr] = current === 'Closed' ? ['9:00 AM', '5:00 PM'] : current.split(' - ');
    let [openTime, openAmPm] = openStr.split(' ');
    let [closeTime, closeAmPm] = closeStr.split(' ');

    if (type === 'open') openAmPm = newAmPm;
    if (type === 'close') closeAmPm = newAmPm;
    updateFormData({ hours: { ...formData.hours, [day]: `${openTime} ${openAmPm} - ${closeTime} ${closeAmPm}` } });
  };

  const handleClosedToggle = (day, isClosed) => {
    if (isClosed) updateFormData({ hours: { ...formData.hours, [day]: 'Closed' } });
    else updateFormData({ hours: { ...formData.hours, [day]: '9:00 AM - 5:00 PM' } });
  };

  return (
    <div className={styles['step-form']}>
      <header className={styles['step-form__header']}>
        <span className="material-symbols-outlined">schedule</span>
        <h2>Business Hours</h2>
      </header>
      
      <div className={styles['step-form__group']}>
        <label className={styles['step-form__label']}>Timezone</label>
        <select className={styles['step-form__select']} value={formData.timezone} onChange={(e) => updateFormData({ timezone: e.target.value })}>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
        </select>
      </div>

      <div className={styles['step-form__group']} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="is247" checked={formData.is247 || false} onChange={(e) => updateFormData({ is247: e.target.checked })} style={{ width: 'auto' }} />
        <label htmlFor="is247" className={styles['step-form__label']} style={{ marginBottom: 0 }}>Open 24/7</label>
      </div>

      {!formData.is247 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 60px', gap: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#666' }}>Day</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#666' }}>Hours</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>Closed</span>
          </div>

          {days.map((day) => {
            const isClosed = formData.hours?.[day] === 'Closed';
            const [openStr, closeStr] = isClosed ? ['9:00 AM', '5:00 PM'] : (formData.hours?.[day] || '9:00 AM - 5:00 PM').split(' - ');
            const [openTime, openAmPm] = openStr.split(' ');
            const [closeTime, closeAmPm] = closeStr.split(' ');

            // Prefer temporary typing value, fallback to global formatted state
            const displayOpen = tempInputs[`${day}-open`] !== undefined ? tempInputs[`${day}-open`] : openTime;
            const displayClose = tempInputs[`${day}-close`] !== undefined ? tempInputs[`${day}-close`] : closeTime;

            return (
              <div key={day} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 60px', alignItems: 'center', gap: '1rem' }}>
                <label className={styles['step-form__label']} style={{ marginBottom: 0, color: isClosed ? '#999' : 'inherit' }}>{day}</label>
                
                <div style={{ display: 'flex', gap: '0.5rem', opacity: isClosed ? 0.5 : 1, pointerEvents: isClosed ? 'none' : 'auto', alignItems: 'center' }}>
                  <input 
                    type="text" className={styles['step-form__input']} style={{ width: '70px', textAlign: 'center', padding: '0.5rem' }} 
                    value={displayOpen} 
                    onChange={(e) => setTempInputs(prev => ({ ...prev, [`${day}-open`]: e.target.value }))} 
                    onBlur={(e) => handleTimeBlur(day, 'open', e.target.value)} 
                  />
                  <select className={styles['step-form__select']} style={{ width: 'auto', padding: '0.5rem' }} value={openAmPm} onChange={(e) => handleAmPmChange(day, 'open', e.target.value)}>
                    <option value="AM">AM</option><option value="PM">PM</option>
                  </select>

                  <span style={{ color: '#666', fontSize: '0.9rem' }}>to</span>

                  <input 
                    type="text" className={styles['step-form__input']} style={{ width: '70px', textAlign: 'center', padding: '0.5rem' }} 
                    value={displayClose} 
                    onChange={(e) => setTempInputs(prev => ({ ...prev, [`${day}-close`]: e.target.value }))} 
                    onBlur={(e) => handleTimeBlur(day, 'close', e.target.value)} 
                  />
                  <select className={styles['step-form__select']} style={{ width: 'auto', padding: '0.5rem' }} value={closeAmPm} onChange={(e) => handleAmPmChange(day, 'close', e.target.value)}>
                    <option value="AM">AM</option><option value="PM">PM</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input type="checkbox" checked={isClosed} onChange={(e) => handleClosedToggle(day, e.target.checked)} style={{ width: 'auto', margin: 0, cursor: 'pointer', transform: 'scale(1.2)' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={wizardStyles['wizard__actions']}>
        <button className={`${wizardStyles['wizard__button']} ${wizardStyles['wizard__button--secondary']}`} onClick={prevStep}>Back</button>
        <button className={`${wizardStyles['wizard__button']} ${wizardStyles['wizard__button--primary']}`} onClick={nextStep}>Next</button>
      </div>
    </div>
  );
};
export default Step3Hours;
