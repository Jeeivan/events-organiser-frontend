import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

export default function EventDetail() {
    const { eventId } = useParams();
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        try {
          const response = await fetch(`http://localhost:3006/event/display/single/${eventId}`);
          const data = await response.json();
          if (response.ok) {
            setEvents(data);
          } else {
            console.log('Failed to fetch events');
          }
        } catch (error) {
          console.error('Error fetching events', error);
        }
      };
    
      useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line
      }, []);

  return (
    <div>
              <h3>Events:</h3>
        <p>{events.name}</p>
        <p>{events.description}</p>
        <p>{events.location}</p>
        <p>{events.date}</p>
    </div>
  )
}
