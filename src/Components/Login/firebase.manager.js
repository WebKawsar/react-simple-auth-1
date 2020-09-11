import React, { useState } from 'react';
import './App.css';

import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';




firebase.initializeApp(firebaseConfig)

function App() {

  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: "",
    email: "",
    photo: "",
    error: "",
    success: false
  });

  
  const handleGoogleSignIn = () => {

    const googleProvider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(googleProvider)
    .then(response => {

      const {displayName, email, photoURL} = response.user;
      const signInUser = {

        isSignIn: true,
        name: displayName,
        email: email,
        photo: photoURL

      }
      setUser(signInUser);
  
    })
    .catch(error => {
  
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
  
    })

  }

  const handleGoogleSignOut = () => {
    
    firebase.auth().signOut()
    .then(response => {

      const signedOutUser = {

        isSignIn: false,
        name: "",
        email: "",
        photo: ""

      }
      setUser(signedOutUser);

    })
    .catch(error => {

      console.log(error.message);
    })

  }

  const handleSubmit = (e) => {

    if(newUser && user.email && user.password){

      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {

        const newUserInfo = {...user};
        newUserInfo.error = "";
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserInfo(user.name);
        console.log(response.user);

      })      
      .catch(error => {

        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);

      });
    }

    if(!newUser && user.email && user.password){

      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(response => {

        const newUserInfo = {...user};
        newUserInfo.error = "";
        newUserInfo.success = true;
        setUser(newUserInfo);
  
      })
      .catch(error => {

        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);

      });

    }

    e.preventDefault();
  }

  const handleBlur = (e) => {

    let isFieldValid = true;
    if(e.target.name === "email"){

      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }

    if(e.target.name === "password"){

      const isFormValidByLength = e.target.value.length > 6;
      const isFormValidByReg = /\d{1}/.test(e.target.value);
      isFieldValid= isFormValidByLength && isFormValidByReg;

    }
    if(isFieldValid){

      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);

    }

  }

  const updateUserInfo = name => {

    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name
    })
    .then(response => {

      console.log("Updated user info successfully");
    })
    .catch(error => {

      console.log(error.message);
    });

  }

const handleFacebookSignIn = () => {

  const fbProvider = new firebase.auth.FacebookAuthProvider();

  firebase.auth().signInWithPopup(fbProvider)
  .then(function(result) {

    const user = result.user;
    console.log(user);
  })
  .catch(function(error) {
   
    console.log(error);
  });



}


  return (
    <div className="App">
      {
        user.isSignIn ? <button onClick={handleGoogleSignOut}>Sign Out</button> : <button onClick={handleGoogleSignIn}>Sign In using Google</button>
      }
      <button onClick={handleFacebookSignIn}>Sign in using Facebook</button>
      { 
        user.isSignIn && <div className="signIn">
          <h2>Name : {user.name}</h2>
          <h4>Email : {user.email}</h4>
          <img src={user.photo} alt=""/>
        </div> 
      }

      <br/>
      <br/>
      <br/>
      <p>Name : {user.name}</p>
      <p>Email : {user.email}</p>
      <p>Password : {user.password}</p>

      <h1>Our Own Authentication</h1>
      {
        user.error && <p style={{color: "red"}}>{user.error}</p>
      }

      {
        user.success && <p style={{color: "green"}}>User {newUser ? "created" : "logged in"} successfully</p>
      }
      
      <br/>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="checkbox" id="checkbox"/>
      <label htmlFor="checkbox">New user sign in</label>
      <br/>
      <br/>
      <form onSubmit={handleSubmit}>

        {
          newUser && <input onBlur={handleBlur} type="text" name="name" id="" placeholder="Your name" required/>
        }
        <br/>
        <input onBlur={handleBlur} type="email" name="email" id="" placeholder="Your email" required/>
        <br/>
        <input onBlur={handleBlur} type="password" name="password" id="" placeholder="Your password" required/>
        <br/>
        <input type="submit" value={newUser ? "Sign up" : "sign in"}/>

      </form>

    </div>
  );
}

export default App;
