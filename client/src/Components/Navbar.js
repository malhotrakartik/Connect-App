import React, { useContext } from "react";
import App from "../App.css";
import { Link, useHistory } from "react-router-dom"; //in place of anchor tag to avoid loading of page
import { UserContext } from "../App";
const Navbar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext); //state is having the user details
    const renderList = () => {
        if (state) {
            //if user is present show profile and create post to user
            return [
                <li>
                    <Link to="/profile">Profile</Link>
                </li>,
                <li>
                    <Link to="/create">Create Post</Link>
                </li>,
                <li>
                    <Link to="/myfollowingpost">Friends Posts</Link>
                </li>,
                <li>
                    <button
                        className="btn waves-effect waves-light #e53935 red darken-1"
                        onClick={() => {
                            localStorage.clear(); //clearing localstorage and sending user to sign in page on logout
                            dispatch({ type: "CLEAR" });
                            history.push("/signin");
                        }}
                    >
                        Logout
                    </button>
                </li>,
            ];
        } else {
            return [
                <li>
                    <Link to="/signin">Signin</Link>
                </li>,
                <li>
                    <Link to="/signup">Signup</Link>
                </li>,
            ];
        }
    };
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">
                    Connect
                </Link>
                <ul id="nav-mobile" className="right" style={{ marginRight: "30px" }}>
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
