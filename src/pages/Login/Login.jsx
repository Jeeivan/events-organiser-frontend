import { useState } from "react"
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    async function login() {
        try {
            const response = await fetch(`https://events-organiser-backend-production.up.railway.app/users/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            });
            if (response.ok) {
                console.log("Logged in Successfully");
                localStorage.setItem("email", email)
                window.location.href = "/";
              } else {
                console.log("Failed to login user");
              }
        } catch (error) {
                console.error("Error creating user", error);
              }
            }


    const handleSubmit = (e) => {
        e.preventDefault()
        login()
    }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500">
          Register
        </Link>
      </p>
    </div>
  );
}