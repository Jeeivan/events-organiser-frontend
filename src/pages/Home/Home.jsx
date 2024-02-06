import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [userGroups, setUserGroups] = useState([]);
  const [groupCode, setGroupCode] = useState("");
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [name, setName] = useState("");
  // const [noEvents, setNoEvents] = useState(false);
  // const [noRecentEvents, setNoRecentEvents] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date())
  const user = localStorage.getItem('name');

  const fetchUserGroups = async () => {
    try {
      const userEmail = localStorage.getItem('email');
      const response = await fetch(`http://localhost:3006/group/display/${userEmail}`);
      const data = await response.json();
      setUserGroups(data);
    } catch (error) {
      console.error("Error fetching user groups", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:3006/event/displayAll`);
      const data = await response.json();
      const filteredEvents = data.filter((event) => userGroups.some((group) => group._id === event.groupId));
      setEvents(filteredEvents)
    } catch (error) {
      console.error("Error fetching Events", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const userEmail = localStorage.getItem('email');
      const response = await fetch(`http://localhost:3006/attendance/display/user/${userEmail}`);
      const data = await response.json();
      setAttendance(data)
    } catch (error) {
      console.error("Error fetching Events", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("email") === null) {
      window.location.href = "/register";
    }
    // Update the current date every second (or as needed)
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchUserGroups();
    fetchAttendance()
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, [userGroups]); 

  const joinGroup = async (code) => {
    try {
      const userEmail = localStorage.getItem('email');
      const requestBody = {
        userEmail: userEmail,
        groupCode: code || groupCode,
      };

      const response = await fetch(`http://localhost:3006/group/join/${userEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("User joined the group successfully");
        // Refresh the user groups after joining
        fetchUserGroups();
        setGroupCode("");
      } else {
        console.log("Failed to join the group");
      }
    } catch (error) {
      console.error("Error joining the group", error);
    }
  };

  async function createGroup() {
    try {
      const response = await fetch('http://localhost:3006/group/create/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        console.log("Created group successfully");
        setName("")

        const createdGroup = await response.json();

        // Join the created group
        await joinGroup(createdGroup.code)
      } else {
        console.log("Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group", error)
    }
  }

  function getDays (y, m) {
    return new Date(y, m, 0).getDate()
  }

  function compareDates(date) {
    const newDate = date[3] + date[4] + '/' + date[0] + date[1] + '/' + date[6] + date[7] + date[8] + date[9]
    const dateString = newDate;
    const dateObject = new Date(dateString);
    const maxDays = getDays(currentDate.getFullYear(), currentDate.getMonth() + 1)
    if (dateObject.getFullYear() === currentDate.getFullYear()) {
      if (dateObject.getMonth() === currentDate.getMonth()) {
        if (dateObject.getDate() === currentDate.getDate()) {
          return 'Today'
        } else if (dateObject.getDate() - currentDate.getDate() < 7) {
          if (dateObject.getDate() - currentDate.getDate() === 1) {
            return dateObject.getDate() - currentDate.getDate() + ' day'
          } else {
          return dateObject.getDate() - currentDate.getDate() + ' days'
        }
      }else {
        return false
      }
      } else if (dateObject.getMonth() - currentDate.getMonth() === 1) {
        if(maxDays - currentDate.getDate() + dateObject.getDate() <= 7){
          return maxDays - currentDate.getDate() + dateObject.getDate() + ' days'
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  function compareRecentDates(date) {
    const newDate = date[3] + date[4] + '/' + date[0] + date[1] + '/' + date[6] + date[7] + date[8] + date[9]
    const dateString = newDate;
    const dateObject = new Date(dateString);
    const maxDays = getDays(date[6] + date[7] + date[8] + date[9], date[3] + date[4])
    if (dateObject.getFullYear() === currentDate.getFullYear()) {
      if (dateObject.getMonth() === currentDate.getMonth()) {
        if (dateObject.getDate() === currentDate.getDate()) {
          return false
        } else if (dateObject.getDate() < currentDate.getDate()){
          return currentDate.getDate() - dateObject.getDate()
        }
      } else if (dateObject.getMonth() - currentDate.getMonth() === 1) {
        return false
      } else if (currentDate.getMonth() - dateObject.getMonth() === 1) {
        if(maxDays - dateObject.getDate() + currentDate.getDate() === 1){
          return maxDays - dateObject.getDate() + currentDate.getDate() + ' day'
        } else 
        return maxDays - dateObject.getDate() + currentDate.getDate() + ' days'
      }
    } else {
      return false
    }
  }

  function checkAttending(event) {
    const a = attendance.filter((attend) => (attend.eventId === event._id && attend.going === true))
    if (a.length > 0) {
      return true
    } else {
      return false
    }
  }

  function findGroup(event) {
    return userGroups
      .filter((group) => group._id === event.groupId)
      .reduce((acc, group) => group.name, '');
  }

  return (
    <div className="container mx-auto p-6">
      {user && <h3 className="text-2xl font-bold mb-4">Welcome {user}!</h3>}

      <div className="mt-4 mb-8">
        <h4 className="text-xl font-semibold mb-2">Your Groups</h4>
        {userGroups.map(group => (
          <Link
            to={`/groupdetailpage/${group.code}`}
            key={group._id}
            className="block bg-gray-100 p-4 rounded-md mb-2 hover:bg-gray-200"
          >
            <h2 className="text-lg font-semibold">{group.name}</h2>
          </Link>
        ))}
      </div>

      <div className="mb-8 text-center">
        <h4 className="text-xl font-semibold mb-2">Join a Group!</h4>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="text"
            placeholder="Enter your group code"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            className="border p-2 w-55 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => joinGroup(groupCode)}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Join
          </button>
        </div>
      </div>

      <div className="text-center">
        <h4 className="text-xl font-semibold mb-2">Create a Group!</h4>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="text"
            placeholder="Enter your group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-55 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={createGroup}
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-700"
          >
            Create
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <hr className="border-t-2 border-gray-300 mb-4 mt-8"/>
        <h2 className="text-2x1 font-semibold mb-4 text-blue-500">Upcoming Events</h2>
        {events.map((event, index) => (
          <div key={index}>
            {checkAttending(event) &&
              compareDates(event.date) &&
              <div>You have <span className="text-blue-500 cursor-pointer" onClick={() => window.location.href = `/event/${event._id}`}>{event.name}</span> in {compareDates(event.date)} with {findGroup(event)}</div>
            }
          </div>
        ))}
        <hr className="border-t-2 border-gray-300 mb-4 mt-4"/>
        
        <h2 className="text-2x1 font-semibold mb-4 text-red-500">Recent Events</h2>
        
        {events.map((event, index) => (
          <div key={index}>
            {checkAttending(event) &&
              compareRecentDates(event.date) &&
              <div>You had <span className="text-red-500 cursor-pointer" onClick={() => window.location.href = `/event/${event._id}`}>{event.name}</span> {compareRecentDates(event.date)} days ago with {findGroup(event)}</div>
            }
          </div>
        ))}
       <hr className="border-t-2 border-gray-300 mb-4 mt-4"/>
      </div>
    </div>
  );
}