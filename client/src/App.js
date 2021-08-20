import logo from './logo.svg';
import './App.css';
import React , {useEffect,createContext,useReducer,useContext, useState} from 'react';        //useReducer is like useState
import Navbar from './Components/Navbar';
import {BrowserRouter,Route,Switch, useHistory} from 'react-router-dom'
import   Home from './Components/screens/Home';
import  Signin from './Components/screens/Signin';
import   Profile from './Components/screens/Profile';
import   Signup from './Components/screens/Signup';
import CreatePost from './Components/screens/CreatePost';
import UserProfile from './Components/screens/UserProfile'
import SubUserPosts from './Components/screens/SubUserPosts';
import { initialState, reducer } from './Reducers/userReducer'



export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));           //converting it to object
    if(user){   
      dispatch({type:"USER",payload:user})                                                       //checking if user is logged in or not
        //  history.push('/')
    }else{
        history.push('/signin');
    }

  },[])
  return(
    <Switch>
    <Route path = '/' exact component = {Home}/>
    <Route path = '/signin' component = {Signin}/>
    <Route path = '/signup' component = {Signup}/>
    <Route path = '/profile' exact component = {Profile}/>
    <Route path = '/create' component = {CreatePost}/>
    <Route path = '/profile/:userid' component = {UserProfile}/>
    <Route path = '/myfollowingpost' component = {SubUserPosts}/>

    </Switch>
  )
}

function App() {
 const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar/>
    <Routing></Routing>

      
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
