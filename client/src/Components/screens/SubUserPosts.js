import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import {Link} from 'react-router-dom'

const SubUserPosts = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    useEffect(() => {
        fetch("/getsubpost", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setData(result.posts);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const likePost = (id) => {
        console.log(id);
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const updatedData = data.map((item) => {
                    //updating data state after a post gets updated
                    if (item._id == id) {
                        return result;
                    } else {
                        return item;
                    }
                });

                setData(updatedData);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const updatedData = data.map((item) => {
                    //updating data state after a post gets updated
                    if (item._id == id) {
                        return result;
                    } else {
                        return item;
                    }
                });

                setData(updatedData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const makeComment = (text, postId) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId,
                text,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const updatedData = data.map((item) => {
                    //updating data state after a post gets updated
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });

                setData(updatedData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                const updatedData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(updatedData)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="home">
            {data.map((item) => {
                return (
                    <div className="card home-card" key={item._id}>
                        <h5>
                        <img style={{height : "35px",width : "35px" ,border : "1px solid white",borderRadius : "20px",marginRight : "10px"}} src = {item.postedBy.pic} alt = "no image"></img>

                            <Link to = {item.postedBy._id !== state._id  ? `/profile/${item.postedBy._id}` : `/profile`}>
                            {item.postedBy.name}
                            </Link>
                            {item.postedBy._id == state._id && (                     //to show delete icon only to user's posts
                                <i
                                    className="material-icons"
                                    style={{ marginLeft : "auto" }}
                                    onClick={() => {
                                        deletePost(item._id);
                                    }}
                                >
                                    delete
                                </i>
                            )}
                        </h5>

                        <div className="card-image">
                            <img src={item.photo} />
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{ color: "red" }}>
                                favorite
                            </i>
                            {item.likes.includes(state._id) ? (
                                <i
                                    className="material-icons"
                                    onClick={() => {
                                        unlikePost(item._id);
                                    }}
                                >
                                    thumb_down
                                </i>
                            ) : (
                                <i
                                    className="material-icons"
                                    onClick={() => {
                                        likePost(item._id);
                                    }}
                                >
                                    thumb_up
                                </i>
                            )}
                            <h6>{item.likes.length}</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {item.comments.map((record) => {
                                return (
                                    <h6 key={record._id}>
                                        <span style={{ fontWeight: "500" }}>
                                            {record.postedBy.name}{" "}
                                        </span>
                                        {record.text}
                                    </h6>
                                );
                            })}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id); //accessng first element of form i.e the input tag
                                }}
                            >
                                <input type="text" placeholder="add a comment"></input>
                            </form>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default SubUserPosts;
