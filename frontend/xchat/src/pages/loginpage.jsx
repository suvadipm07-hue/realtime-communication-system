import { useState } from "react";
import{ Link} from "react-router-dom"
import "./LoginPage.css";

function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("User ID:", userId);
    console.log("Password:", password);
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="logo">
          x<span>chat</span>
        </div>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Login to continue to xchat
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

          <button type="submit">
            Login
          </button>

        </form>
        <Link className="link" to='/register'> 
          <p className="signup">
          Don't have an account? <span>Sign up</span>
        </p>

        </Link>
            

       
      </div>
    </div>
  );
}

export default LoginPage;