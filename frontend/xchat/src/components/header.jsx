import "./header.css";
const Header = ({ userName }) => {
    return (
        <header className="header">

            <div className="header-left">
                <div className="app-name">
                    <span className="logo-x">X</span>chat
                </div>
            </div>

            <div className="header-right">

                <button className="search-btn">
                    🔍 Search
                </button>

                <div className="profile-name">
                    👤 {userName}
                </div>

            </div>

        </header>
    );
};

export default Header;