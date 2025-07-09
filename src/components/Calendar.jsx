import React, { useState } from 'react';
import { getMonthDays, MONTHS } from '../utils/dateHelpers';

const Calendar = ({ 
  selectedMonth, 
  periods, 
  getPeriodsForDate, 
  onDateRangeSelect,
  selectedDays,
  setSelectedDays,
  onPrevMonth,
  onNextMonth
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const monthData = MONTHS[selectedMonth];
  const days = getMonthDays(selectedMonth, monthData.year);

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const handleMouseDown = (day) => {
    if (day.isEmpty) return;
    
    setIsDragging(true);
    setDragStart(day.date);
    setSelectedDays([day.date]);
  };

  const handleMouseEnter = (day) => {
    if (!isDragging || day.isEmpty || !dragStart) return;
    
    const startDate = new Date(dragStart);
    const currentDate = new Date(day.date);
    
    if (currentDate >= startDate) {
      // Forward selection
      const range = [];
      const current = new Date(startDate);
      while (current <= currentDate) {
        range.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
      setSelectedDays(range);
    } else {
      // Backward selection
      const range = [];
      const current = new Date(currentDate);
      while (current <= startDate) {
        range.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
      setSelectedDays(range);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && selectedDays.length > 0) {
      setIsDragging(false);
      setDragStart(null);
      
      // Sort selected days
      const sortedDays = [...selectedDays].sort();
      const dateDebut = sortedDays[0];
      const dateFin = sortedDays[sortedDays.length - 1];
      
      onDateRangeSelect({ dateDebut, dateFin, jours: sortedDays });
    }
  };

  const handleDayClick = (day) => {
    if (day.isEmpty) return;
    
    // Simple click selection (without dragging)
    if (!isDragging) {
      setSelectedDays([day.date]);
      onDateRangeSelect({ 
        dateDebut: day.date, 
        dateFin: day.date, 
        jours: [day.date] 
      });
    }
  };

  const getDayStyle = (day) => {
    let classes = 'relative w-full h-12 border border-gray-200 cursor-pointer transition-all duration-200 flex items-center justify-center text-sm font-medium';
    if (day.isOtherMonth) {
      classes += ' bg-gray-100 text-gray-400';
    } else if (selectedDays.includes(day.date)) {
      classes += ' bg-blue-200 border-blue-400';
    } else if (day.isWeekend) {
      classes += ' bg-gray-50 text-gray-600';
    } else {
      classes += ' bg-white hover:bg-gray-50';
    }
    return classes;
  };

  const getPeriodColors = (day) => {
    if (day.isEmpty) return null;
    
    const periodsForDay = getPeriodsForDate(day.date);
    if (periodsForDay.length === 0) return null;
    
    return (
      <div className="absolute inset-0 flex">
        {periodsForDay.slice(0, 3).map((period, index) => (
          <div
            key={period.id}
            className="flex-1 opacity-60"
            style={{ backgroundColor: period.couleur }}
            title={period.nom}
          />
        ))}
        {periodsForDay.length > 3 && (
          <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-1 rounded">
            +{periodsForDay.length - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="relative flex items-center justify-center mb-6">
        <button
          onClick={onPrevMonth}
          disabled={!onPrevMonth}
          className={`absolute left-0 px-10 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${!onPrevMonth ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Mois précédent"
        >
          &#8592;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center min-w-[120px]">
          {monthData.name} {monthData.year}
        </h2>
        <button
          onClick={onNextMonth}
          disabled={!onNextMonth}
          className={`absolute right-0 px-10 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${!onNextMonth ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Mois suivant"
        >
          &#8594;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>
      
      <div 
        className="grid grid-cols-7 gap-1 select-none"
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging) {
            handleMouseUp();
          }
        }}
      >
        {days.map((day, index) => (
          <div
            key={index}
            className={getDayStyle(day)}
            onMouseDown={() => handleMouseDown(day)}
            onMouseEnter={() => handleMouseEnter(day)}
            onClick={() => handleDayClick(day)}
          >
            {getPeriodColors(day)}
            <span className="relative z-10">
              {day.dayNumber}
            </span>
          </div>
        ))}
      </div>
      
      {selectedDays.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedDays.length === 1 
              ? `Jour sélectionné : ${selectedDays[0]}`
              : `Période sélectionnée : ${selectedDays[0]} → ${selectedDays[selectedDays.length - 1]} (${selectedDays.length} jours)`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Calendar; 