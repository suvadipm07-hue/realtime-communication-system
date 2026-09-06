import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/header";
import "./chatpage.css";
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

            const token = localStorage.getItem("access_token");

            const data = await axios.get(
                "http://localhost:8000/chat/list",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setChats(data.data || []);

            const me = await axios.get(
                "http://localhost:8000/user/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setName(me?.data?.name || "");

        } catch (error) {
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
    }, []);


    // ==========================================
    // DELETE COMPLETE CHAT
    // ==========================================

    const handleDeleteChat = async (e, chatId) => {
        // Prevent opening the chat when Delete is clicked
        e.preventDefault();
        e.stopPropagation();

        const confirmed = window.confirm(
            "Are you sure you want to delete this chat and all its messages?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            await axios.delete(
                `http://localhost:8000/chat/${chatId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Remove deleted chat from the screen immediately
            setChats((previousChats) =>
                previousChats.filter(
                    (chat) => chat.chat_id !== chatId
                )
            );

        } catch (error) {
            console.log(
                "Delete chat error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.detail ||
                "Could not delete chat"
            );
        }
    };
   


    return (
        <div className="chat-fullpage">

            <Header userName={name} />

            <div className="chat-list">

                {loading && <p>Loading...</p>}

                {error && <p>Something went wrong</p>}

                {!loading && !error && chats.length === 0 && (
                    <p className="no-chats">
                        No chats available
                    </p>
                )}

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


                            {/* DELETE BUTTON */}
                            <button
                                className="delete-chat-btn"
                                onClick={(e) =>
                                    handleDeleteChat(e, chat.chat_id)
                                }
                                title="Delete chat"
                            >
                                🗑️
                            </button>

                        </div>

                    </Link>

                ))}

            </div>

        </div>
    );
};

export default ChatPage;