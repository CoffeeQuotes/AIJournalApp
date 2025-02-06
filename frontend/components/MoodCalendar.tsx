import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Smile, Frown, Meh, ChevronLeft, ChevronRight } from "lucide-react";

const moodColors = {
  POSITIVE: "#4CAF50",
  NEGATIVE: "#F44336",
  NEUTRAL: "#FFC107",
};

const MoodIcon = ({ mood, className = "" }) => {
  const props = {
    className: `${className} inline-block`,
    size: 16
  };

  switch (mood) {
    case "POSITIVE":
      return <Smile {...props} color={moodColors.POSITIVE} />;
    case "NEGATIVE":
      return <Frown {...props} color={moodColors.NEGATIVE} />;
    case "NEUTRAL":
      return <Meh {...props} color={moodColors.NEUTRAL} />;
    default:
      return null;
  }
};

const EventContent = ({ event }) => {
  const { mood, count } = event.extendedProps;
  
  return (
    <div className="flex items-center gap-1 px-1 py-0.5 w-full">
      <MoodIcon mood={mood} className="shrink-0" />
      <span className="text-xs font-medium truncate">
        {count}
      </span>
    </div>
  );
};

const MoodCalendar = ({ moodEntries }) => {
  const [selectedMood, setSelectedMood] = useState("ALL");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter events based on selected mood
  const filteredEvents = moodEntries
    .filter(entry => selectedMood === "ALL" || entry.mood === selectedMood)
    .map(entry => ({
      title: `${entry.count}`,
      start: entry.recorded_date,
      end: entry.recorded_date,
      backgroundColor: `${moodColors[entry.mood]}20`,
      borderColor: moodColors[entry.mood],
      textColor: moodColors[entry.mood],
      extendedProps: {
        mood: entry.mood,
        count: entry.count
      }
    }));

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-rose-800 dark:text-rose-200">
            Mood Calendar
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white appearance-none pr-8"
              >
                <option value="ALL">All Moods</option>
                <option value="POSITIVE">Positive</option>
                <option value="NEUTRAL">Neutral</option>
                <option value="NEGATIVE">Negative</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDateChange('prev')}
                className="p-2 rounded-md hover:bg-rose-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-rose-800 dark:text-rose-200" />
              </button>
              <button
                onClick={() => handleDateChange('next')}
                className="p-2 rounded-md hover:bg-rose-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-rose-800 dark:text-rose-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={filteredEvents}
          headerToolbar={false}
          height="500px"
          date={currentDate}
          eventContent={EventContent}
          dayMaxEvents={3}
          moreLinkContent={(args) => (
            <div className="text-xs font-medium text-rose-600 dark:text-rose-400">
              +{args.num} more
            </div>
          )}
          className="custom-calendar"
        />
      </div>
    </div>
  );
};

export default MoodCalendar;