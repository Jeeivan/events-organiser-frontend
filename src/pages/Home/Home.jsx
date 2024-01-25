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
      <h4 className="text-xl font-semibold mb-2">Create a Group</h4>
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
  </div>
);
}