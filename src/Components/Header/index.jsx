import React, {  useEffect, useState } from "react";
import "./styles.css";
import { auth, doc, firestore } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userImg from '../../assets/user.svg';
import { getDoc } from "firebase/firestore";
import logo from '../../assets/letter-f.png'

function Header() {

  const [user, loading] = useAuthState(auth);
  
  const [userName, setUserName] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const userRef = doc(firestore, 'users', authUser.uid);
        getDoc(userRef)
          .then((doc) => {
            if (doc.exists()) {
              setUserName(doc.data());
            } else {
              console.error('No such document!');
            }
          })
          .catch((error) => {
            console.error('Error getting document:', error);
          });
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFn() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(e.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      {user ? (
        <div style={{display: "flex", justifyContent:"center", alignItems: "center", gap: "1rem"}}>
          <img src={logo} style={{ height:"2rem" }} />
          <p className="logo">
            Hi, Welcome back{' '}
            {userName ? <span>{userName.name}</span> : <span>User</span>}
          </p>
        </div>
      ) : (
        <p className="logo">Financly.</p>
      )}
      
      {user && (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem"}}>
          <img src={user.photoURL ? user.photoURL : userImg} style={{borderRadius: "50%", height: "1.6rem", width: "1.7rem"}} /> 
          <p className="logo link" onClick={logoutFn}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
