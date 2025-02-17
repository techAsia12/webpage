import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLogin = ({children,authentication=true}) => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth?.status);
  const [loader, setLoader] = useState(true);

  useEffect(()=>{
    if (authStatus === undefined) {
        return <div>Loading...</div>;
      }

    if(authentication && authStatus !== authentication){
        navigate('/');
    }else if(!authentication && authStatus !== authentication){
        navigate('/dashboard')
    }
    setLoader(false)
  },[authStatus,authentication,navigate])
  return loader?<h1>Loading......</h1>:<>{children}</>;
};

export default AuthLogin;