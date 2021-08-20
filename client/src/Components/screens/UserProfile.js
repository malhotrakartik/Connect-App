import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom';                              //to access parameters in profile url(/profile/:userid)
import { UserContext } from '../../App'

function UserProfile() {
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const userid = useParams().userid                                           //to access params from the url
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);                    //state for hiding follow unfollow button

    useEffect(() => {

        fetch(`/user/${userid}`, {
            headers: {

                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json()).
            then((result) => {
                setProfile(result)
                
                
            }).catch(err => {
                console.log(err);
            })


    }, [])



    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),

            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })           //updating state
                localStorage.setItem("user", JSON.stringify(data));                                                         //updating local storage
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]             //data is having info of logged in user not the profile we are following
                        }
                    }
                })
                setShowFollow(false);
            })
            .catch(err => {
                console.log(err);
            })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),

            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })           //updating state
                localStorage.setItem("user", JSON.stringify(data));                                                         //updating local storage
                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter((item) => 
                         item !== data._id

                    )
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower           //data is having info of logged in user not the profile we are following
                        }
                    }
                })
               
                setShowFollow(true);
            })
            
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <>
            {userProfile ?

                <div style={{ maxWidth: '80vw', margin: "0px auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid gray" }}>
                        <div>
                            <img style={{ height: "160px", width: "160px", borderRadius: "80px" }}
                               src ={userProfile.user.pic}></img>
                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h4>{userProfile.user.email}</h4>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                                <h6>{userProfile.posts.length} posts</h6>
                            </div>
                            {
                                

                                  showFollow ? <button style={{ margin: "10px" }} className="btn waves-effect waves-light #1976d2 blue darken-2"
                                    onClick={() => followUser()}>Follow</button> :
                                    <button className="btn waves-effect waves-light #1976d2 blue darken-2" style={{ margin: "10px" }}
                                        onClick={() => unfollowUser()}>Unfollow</button>

                            }



                        </div>
                    </div>
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (

                                    <img src={item.photo} className="item" key={item._id} alt={item.title} />
                                )
                            })

                        }


                    </div>
                </div>


                :

                <h2>loading....</h2>}
        </>

    )
}

export default UserProfile
