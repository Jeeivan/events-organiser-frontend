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

  console.log(groupId);

  async function fetchGroupId() {
    try {
        const response = await fetch(`http://localhost:3006/group/display/single/${groupCode}`)
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
          const response = await fetch(`http://localhost:3006/users/display/${groupId}`);
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
      const response = await fetch(`http://localhost:3006/event/display/${groupCode}`);
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
  }, [groupId]);

  async function createEvent() {
    try {
        const response = await fetch(`http://localhost:3006/event/create/${groupId}`, {
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
        } else {
          console.log("Failed to create event");
        }
      } catch (error) {
        console.error("Error creating event", error)
      }
     }

  return (
    <div>
      <h2>Group Code - {groupCode}</h2>
      <h3>Group Members</h3>
      <ul>
        {groupMembers.map((member) => (
            <li key={member._id}>{member.name}</li>
        ))}
      </ul>
      <h3>Events:</h3>
      <ul>
        {events.map(event => (
        <div key={event._id}>
            <Link to={`/event/${event._id}`}>
              <p>{event.name}</p>
            </Link>
      </div>
        ))}
      </ul>
      <h3>Create Event:</h3>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Location:
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>
      <label>
        Date:
        <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Time:
        <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />
      </label>
      <button onClick={createEvent}>Create Event</button>
    </div>
  );
}
