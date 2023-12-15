import { useState } from "react"
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    async function login() {
        try {
            const response = await fetch(`http://localhost:3006/users/login`, {
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
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">
                    <strong>Email</strong>
                </label>
                <input type="email" placeholder='Enter Email' name='email' onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="email">
                    <strong>Password</strong>
                </label>
                <input type="password" placeholder='Enter Password' name='password' onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type='submit'>
                Login
            </button>
        </form>
            <p>Don't have an account?</p>
            <Link to="/register">
                Register
            </Link>
    </div>
  )
}
