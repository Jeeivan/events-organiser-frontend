import { Link } from "react-router-dom"
import { useState } from "react"

export default function SignUp() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [passwordError, setPasswordError] = useState("");

    async function createUser() {
        try {
            if (password !== passwordConfirmation) {
                setPasswordError("Passwords do not match")
                return 
            }

            const response = await fetch(`http://localhost:3006/users/register`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: name,
                email: email,
                password: password,
              }),
            });
            if (response.ok) {
                console.log("User created successfully");
                localStorage.setItem("name", name)
                localStorage.setItem("email", email)
                window.location.href = "/";
              } else {
                console.log("Failed to create user");
              }
        } catch (error) {
                console.error("Error creating user", error);
              }
            }


    const handleSubmit = (e) => {
        e.preventDefault()
        createUser()
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 focus:outline-none focus:border-blue-500"
                required
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
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="passwordConfirmation"
                className="block text-sm font-semibold"
              >
                Password Confirmation
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="passwordConfirmation"
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full border p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Register
            </button>
          </form>
          {passwordError && (
            <p style={{ color: "red" }} className="text-sm mt-4">
              {passwordError}
            </p>
          )}
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      );
    }