import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function EventDetail() {
    const { eventId } = useParams();
    const [events, setEvents] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [messages, setMessages] = useState([])
    const [eventMessage, setEventMessage] = useState('')
    const navigate = useNavigate();
    const groupId = localStorage.getItem('groupId')
    const email = localStorage.getItem('email')
    const groupCode = localStorage.getItem('groupCode')

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
        fetchMessages();
        fetchGroupMembers();
        // eslint-disable-next-line
      }, [groupId]);

      useEffect(() => {
        const interval = setInterval(() => {
          fetchMessages();
        }, 2000);
    
        return () => clearInterval(interval);
        // eslint-disable-next-line
      }, [groupId]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:3006/chat/display/${eventId}`);
            const data = await response.json()
            if (response.ok) {
                setMessages(data)
                console.log(data);
            } else {
                console.log('Failed to fetch messages');
            } 
        } catch (error) {
            console.error('Error fetching messages', error)
        }
    }

      const fetchGroupMembers = async () => {
        try {
          const response = await fetch(`http://localhost:3006/users/display/${groupId}`);
          const data = await response.json();
    
          if (response.ok) {
            setGroupMembers(data);
          } else {
            console.log('Failed to fetch group members');
          }
        } catch (error) {
          console.error('Error fetching group members:', error);
        }
      };

    //   useEffect(() => {
    //     if (groupId) {
    //       fetchGroupMembers();
    //     }
    //   }, [groupId]);

async function createMessage() {
    try {
        const response = await fetch(`http://localhost:3006/chat/create/${eventId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email, 
                message: eventMessage,
            }),
        })

        if (response.ok) {
            console.log("Message created succesfully");
            fetchMessages()
            setEventMessage('')
        } else {
            console.error("Error creating message")
        }
    } catch (error) {
        console.error("Error creating message:", error)
    }
}

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
              <h3>Group Members</h3>
      <ul>
        {groupMembers.map((member) => (
            <li key={member._id}>{member.name}</li>
        ))}
      </ul>
              <h3>Event:</h3>
        <p>{events.name}</p>
        <p>{events.description}</p>
        <p>{events.location}</p>
        <p>{events.date}</p>
        <button onClick={deleteEvent}>Delete Event</button>
        <Link to={`/groupdetailpage/${groupCode}`}>
            <button>Create Event</button>
        </Link>
        <h3>Chat</h3>
        <ul>
            {messages.map((message) => (
                <li key={message._id}>
                    <p>{message.userName} says</p>
                    <p>At {new Date(message.date).toLocaleTimeString()}</p>
                    <p>{message.message}</p>
                </li>
            ))}
        </ul>
        <input type="text" placeholder="Message" value={eventMessage}
        onChange={(e) => setEventMessage(e.target.value)}/>
        <button onClick={createMessage}>Send</button>
    </div>
  )
}
