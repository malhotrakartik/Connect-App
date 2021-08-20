import React,{useState,useEffect} from "react";
import { Link ,useHistory } from "react-router-dom";
import M, { Toast } from 'materialize-css'                 //for using toast
const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function Signup() {
    const history = useHistory();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);             

    
    useEffect(()=>{
        if(url){
            uploadFields();
        }

    },[url])
    const uploadProfilePic = () => {
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","connect-app");
        data.append("data_name","kartik2403")
        fetch("	https://api.cloudinary.com/v1_1/kartik2403/image/upload",{
            method:"post",
            body:data
        }).then(res => res.json())
        .then(data => {
            setUrl(data.url)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const uploadFields = () => {
        if(!emailValidation.test(email)){
            M.toast({html : "invalid email",classes:"#f44336 red"});
            return ;
        }
          fetch("/signup" , {
              method : "post",
              headers : {
                    "Content-type" : "application/json"
              },
              body : JSON.stringify({
                    name,
                    password,
                    email,
                    pic:url
              })
          }).then(res => res.json())                  //parsing data to json
          .then((data)=>{                           
              if(data.error){
                M.toast({html: 'please enter all the fields',classes:"#aa00ff purple accent-4"})      //classes to give it color
              }else{
                  M.toast({html : data.message , classes : "#43a047 green darken-1"});
                  history.push('/signin')
    
              }
          }).catch(err => {
              console.log(err);
          })
    }
   const PostData = () => {                       //making network request for post
    if(image){                                     //as adding image is not mandatory
        uploadProfilePic();
    }else{
        uploadFields();                         
    }
    
   }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Connect</h2>
                <input type="text" placeholder="name" value={name} onChange = {e=>setName(e.target.value)}></input>
                <input type="text" placeholder="email" value={email} onChange = {e=>setEmail(e.target.value)}></input>
                <input type="password" placeholder="password" value={password} onChange = {e=>setPassword(e.target.value)}></input>
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Profile Pic</span>
                        <input type="file" onChange = {(e) => setImage(e.target.files[0])} />
                     </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #1976d2 blue darken-2" style={{marginTop:"30px"}} 
                onClick={()=>PostData()}>Signup</button>
                <h5>
                    <Link to="/signin">Already have an account? Sign In!</Link>
                </h5>
            </div>
        </div>
    );
}

export default Signup;
