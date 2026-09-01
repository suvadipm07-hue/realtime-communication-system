import {
useState,
useEffect,
useRef
} from "react";

import {
useParams,
useNavigate
} from "react-router-dom";

import axios from "axios";

import "./InboxPage.css";

const InboxPage = () => {

// ==========================================
// GET IDs FROM URL
// ==========================================

const {
    chatId,
    userId
} = useParams();


const navigate =
    useNavigate();


// ==========================================
// STATES
// ==========================================

const [message, setMessage] =
    useState("");


const [messages, setMessages] =
    useState([]);


const [contactName, setContactName] =
    useState("");


const [contactUserId, setContactUserId] =
    useState("");


const [loading, setLoading] =
    useState(true);


const [error, setError] =
    useState("");


// WebSocket reference

const socketRef =
    useRef(null);



// ==========================================
// GET CURRENT USER ID FROM JWT
// ==========================================

const getCurrentUserId = () => {


    const token =
        localStorage.getItem(
            "access_token"
        );


    if (!token) {

        return null;

    }


    try {


        const base64 =
            token
                .split(".")[1]
                .replace(
                    /-/g,
                    "+"
                )
                .replace(
                    /_/g,
                    "/"
                );


        const payload =
            JSON.parse(
                atob(base64)
            );


        return payload.user_id;


    } catch (error) {


        console.log(
            "Token error:",
            error
        );


        return null;

    }

};



const currentUserId =
    getCurrentUserId();



// ==========================================
// GET CONTACT + OLD MESSAGES
// ==========================================

const fetchMessages =
    async () => {


        try {


            setLoading(true);

            setError("");


            const token =
                localStorage.getItem(
                    "access_token"
                );



            // ======================================
            // GET CONTACT INFORMATION
            // ======================================

            const userResponse =
                await axios.get(

                    `http://127.0.0.1:8000/users/search/${userId}`

                );


            console.log(
                "Contact:",
                userResponse.data
            );


            setContactName(

                userResponse.data.name ||
                ""

            );


            setContactUserId(

                userResponse.data.user_id ||
                userId

            );



            // ======================================
            // GET OLD CHAT MESSAGES
            // ======================================

            const messageResponse =
                await axios.get(

                    `http://127.0.0.1:8000/messages/${chatId}`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            console.log(
                "Messages:",
                messageResponse.data
            );


            setMessages(

                messageResponse.data ||
                []

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
// LOAD OLD MESSAGES WHEN PAGE OPENS
// ==========================================

useEffect(() => {


    fetchMessages();


}, [

    chatId,
    userId

]);



// ==========================================
// WEBSOCKET CONNECTION
// ==========================================

useEffect(() => {


    if (!chatId) {

        return;

    }



    // Create WebSocket connection

    const socket =
        new WebSocket(

            `ws://127.0.0.1:8000/ws/messages/${chatId}`

        );


    // Store socket reference

    socketRef.current =
        socket;



    // ======================================
    // CONNECTION OPENED
    // ======================================

    socket.onopen = () => {


        console.log(
            "WebSocket connected"
        );

    };



    // ======================================
    // RECEIVE MESSAGE INSTANTLY
    // ======================================

    socket.onmessage =
        (event) => {


            const newMessage =
                JSON.parse(
                    event.data
                );


            console.log(

                "New message received:",

                newMessage

            );


            setMessages(

                (
                    previousMessages
                ) => {


                    // ==================================
                    // PREVENT DUPLICATE MESSAGE
                    // ==================================

                    const messageExists =
                        previousMessages.some(

                            (msg) =>

                                msg.message_id ===
                                newMessage.message_id

                        );


                    if (messageExists) {

                        return previousMessages;

                    }



                    // ==================================
                    // ADD NEW MESSAGE
                    // ==================================

                    return [

                        ...previousMessages,

                        newMessage

                    ];

                }

            );

        };



    // ======================================
    // CONNECTION CLOSED
    // ======================================

    socket.onclose =
        () => {


            console.log(
                "WebSocket disconnected"
            );

        };



    // ======================================
    // CONNECTION ERROR
    // ======================================

    socket.onerror =
        (error) => {


            console.log(

                "WebSocket error:",

                error

            );

        };



    // ======================================
    // CLEANUP WHEN USER LEAVES CHAT
    // ======================================

    return () => {


        socket.close();


        socketRef.current =
            null;

    };


}, [

    chatId

]);



// ==========================================
// SEND MESSAGE
// ==========================================

const handleSendMessage =
    async (e) => {


        e.preventDefault();



        // Don't send empty messages

        if (!message.trim()) {

            return;

        }



        try {


            const token =
                localStorage.getItem(
                    "access_token"
                );



            // ======================================
            // SEND MESSAGE TO BACKEND
            // ======================================

            await axios.post(

                `http://127.0.0.1:8000/messages/${chatId}`,

                {

                    message:
                        message.trim()

                },

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );



            // ======================================
            // CLEAR INPUT
            // ======================================

            // Message will automatically appear
            // through WebSocket broadcast

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


            {/* BACK BUTTON */}

            <button

                className="back-button"

                onClick={() =>
                    navigate("/chat")
                }

            >

                ← Back

            </button>



            {/* CONTACT NAME */}

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

            {

                loading && (

                    <div className="empty-chat">

                        Loading messages...

                    </div>

                )

            }



            {/* ERROR */}

            {

                !loading &&

                error && (

                    <div className="empty-chat">

                        {error}

                    </div>

                )

            }



            {/* NO MESSAGES */}

            {

                !loading &&

                !error &&

                messages.length === 0 && (

                    <div className="empty-chat">

                        No messages yet

                    </div>

                )

            }



            {/* ==================================
                MESSAGE LIST
            ================================== */}

            {

                !loading &&

                !error &&

                messages.map(

                    (msg) => {


                        const isMyMessage =

                            msg.sender_id ===
                            currentUserId;



                        return (

                            <div

                                key={
                                    msg.message_id
                                }

                                className={

                                    `message-container ${

                                        isMyMessage

                                            ? "my-message-container"

                                            : "their-message-container"

                                    }`

                                }

                            >


                                {/* SENDER NAME */}

                                <div

                                    className={

                                        `message-sender-name ${

                                            isMyMessage

                                                ? "my-sender-name"

                                                : "their-sender-name"

                                        }`

                                    }

                                >

                                    {

                                        isMyMessage

                                            ? "You"

                                            : contactName ||
                                              msg.sender_id

                                    }

                                </div>



                                {/* MESSAGE */}

                                <div

                                    className={

                                        `message ${

                                            isMyMessage

                                                ? "my-message"

                                                : "their-message"

                                        }`

                                    }

                                >

                                    {msg.message}

                                </div>


                            </div>

                        );

                    }

                )

            }


        </div>



        {/* ==================================
            MESSAGE INPUT
        ================================== */}

        <form

            className="message-input-area"

            onSubmit={
                handleSendMessage
            }

        >


            <input

                type="text"

                placeholder="Type a message..."

                value={message}

                onChange={
                    (e) =>

                        setMessage(
                            e.target.value
                        )
                }

            />


            <button
                type="submit"
            >

                Send

            </button>


        </form>


    </div>

);

};

export default InboxPage;