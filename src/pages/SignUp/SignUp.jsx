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
    <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">
                    <strong>Name</strong>
                </label>
                <input type="text" placeholder='Enter Name' name='email' onChange={(e) => setName(e.target.value)}/>
            </div>
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
            <div>
                <label htmlFor="email">
                    <strong>Password Confirmation</strong>
                </label>
                <input type="password" placeholder='Enter Password' name='password' onChange={(e) => setPasswordConfirmation(e.target.value)}/>
            </div>
            <button type='submit'>
                Register
            </button>
        </form>
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
            <p>Already have an account?</p>
            <Link to="/login">
                Login
            </Link>
    </div>
  )
}
