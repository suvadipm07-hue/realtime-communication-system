import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/header";
import "./ChatPage.css";

const ChatPage = () => {

    const [name, setName] = useState("");
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
        setLoading(true);

        const data = await axios.get("http://localhost:8000/user");
        console.log("data coming from backend", data?.data);

        const newData = data?.data || [];
        console.log(newData);

        setChats(newData);

        const token = localStorage.getItem("access_token");
        
        console.log("TOKEN:", token);

        const me = await axios.get("http://localhost:8000/user/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setName(me?.data?.name || "");

    } catch (error) {
        console.log("catch called");
        setError(true);
        console.log("Error", error);
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
                    <div className="chat-item" key={chat.user_id}>

                        <div className="chat-user">
                            <h3>{chat.name}</h3>
                            <p>{chat.user_id}</p>
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default ChatPage;