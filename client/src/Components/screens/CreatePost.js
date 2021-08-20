import React,{useState,useEffect} from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom';

const CreatePost = () => {
    const history = useHistory();
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");

    const postDetails = () => {                     //uploading data to cloudinary
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","connect-app");
        data.append("data_name","kartik2403")
        fetch("	https://api.cloudinary.com/v1_1/kartik2403/image/upload",{
            method:"post",
            body:data
        }).then(res => res.json())
        .then(data => {
            console.log(data.url);
            setUrl(data.url)
        })
        .catch(err => {
            console.log(err);
        })

 }
     
 useEffect(() => {                                    //it will only run after image has been loaded to cloudinary
    if(url){
        fetch("/createpost" , {                          //fetch is used to send API requests
            method : "post",
            headers : {
                  "Content-type" : "application/json",
                  "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                  title,
                  body,
                  photo : url,
                  
            })
        }).then(res => res.json())                  //parsing data to json
        .then((data)=>{    
            console.log(data);                      
            if(data.error){
              console.log("post error")
              M.toast({html: 'please enter all the fields',classes:"#aa00ff purple accent-4"})      //classes to give it color
            }else{
                M.toast({html : "Post successfully posted" , classes : "#43a047 green darken-1"});
                history.push('/')
    
            }
        }).catch(err => {
            console.log(err);
        })
    }

 


},[url])


    return (
    
            <div className="card input-filed"
            style={{
                margin : "30px auto",
                maxWidth : "500px",
                padding : "20px",
                textAlign : "center"

            }}>
                <input type="text" placeholder="title" value = {title} onChange = {(e)=>setTitle(e.target.value)}></input>
                <input type="text" placeholder="body" value = {body} onChange = {(e)=>setBody(e.target.value)}></input>
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Image</span>
                        <input type="file" onChange = {(e) => setImage(e.target.files[0])} />
                     </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #1976d2 blue darken-2" style={{marginTop:"20px"}} onClick={(e) => postDetails()}>Submit Post</button>

            </div>
               
                )
}

export default CreatePost
