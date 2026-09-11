import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./loginpage.css";

const LoginPage=()=> {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://realtime-communication-system.onrender.com/login",
        {
          user_id: userId,
          password: password
        }
      );

      console.log("Login response:", response.data);

      // Store JWT token
      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      alert(response.data.message);

      // Clear input fields
      setUserId("");
      setPassword("");

      navigate("/chat");

    } catch (error) {

      console.log("Login error:", error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Cannot connect to server");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="logo">
          You<span>Chat</span>
        </div>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Login to continue to YouChat
        </p>

        <form onSubmit={handleLogin}>
          <label>User ID</label>

          <input
            type="text"
            placeholder="Enter your user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          
          <button type="submit" className="link">
            Login
          </button>
          

        </form>

        <Link className="link" to="/register">
          <p className="signup">
            Don't have an account? <span>Sign up</span>
          </p>
        </Link>

      </div>
    </div>
  );
}

export default LoginPage;