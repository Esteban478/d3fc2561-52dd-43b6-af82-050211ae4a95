import { useEffect } from 'react';
import { Event } from '../Types/Event';
import URL from '../Constant/URL';

const useFetchEvents = (setEvents: (events: Event[]) => void): void => {
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(URL.BASE_URL);
        const events = (await response.json()) as Event[];
        setEvents(events);
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.log('Aborted');
          return;
        }
      }
    };

    fetchEvents();
  }, [setEvents]);
};

export default useFetchEvents;