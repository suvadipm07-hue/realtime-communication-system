import "./header.css";
import { useState } from "react";
import axios from "axios";

const Header = ({ userName }) => {

    const [searchId, setSearchId] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [searchMessage, setSearchMessage] = useState("");
    const [addChatMessage, setAddChatMessage] = useState("");


    // =========================
    // SEARCH USER
    // =========================

    const handleSearch = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.get(
                `http://127.0.0.1:8000/users/search/${searchId}`
            );

            console.log("User found:", response.data);

            // Show searched user
            setSearchResult(response.data);

            // Clear old messages
            setSearchMessage("");
            setAddChatMessage("");

        } catch (error) {

            const message =
                error.response?.data?.detail ||
                "Something went wrong";

            console.log("Search error:", message);

            // Clear old search result
            setSearchResult(null);

            // Show search error
            setSearchMessage(message);

            // Clear old add-chat message
            setAddChatMessage("");
        }
    };


    // =========================
    // ADD CHAT
    // =========================

    const handleAddChat = async () => {

        try {

            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                "http://127.0.0.1:8000/chat/create",

                {
                    other_user_id: searchResult.user_id
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Chat created:", response.data);

            // Show success message
            setAddChatMessage("Chat added successfully");

            // Clear search card
            setSearchResult(null);

            // Clear search input
            setSearchId("");

        } catch (error) {

            const message =
                error.response?.data?.detail ||
                "Something went wrong";

            console.log("Add chat error:", message);

            // Show add-chat error
            setAddChatMessage(message);
        }
    };


    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleInputChange = (e) => {

        setSearchId(e.target.value);

        // Hide previous result
        setSearchResult(null);

        // Clear old messages
        setSearchMessage("");
        setAddChatMessage("");
    };


    return (

        <header className="header">


            {/* LEFT SIDE */}

            <div className="header-left">

                <div className="app-name">

                    <span className="logo-x">
                        X
                    </span>

                    chat

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="header-right">


                <div className="search-container">


                    {/* SEARCH FORM */}

                    <form onSubmit={handleSearch}>

                        <input
                            type="text"
                            placeholder="Search user by ID..."
                            value={searchId}
                            onChange={handleInputChange}
                            required
                        />

                        <button type="submit">
                            🔍
                        </button>

                    </form>


                    {/* SEARCH RESULT */}

                    {searchResult && (

                        <div className="search-result">

                            <div className="user-info">

                                <strong>
                                    {searchResult.name}
                                </strong>

                                <span>
                                    {searchResult.user_id}
                                </span>

                            </div>


                            <button
                                type="button"
                                onClick={handleAddChat}
                            >
                                Add to Chat
                            </button>

                        </div>

                    )}


                    {/* SEARCH MESSAGE */}

                    {searchMessage && (

                        <div className="search-message">
                            {searchMessage}
                        </div>

                    )}


                    {/* ADD CHAT MESSAGE */}

                    {addChatMessage && (

                        <div className="search-message">
                            {addChatMessage}
                        </div>

                    )}

                </div>


                {/* PROFILE */}

                <div className="profile-name">

                    👤 {userName}

                </div>


            </div>


        </header>
    );
};


export default Header;