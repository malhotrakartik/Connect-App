import React,{useState,useContext} from "react";
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


function Signin() {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

   const PostData = () => {                       //making network request for post
    if(!emailValidation.test(email)){
        M.toast({html : "invalid email",classes:"#f44336 red"});
        return ;
    }
      fetch("/signin" , {
          method : "post",
          headers : {
                "Content-type" : "application/json"
          },
          body : JSON.stringify({
                password,
                email
          })
      }).then(res => res.json())                  //parsing data to json
      .then((data)=>{    
          if(data.error){
              
            M.toast({html:'please enter all the fields',classes:"#aa00ff purple accent-4"})      //classes to give it color
          }else{
              localStorage.setItem("jwt",data.token);
              localStorage.setItem("user",JSON.stringify(data.user))
              dispatch({type:"USER",payload:data.user})
              M.toast({html : "sign in successfull" , classes : "#43a047 green darken-1"});
              history.push('/')

          }
      }).catch(err => {
          console.log(err);
      })
   }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Connect</h2>
                <input type="text" placeholder="email" value={email} onChange = {e=>setEmail(e.target.value)}></input>
                <input type="password" placeholder="password" value={password} onChange = {e=>setPassword(e.target.value)}></input>
                <button className="btn waves-effect waves-light #1976d2 blue darken-2" style={{marginTop:"30px"}} onClick={()=>PostData()}>Login</button>
                <h5>
                    <Link to="/signup">Don't have an account? Sign Up!</Link>
                </h5>
            </div>
        </div>
    );
}

export default Signin;
