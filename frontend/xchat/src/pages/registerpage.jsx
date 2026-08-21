import { useState } from "react";
import "./registerpage.css";

function RegisterPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    console.log("Register User ID:", userId);
    console.log("Register Password:", password);

    alert("register button clicked!");
  };

  return (
    <div className="register-page">
      <div className="register-box">

        <div className="logo">
          x<span>chat</span>
        </div>

        <p className="subtitle">
          Register to continue to xchat
        </p>

        <form onSubmit={handleRegister}>

          <label>New User ID</label>
          <input
            type="text"
            placeholder="user ID should be unique"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>


      </div>
    </div>
  );
}

export default RegisterPage;