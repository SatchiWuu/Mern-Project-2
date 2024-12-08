import axios from "axios";
import toast from 'react-hot-toast'

export const authenticate = (data, next) => {
  if (window !== "undefined") {
    sessionStorage.setItem("token", JSON.stringify(data.token));
    sessionStorage.setItem("user", JSON.stringify(data.user));
  }
  next();
};

export const getToken = () => {
  if (window !== "undefined") {
    if (sessionStorage.getItem("token")) {
      return JSON.parse(sessionStorage.getItem("token"));
    } else {
      return false;
    }
  }
};

export const getUser = () => {
  if (window !== "undefined") {
    if (sessionStorage.getItem("user")) {
      return JSON.parse(sessionStorage.getItem("user"));
    } else {
      return false;
    }
  }
};

export const logout = async() => {
  await axios.get('http://localhost:8000/auth/logout')
  if (window !== "undefined") {
    
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }
  toast.success('Logged Out.')
  setTimeout(() => {
    window.location.reload()
  }, [800])
};
