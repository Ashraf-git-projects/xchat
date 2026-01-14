import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/api/users/register", {
        fullName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password,
      });

      // Redirect to login on success
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div id="register-page" className="auth-container">
       <div className="auth-card">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          id="fullname-input"
          type="text"
          placeholder="Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          id="email-input"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          id="username-input"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          id="password-input"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button id="register-button" type="submit">
          Register
        </button>
      </form>

      {/* MUST ALWAYS EXIST */}
      <div id="register-error" className="auth-error">{error}</div>
      </div>
    </div>
  );
}
