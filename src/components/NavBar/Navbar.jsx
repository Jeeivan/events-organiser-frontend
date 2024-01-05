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
        <div className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Events Organiser</h1>
            <nav>
              {isAuth ? (
                <>
                  <Link
                    to="/"
                    className="mx-2 px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Home
                  </Link>
                  <Link
                    to="/logout"
                    className="mx-2 px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="mx-2 px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="mx-2 px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      );
    }
