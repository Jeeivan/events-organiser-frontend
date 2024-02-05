import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function EventDetail() {
    const { eventId } = useParams();
    const [events, setEvents] = useState([]);
    const [eventComplete, setEventComplete] = useState(false)
    const [groupMembers, setGroupMembers] = useState([]);
    const [messages, setMessages] = useState([])
    const [eventMessage, setEventMessage] = useState('')
    const [attendanceMembers, setAttendanceMembers] = useState([])
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
            // Check if event has occured
            const eventDate = new Date(data.date)
            const currentDate = new Date()
            setEventComplete(eventDate < currentDate)
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
        displayAttendance();
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

async function displayAttendance() {
    try {
        const response = await fetch(`http://localhost:3006/attendance/display/${eventId}`)
        const data = await response.json();

        if (response.ok) {
            setAttendanceMembers(data)
        } else {
            console.log('Failed to fetch attendance members');
        }
    } catch (error) {
        console.error("Error fetching attendance members", error)
    }
}

async function setGoing() {
    try {
        const response = await fetch(`http://localhost:3006/attendance/set/${eventId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email, 
                going: true,
            }),
        })

        if (response.ok) {
            console.log("Attendance set succesfully");
            displayAttendance()
        } else {
            console.log("Error setting attendance");
        }
    } catch (error) {
        console.error("Error setting attendance", error)
    }
}
async function setNotGoing() {
    try {
        const response = await fetch(`http://localhost:3006/attendance/set/${eventId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email, 
                going: false,
            }),
        })

        if (response.ok) {
            console.log("Attendance set succesfully");
            displayAttendance()
        } else {
            console.log("Error setting attendance");
        }
    } catch (error) {
        console.error("Error setting attendance", error)
    }
}

return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-3xl font-bold mb-4">Event Details:</h3>
          <p className="mb-2">{events.name}</p>
          <p className="mb-2">Plan- {events.description}</p>
          <p className="mb-2">Location- {events.location}</p>
          <p className="mb-2">Date- {events.date}</p>
          <p className="mb-2">Time- {events.time}</p>
          {eventComplete ? (
            <p className="text-red-500 font-bold mb-2">This event has already taken place.</p>
          ) : (
          <button
            onClick={deleteEvent}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-5"
          >
            Delete Event
          </button>
          )}
          <Link to={`/groupdetailpage/${groupCode}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create Event
            </button>
          </Link>
        </div>
        <div>
          <h3 className="text-3xl font-bold mb-4">Members Attendance</h3>
          <ul className="list-none p-0">
            {groupMembers.map((groupMember) => {
              const attendanceMember = attendanceMembers.find(
                (attendance) => attendance.userName === groupMember.name
              );
              const status = attendanceMember
                ? attendanceMember.going
                  ? "is going"
                  : "is not going"
                : "has not decided";
  
              // Conditionally set text color based on attendance status
              const textColorClass = attendanceMember
                ? attendanceMember.going
                  ? "text-green-500"
                  : "text-red-500"
                : "text-purple-500";
  
              return (
                <li key={groupMember._id} className={`mb-2 ${textColorClass}`}>
                  <p>
                    {groupMember.name} {status}
                  </p>
                </li>
              );
            })}
          </ul>
          {eventComplete ? (
            '' ) : (
              <>
          <button
            onClick={setGoing}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 mr-4"
          >
            Going
          </button>
          <button
            onClick={setNotGoing}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Not Going
          </button>
          </>
            )}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-4">Chat</h3>
        <ul className="mb-4">
          {messages.map((message, index) => (
            <li key={message._id} className="mb-4">
            <p className="text-gray-700">
              {message.userName} says
              {index === messages.length - 1 && (
                <> at {new Date(message.date).toLocaleString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})}</>
              )}
            </p>
              <p>{message.message}</p>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Type Your Message Here"
            value={eventMessage}
            onChange={(e) => setEventMessage(e.target.value)}
            className="border p-2 w-full focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={createMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}