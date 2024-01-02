import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

export default function EventDetail() {
    const { eventId } = useParams();
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

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

async function deleteEvent() {
    try {
        const response = await fetch(`http://localhost:3006/event/delete/${eventId}`, {
            method: "DELETE"
        })
        if (response.ok) {
            console.log("Event deleted successfully");
            // Navigate back to the previous page
            navigate(-1);
        } else {
            console.error("Error deleting event");
        }
    } catch (error) {
        console.error("Error deleting event:", error);
    }
}

  return (
    <div>
              <h3>Events:</h3>
        <p>{events.name}</p>
        <p>{events.description}</p>
        <p>{events.location}</p>
        <p>{events.date}</p>
        <button onClick={deleteEvent}>Delete Event</button>
    </div>
  )
}
