import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

function Profile() {
    const [mypics,setPics] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const [profileimage,updateImage] = useState("");  
    useEffect(()=>{
           fetch('/myposts',{
            headers : {
                 
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
          }
           }).then(res => res.json()).then(result=>{
               //result is an object 
               //it has a key myPost which is an array
               setPics(result.myPost);
           }).catch(err=>{
               console.log(err);
           })
           console.log(state);
    },[])
    

    const updatePhoto =  () => {
        const data = new FormData();
        console.log(profileimage);
        data.append("file",profileimage);
        data.append("upload_preset","connect-app");
        data.append("data_name","kartik2403")
        fetch("	https://api.cloudinary.com/v1_1/kartik2403/image/upload",{
            method:"post",
            body:data
        }).then(res => res.json())
        .then(data => {
            console.log(data)

            fetch('/updatepic',{
                method : "put",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")

                }
                ,body : JSON.stringify({
                    pic : data.url
                        
                })
            }).then(res => res.json())
            .then(result => {
                localStorage.setItem("user",JSON.stringify({...state,pic : result.pic}))    //updating local storage too  
                dispatch({type : "UPDATEPIC" , payload : result.pic})                 //updating state too
                
            })
            .catch(err => {
                console.log((err));
            })
        })
        .catch(err => {
            console.log(err);
        })


    }
    return (
        <div style={{maxWidth : '80vw' , margin : "0px auto"}}>
            <div style = {{margin:"18px 0px",borderBottom:"1px solid gray"}}>
            <div style={{display:"flex",justifyContent:"space-around"}}>
                <div>
                    
                    <img style={{ height: "160px", width: "160px", borderRadius: "80px" }}
                      src = {state ? state.pic : "loading"}></img>
                </div>
                <div>
                    <h4>{state ? state.name : "loading"}</h4>
                    <h4>{state ? state.email : "loading"}</h4>
                    <div style={{display:"flex" , justifyContent:"space-between" , width:"108%"}}>
                        <h6>{state ? state.followers.length : 0} followers</h6>
                        <h6>{state ? state.following.length : 0} following</h6>
                        <h6>{mypics.length} posts</h6>
                    </div>
                </div>
            </div>

            
            
            <div className="file-field input-field" style = {{marginLeft :"10vw" , display:"flex"}}>
                    <div className="btn">
                        <span>Select Profile Pic</span>
                        <input type="file" onChange = {(e) => updateImage(e.target.files[0])} />
                     </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                    </div>
                    <button className="btn waves-effect waves-light #1976d2 blue darken-2" style={{marginLeft:"13vw",marginBottom:"20px"}}
                 onClick = {() => {updatePhoto(profileimage)}}>Update Pic</button>
                </div>
                
                </div>
               
                <div>
         
            </div>
                
            
        <div className="gallery">
            {
                mypics.map(item=>{
                    return (
                      
                        <img src={item.photo} className="item" key={item._id} alt={item.title} />
                    )
                })
            }

        </div>
        </div>
    )
}

export default Profile
