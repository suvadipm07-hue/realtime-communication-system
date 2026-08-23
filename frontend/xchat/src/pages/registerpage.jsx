import { useState } from "react";
import "./registerpage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name,setName]=useState("")

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          user_id: userId,
          password: password,
          name: name
        }
      );

      alert(response.data.message);

      // Go to login page after successful registration
      navigate("/");

    } catch (error) {

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Cannot connect to server");
      }
    }
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
          <label>Enter your name</label>

          <input
            type="text"
            placeholder="Your Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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