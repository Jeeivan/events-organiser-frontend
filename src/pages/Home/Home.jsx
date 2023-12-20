import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [userGroups, setUserGroups] = useState([]);
  const [groupCode, setGroupCode] = useState("");
  const [name, setName] = useState("");
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

  useEffect(() => {
    if (localStorage.getItem("email") === null) {
      window.location.href = "/register";
    }
  }, []);

  useEffect(() => {
    fetchUserGroups();
  }, []); // Empty dependency array ensures it runs only once after the initial render

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

  return (
    <div>
      {user && <h3>Welcome {user}!</h3>}

      <div>
        <h4>Your Groups</h4>
        {userGroups.map(group => (
          <Link to={`/groupdetailpage/${group.code}`} key={group._id}><h2>{group.name}</h2></Link>
        ))}
      </div>

      <h4>Join a Group!</h4>
      <input
        type="text"
        placeholder="Enter your group code"
        value={groupCode}
        onChange={(e) => setGroupCode(e.target.value)}
      />
      <button onClick={() => joinGroup(groupCode)}>Join</button>

      <h4>Create a Group!</h4>
      <input type="text" placeholder="Enter your group name" value={name}
        onChange={(e) => setName(e.target.value)} />
      <button onClick={createGroup}>Create</button>
    </div>
  );
}
