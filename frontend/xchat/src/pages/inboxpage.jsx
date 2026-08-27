import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./InboxPage.css";


const InboxPage = () => {

    // Get both IDs from URL
    // Example:
    // /inbox/6a8fd7eb19449fd346a57808/rahul123

    const { chatId, userId } = useParams();
    const navigate = useNavigate();


    // ==========================================
    // STATES
    // ==========================================

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [contactName, setContactName] = useState("");
    const [contactUserId, setContactUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // GET CURRENT USER ID FROM JWT
    // ==========================================
    const getCurrentUserId = () => {
        const token = localStorage.getItem("access_token");
        if (!token) return null;

        try {
            const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(atob(base64));
        return payload.user_id;
        } catch (error) {
            console.log("Token error:", error);
            return null;
        }
    };


    const currentUserId = getCurrentUserId();


    // ==========================================
    // GET CONTACT + MESSAGES
    // ==========================================

    const fetchMessages = async () => {

        try {

            setLoading(true);

            setError("");

            const token =
                localStorage.getItem("access_token");


            // ======================================
            // GET CONTACT INFORMATION
            // ======================================

            const userResponse = await axios.get(
                `http://127.0.0.1:8000/users/search/${userId}`
            );

            console.log(
                "Contact:",
                userResponse.data
            );


            setContactName(
                userResponse.data.name || ""
            );


            setContactUserId(
                userResponse.data.user_id || userId
            );


            // ======================================
            // GET CHAT MESSAGES
            // ======================================

            const messageResponse = await axios.get(
                `http://127.0.0.1:8000/messages/${chatId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            console.log(
                "Messages:",
                messageResponse.data
            );


            setMessages(
                messageResponse.data || []
            );


        } catch (error) {

            console.log(
                "Get inbox error:",
                error.response?.data ||
                error.message
            );


            setError(
                error.response?.data?.detail ||
                "Could not load chat"
            );


        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD DATA WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {

    fetchMessages();

    const interval = setInterval(() => {
        fetchMessages();
    }, 2000);

    return () => {
        clearInterval(interval);
    };

}, [chatId]); 


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const handleSendMessage = async (e) => {

        e.preventDefault();


        // Don't send empty message

        if (!message.trim()) {
            return;
        }


        try {

            const token =
                localStorage.getItem("access_token");


            const response = await axios.post(

                `http://127.0.0.1:8000/messages/${chatId}`,

                {
                    message: message.trim()
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Message sent:",
                response.data
            );


            // ======================================
            // ADD NEW MESSAGE TO SCREEN
            // ======================================

            const newMessage = {

                message_id:
                    response.data.message_id,

                sender_id:
                    response.data.sender_id,

                receiver_id:
                    response.data.receiver_id,

                message:
                    response.data.text,

                created_at:
                    new Date().toISOString()

            };


            setMessages(
                (previousMessages) => [

                    ...previousMessages,

                    newMessage

                ]
            );


            // Clear input

            setMessage("");


        } catch (error) {

            console.log(
                "Send message error:",
                error.response?.data ||
                error.message
            );

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="inbox-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="inbox-header">


                {/* LEFT - BACK BUTTON */}

                <button
                    className="back-button"
                    onClick={() => navigate("/chat")}
                >
                    ← Back
                </button>


                {/* RIGHT - CONTACT NAME */}

                <div className="contact-info">

                    <h2>
                        {
                            contactName ||
                            contactUserId ||
                            userId
                        }
                    </h2>

                </div>

            </div>



            {/* ==================================
                MESSAGE AREA
            ================================== */}

            <div className="message-area">


                {/* LOADING */}

                {loading && (

                    <div className="empty-chat">
                        Loading messages...
                    </div>

                )}



                {/* ERROR */}

                {!loading && error && (

                    <div className="empty-chat">
                        {error}
                    </div>

                )}



                {/* NO MESSAGES */}

                {!loading &&
                    !error &&
                    messages.length === 0 && (

                        <div className="empty-chat">
                            No messages yet
                        </div>

                    )}



                {/* ==================================
                    MESSAGES
                ================================== */}

                {!loading &&
                    !error &&
                    messages.map((msg) => {

                        const isMyMessage =
                            msg.sender_id ===
                            currentUserId;


                        return (

                            <div
                                key={msg.message_id}
                                className={`message-container ${
                                    isMyMessage
                                        ? "my-message-container"
                                        : "their-message-container"
                                }`}
                            >


                                {/* ==========================
                                    NAME ABOVE MESSAGE
                                ========================== */}

                                <div
                                    className={`message-sender-name ${
                                        isMyMessage
                                            ? "my-sender-name"
                                            : "their-sender-name"
                                    }`}
                                >

                                    {isMyMessage
                                        ? "You"
                                        : contactName ||
                                          msg.sender_id}

                                </div>



                                {/* ==========================
                                    MESSAGE
                                ========================== */}

                                <div
                                    className={`message ${
                                        isMyMessage
                                            ? "my-message"
                                            : "their-message"
                                    }`}
                                >

                                    {msg.message}

                                </div>


                            </div>

                        );

                    })}

            </div>



            {/* ==================================
                MESSAGE INPUT
            ================================== */}

            <form
                className="message-input-area"
                onSubmit={handleSendMessage}
            >


                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                />


                <button type="submit">
                    Send
                </button>


            </form>


        </div>

    );
};


export default InboxPage;