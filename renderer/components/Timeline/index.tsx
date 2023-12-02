// components/Timeline.tsx
import React, { useState, useEffect } from 'react';

const Timeline: React.FC = () => {
  const [timelineData, setTimelineData] = useState<{ [key: string]: any[] } | null>(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const response = await fetch('/api/getTimeline?day=2023-12-02');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setTimelineData(data);
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      }
    }

    fetchTimeline();
  }, []);

  return (
    <div>
      {timelineData && Object.entries(timelineData).map(([hour, items]) => (
        <div key={hour}>
          <h3>{hour}h</h3>
          {items.map((item, index) => (
            <div key={index}>{JSON.stringify(item)}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Timeline;