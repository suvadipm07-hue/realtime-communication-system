import { useState, useEffect } from "react";

import axios from "axios";
import Header from "../components/header";
import "./ChatPage.css";
import { Link } from "react-router-dom";

const ChatPage = () => {

    const [name, setName] = useState("");
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

  const fetchData = async () => {

    try {
        setLoading(true);
        setError(false);

        // Get JWT token once
        const token = localStorage.getItem("access_token");

        console.log("TOKEN:", token);


        // Get chat relations
        const data = await axios.get(
            "http://localhost:8000/chat/list",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log(
            "Chat list coming from backend:",
            data.data
        );

        // Store chat list
        const newData = data.data || [];

        setChats(newData);


        // Get logged-in user's information
        const me = await axios.get(
            "http://localhost:8000/user/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Set logged-in user's name
        setName(me?.data?.name || "");

    } catch (error) {

        console.log("Catch called");

        console.log(
            "Error:",
            error.response?.data || error.message
        );

        setError(true);

    } finally {

        setLoading(false);

    }
};

    useEffect(() => {
        fetchData();
        console.log("use effect called");
    }, []);

    return (
    <div className="chat-fullpage">

        <Header userName={name} />

        <div className="chat-list">

            {loading && <p>Loading...</p>}

            {error && <p>Something went wrong</p>}

            {chats.map((chat) => (

                
              <Link
                className="link"
                to={`/inbox/${chat.chat_id}/${chat.user_id}`}
                key={chat.chat_id}
                >
                <div className="chat-item">

                <div className="chat-user">

                <h3>{chat.name}</h3>

                <p>{chat.user_id}</p>

                </div>

                </div>
                </Link>

            ))}

        </div>

    </div>
);
}

export default ChatPage;