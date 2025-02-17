import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminAuth = ({children,authentication=true}) => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth?.status);
  const [loader, setLoader] = useState(true);

  useEffect(()=>{
    if (authStatus === undefined) {
        return <div>Loading...</div>;
      }

      if(authentication && authStatus !== authentication){
        navigate('/admin/login');
    }else if(!authentication && authStatus !== authentication){
        navigate('/admin/home')
    }
    setLoader(false)
  },[authStatus,authentication,navigate])
  return loader?<h1>Loading......</h1>:<>{children}</>;
};

export default AdminAuth;
