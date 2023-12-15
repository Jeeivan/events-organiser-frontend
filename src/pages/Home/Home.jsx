import { useEffect } from "react";

export default function Home() {
    const user = localStorage.getItem('name')

    useEffect(() => {
        if (localStorage.getItem("email") === null) {
          window.location.href = "/register";
        }
      }, []);
  return (
    <div>
        {user && <h3>Welcome {user}!</h3>}
        <h2>Your Upcoming Events</h2>
        <h4>Join a Group!</h4>
        <input type="text" placeholder="Enter your group code" />
    </div>
  )
}
