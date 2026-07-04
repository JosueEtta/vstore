import React, { useState } from "react";
import axios from "axios";


export default function Login(){
    const [email,setEmail] = useState("");
    const [emailError,setEmailError] = useState("")
    const [name,setName] = useState("");
    const [nameError,setNameError] = useState("");
    const [password,setPassword] = useState("");
    const [passwordError,setPasswordError]= useState("");
    const [submitError,setSubmitError] = useState("")
    const [validData,setValidData] = useState(false)


      const submit_form =async(e)=>{
        e.preventDefault()
        check_name(name)
        check_email(email)
        check_password(password)
        console.log("Value of valid data is",validData)
        if(validData){
          try{
            const res = await axios.post("http://127.0.0.1:8000/api/token/",{"email":email,"name":name,"password":password});
            console.log(res.data)
            localStorage.setItem("accesToken",res.data.access)
            localStorage.setItem("refreshToken",res.data.refresh)
          }
          catch(error){
            setSubmitError(error.response?.detail)
            console.log(error)
          }
        }
        
    }
     
    function check_name(name){
       setName(name) 
       if(name == ""){
          setNameError("Name should not be empty.");
          setValidData(false)
       }
       else{
        setNameError("")
        setValidData(true)
       }
    }
    function check_email(email){
        setEmail(email)
        if(email.includes('@') == false){
            setEmailError("Email must conttain @.")
             setValidData(false)
        }
        else{
            setEmailError("")
            setValidData(true)
        }
    }
    function check_password(password){
        setPassword(password)
        if(password.length < 8){
            setPasswordError("Password should have at least 8 characters.")
            setValidData(false)
        }
        else{
            setPasswordError("")
            setValidData(true)
        }
    }

    return(
      <div className="min-h-screen flex items-center justify-center">  
       <form action="" className="flex flex-col gap-2 mx-auto w-80"onSubmit={submit_form}>
          <h2 className="text-3xl mb-2 font-semibold text-center">Login</h2>
           {submitError ? <p className="text-red-500 text-sm">{submitError}</p> : null}

          <div className="flex flex-col gap-2">
             <label htmlFor="">Email</label>
             <input type="email" name="email" className="border outline-none focus:border-amber-300 
             border-gray-400 py-2 px-3 rounded-lg"  
             placeholder="john@gmail.com"
             onChange={(e)=>{
                check_email(e.target.value)
             }}/>
             {emailError ? <p className="text-red-500 text-sm">{emailError}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
             <label htmlFor="">Password</label>
             <input type="passowrd" defaultValue="" name="password" className="border outline-none focus:border-amber-300 
             border-gray-400 py-2 px-3 rounded-lg" 
             placeholder="8 letters minimum" 
             onChange={(e)=>{
                check_password(e.target.value)
             }}/>
              {passwordError ? <p className="text-red-500 text-sm">{passwordError}</p> : null}
          </div>

          <div className="flex justify-center">
             <button className=" bg-amber-300 mt-2 text-black px-1 py-2 w-25 rounded-lg">Submit</button>
          </div>

       </form>
       </div>
    )
}