import { Link } from "react-router-dom"
import { useState, useEffect } from "react";

export default function Navbar() {
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
      if (localStorage.getItem("email") !== null) {
        setIsAuth(true);
      }
    }, [isAuth]);
  return (
    <div className="NavBar">
    <h1>Events Organiser</h1>
<nav>
{isAuth ? (
    <>
    <Link to='/'>Home</Link>
    <Link to='/logout'>Logout</Link>
    </>
  ) : (
    <>
    <Link to='/login'>Login</Link>
    <Link to='/register'>Sign Up</Link>
    </>
  )}
</nav>
</div>
  )
}
