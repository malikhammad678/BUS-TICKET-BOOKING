import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import toast from "react-hot-toast";

const AppContext = createContext()

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const AppContextProvider = ({ children }) => {

    const [loginUser,setLoginUser] = useState(null)
    const [isOwnerLogin, setIsOwnerLogin] = useState(
    localStorage.getItem('adminEmail') 
    ? { email: localStorage.getItem('adminEmail') } 
    : null
)
    const [adminToken,setAdminToken] = useState(localStorage.getItem('adminToken') || null)
    const [isAdminLoading, setIsAdminLoading] = useState(false)
    const [totalNoBuses, setTotalNoBuses] = useState(0)
    const [totalNoUsers, setTotalNoUsers] = useState(0)
    const [totalNoBookings, setTotalNoBookings] = useState(0)
    const [bookings,setBookings] = useState([])
    const [buses,setBuses] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [loading, setLaoding]= useState(false)
    const [messages, setMessages] = useState([])
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null)
    const [webBuses, setWebBuses] = useState([])
    const navigate = useNavigate()

    const AdminLogin = async (email, password) => {
        setIsAdminLoading(true)
        try {
            const { data } = await axios.post(`${BACKEND_URL}/owner/login`, { email, password })
            if(data.success){
                setIsOwnerLogin({ email: data.admin })
                localStorage.setItem('adminToken', data.token)
                localStorage.setItem('adminEmail', data.admin) 
                setAdminToken(data.token)
                toast.success(data.message)
                navigate("/owner/dashboard")
            } else {
                toast.error(data.message || 'Error occured')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error occurred')
        } finally {
            setIsAdminLoading(false)
        }
    } 

    const getTotalNumberBuses = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/owner/getBuses`, { headers: { token: adminToken } })
            if(data.success){
                 setTotalNoBuses(data.totalBuses)
            } else {
                console.log(data.message || 'Error occured')
            }
        } catch (error) {
            console.log(error.response?.data?.message || 'Error occurred')
        }
    }

    const getTotalNumberUsers = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/owner/getUsers`, { headers: { token: adminToken } })
            if(data.success){
                 setTotalNoUsers(data.totalUsers)
            } else {
                console.log(data.message || 'Error occured')
            }
        } catch (error) {
            console.log(error.response?.data?.message || 'Error occurred')
        }
    }

    const getTotalNumberBookings = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/owner/getBookings`, { headers: { token: adminToken } })
            if(data.success){
                 setTotalNoBookings(data.totalBookings)
                 console.log(adminToken)
            } else {
                console.log(data.message || 'Error occured')
            }
        } catch (error) {
            console.log(error.response?.data?.message || 'Error occurred')
        }
    }

    const getAllBookings = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/owner/get-admin-bookings`,{ headers: {token:adminToken} })
            if(data.success){
                setBookings(data.bookings)
                console.log(data.bookings)
            } else {
                console.log(data.message || 'Error occured')
            }
        } catch (error) {
            console.log(error.response?.data?.message || 'Error occurred')
        }
    }

    const getBuses = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/owner/get-admin-buses`, { headers:{token:adminToken} })
            if(data.success){
                 setBuses(data.buses)
                 console.log(data.buses)
            } else{
                console.log(data.message || 'Error occured')
            }
        } catch (error) {
            console.log(error.response?.data?.message || 'Error occurred')
        }
    }
    const getUsers = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/owner/get-admin-users`, { headers:{token:adminToken} })
            if(data.success){
                 setAllUsers(data.users)
                 console.log(data.users)

            } else{
                console.log(data.message || 'Error occured')
            }
        } catch (error) {
            console.log(error.response?.data?.message || 'Error occurred')
        }
    }

    const addNewBus = async (form) => {
        setLaoding(true)
  try {
    const formData = new FormData();

    formData.append("busName", form.busName);
    formData.append("fromCity", form.fromCity);
    formData.append("toCity", form.toCity);
    formData.append("price", form.price);
    formData.append("departureTime", form.departureTime);
    formData.append("date", form.date);
    formData.append("duration", form.duration);
    formData.append("busType", form.busType);
    formData.append("bestSeller", form.bestSeller);

    if (form.image) {
      formData.append("image", form.image);
    }

    const { data } = await axios.post(
      `${BACKEND_URL}/bus/add`,
      formData,
      {
        headers: {
          token: adminToken,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getBuses()
      getTotalNumberBuses()
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error occurred");
  } finally{
    setLaoding(false)
  }
};

const deleteBus = async (id) => {
    try {
        const { data } = await axios.delete(`${BACKEND_URL}/bus/delete/${id}`, { headers : {token:adminToken} })
        if(data.success){
            toast.success(data.message)
            getBuses()
            getTotalNumberBuses()
        }else {
            toast.error(data.message)
        }
    } catch (error) {
       toast.error(error.response?.data?.message || "Error occurred");
    }
}

const deleteBooking = async (id) => {
    try {
        const { data } = await axios.delete(`${BACKEND_URL}/booking/delete/${id}`, { headers:{token:adminToken} })
        if(data.success){
            toast.success(data.message)
            getAllBookings()
            getTotalNumberBookings()
        } else {
            console.log(data.message)
        }
    } catch (error) {
       console.log(error.response?.data?.message || "Error occurred");
    }
}

const updateStatus = async (id, bookingStatus) => {
   try {
    const { data } = await axios.put(`${BACKEND_URL}/booking/update/${id}`, { bookingStatus }  ,{ headers:{token:adminToken} })
    if(data.success){
            toast.success(data.message)
            getAllBookings()
        } else {
            console.log(data.message)
        }
   } catch (error) {
    console.log(error.response?.data?.message || "Error occurred");
   }
}

const updateUserStatus = async (id) => {
    try {
        const { data } = await axios.put(`${BACKEND_URL}/users/toggle-block/${id}`, {} ,{ headers:{token:adminToken} })
        if(data.success){
            toast.success(data.message)
            getUsers()
            getTotalNumberUsers()
            
        }else {
            toast.error(data.message)

        }
    } catch (error) {
    toast.error(error.response?.data?.message || "Error occurred");
        
    }
}

const userLogin = async (name, email, password,state) => {
    setLaoding(true)
    try {
        const { data } = await axios.post(`${BACKEND_URL}/users/${state}`,{ name, email, password })
        if(data.success){
            toast.success(data.message)
            setLoginUser(data.user)
            localStorage.setItem('userToken', data.token)
            setUserToken(data.token)
            navigate("/")
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || 'Error Occured')
    } finally{
        setLaoding(false)
    }
}

const deleteUser = async (id) => {
    try {
        const { data } = await axios.delete(`${BACKEND_URL}/users/delete/${id}`,{ headers:{token:adminToken} })
        if(data.success){
            toast.success(data.message)
            getUsers()
            getTotalNumberUsers()
            
        }else {
            toast.error(data.message)

        }
    } catch (error) {
    toast.error(error.response?.data?.message || "Error occurred");
        
    }
}

const getMessages = async () => {
    try {
        const { data } = await axios.get(`${BACKEND_URL}/contact/get`, {headers: {token:adminToken}});
        if(data.success){
            setMessages(data.messages)
            console.log(data,messages)
        }else {
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Error Occured')
    }
}

const deleteMessages = async (id) => {
    try {
        const { data } = await axios.delete(`${BACKEND_URL}/contact/delete/${id}`, {headers: {token:adminToken}});
        if(data.success){
            toast.success(data.message)
            getMessages()
        }else {
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Error Occured')
    }
}

const sendMessage = async (firstName, lastName, email ,phone, message) => {
    setLaoding(true)
    try{
        const { data } = await axios.post(`${BACKEND_URL}/contact/sendMessage`, {
            firstName, lastName, email, phone, message
        })
        if(data.success){
            toast.success(data.message)
        }else {
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Error Occured')
    } finally{
        setLaoding(false)
    }
}

const getAllBuses = async () => {
    try {
        const { data } = await axios.get(`${BACKEND_URL}/bus/all`, { headers:{token:userToken} })
    if(data.success){
         setWebBuses(data.buses)
    } else {
        console.log(data.message)
    }
    } catch (error) {
        console.log(error.message)
    }
}

useEffect(() => {
  if (!userToken) {
    if (!window.location.pathname.startsWith('/owner')) {
      navigate('/login')
    }
    return
  }

  const checkBlockStatus = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/users/me`, {
        headers: { token: userToken }
      })

      if (!data.success) {
        toast.error("Your account has been blocked.")
        localStorage.removeItem('userToken')
        setUserToken(null)
        setLoginUser(null)
        navigate('/login')
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error("Your account has been blocked. Contact support.")
        localStorage.removeItem('userToken')
        setUserToken(null)
        setLoginUser(null)
        navigate('/login')
      }
    }  
  }    

  const interval = setInterval(checkBlockStatus, 5000)
  return () => clearInterval(interval)

}, [userToken]) 

    useEffect(() => {
        if (!adminToken) return
        getTotalNumberUsers()
        getTotalNumberBuses()
        getTotalNumberBookings()
        getAllBookings()
        getMessages()
        getBuses()
        getUsers()
    },[adminToken]) 

    useEffect(() => {
        getAllBuses()
    },[])

    const value = {
        loginUser, setLoginUser,navigate, isOwnerLogin, setIsOwnerLogin, AdminLogin, adminToken, isAdminLoading, setAdminToken, totalNoBuses, totalNoUsers, totalNoBookings, bookings, buses, allUsers, addNewBus, getBuses, loading, deleteBus, deleteBooking, updateStatus, updateUserStatus, deleteUser, userToken, userLogin, messages,deleteMessages, sendMessage, webBuses
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)