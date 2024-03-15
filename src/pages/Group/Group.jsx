import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Group() {
  const { groupCode } = useParams();
  localStorage.setItem("groupCode", groupCode)
  const [events, setEvents] = useState([]);
  const [groupId, setGroupId] = useState('')
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false)
  const email = localStorage.getItem('email')

  console.log(groupId);

  async function fetchGroupId() {
    try {
        const response = await fetch(`${process.env.BACKEND_API}group/display/single/${groupCode}`)
        const data = await response.json()
        console.log(data);

        if (response.ok) {
            setGroupId(data._id);
            localStorage.setItem("groupId", data._id)
          } else {
            console.log('Failed to fetch Id');
          }
        } catch (error) {
          console.error('Error fetching events', error);
        }
      };

      const fetchGroupMembers = async () => {
        try {
          const response = await fetch(`${process.env.BACKEND_API}users/display/${groupId}`);
          const data = await response.json();
    
          if (response.ok) {
            setGroupMembers(data);
          } else {
            console.log('Failed to fetch group members');
          }
        } catch (error) {
          console.error('Error fetching group members', error);
        }
      };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_API}event/display/${groupCode}`);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setEvents(data);
        // const Id = data.length > 0 ? data[0].groupId : null;
      } else {
        console.log('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchGroupId();
    // eslint-disable-next-line
  }, [groupCode]);

  useEffect(() => {
    if (groupId) {
      fetchGroupMembers();
    }
    // eslint-disable-next-line
  }, [groupId]);

  async function createEvent() {
    try {
        const response = await fetch(`${process.env.BACKEND_API}/event/create/${groupId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            name,
            description,
            location,
            date,
            time,
            groupId: groupId
           }),
        })
    
        if (response.ok) {
          console.log("Created event successfully");
          fetchEvents()
          // Clear the input fields
          setName('');
          setDescription('');
          setLocation('');
          setDate('');
          setTime('');
          setIsFormOpen(false)
        } else {
          console.log("Failed to create event");
        }
      } catch (error) {
        console.error("Error creating event", error)
      }
     }

     async function leaveGroup() {
      try {
        const response = await fetch(`${process.env.BACKEND_API}users/leave`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            groupId: groupId,
          }),
        });
    
        if (response.ok) {
          console.log('User successfully left the group');
          window.location.href = "/";
        } else {
          console.log("Error leaving group");
        }
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
    
     return (
        <div className="container mx-auto p-6">
          <h2 className="text-3xl font-bold mb-4">Group Code - {groupCode}</h2>
          <p className='mb-4'>Give this code to allow others to join your group!</p>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Group Members</h3>
            <ul className="list-none p-0">
              {groupMembers.map((member) => (
                  <li key={member._id} className="mb-2">{member.name}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={leaveGroup}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-5"
          >
            Leave Group
          </button>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Events</h3>
            <ul className="list-none p-0">
              {events.map(event => (
                <li key={event._id} className="mb-2">
                  <Link to={`/event/${event._id}`} className="text-blue-500 hover:underline">
                    {event.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Create Event</h3>
            <button type='button' onClick={() => setIsFormOpen(!isFormOpen)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-2">{isFormOpen ? 'Close Form' : 'Open Form'}</button>
            {isFormOpen && (

            <form>
          <label className="block mb-2">
            <span className="text-gray-700">Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter the Name of Event"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Description:</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter the Description of Event"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Location:</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter the Location of Event"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Date:</span>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter the Date of Event"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Time:</span>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border p-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter the Time of Event"
            />
          </label>
          <button
            type="button"
            onClick={createEvent}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Event
          </button>
        </form>
        )}
          </div>
        </div>
      );
    }