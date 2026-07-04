import React, { useState } from "react";
import axios from "axios";


export default function Signup(){
    const [email,setEmail] = useState("");
    const [emailError,setEmailError] = useState("")
    const [name,setName] = useState("");
    const [nameError,setNameError] = useState("");
    const [password,setPassword] = useState("");
    const [passwordError,setPasswordError]= useState("");
    const [confirmPassword,setConfirmPassword] = useState("")
    const [confirmPassowrdError,setConfirmPasswordError] = useState("")
    const [submitError,setSubmitError] = useState("")
    const [validData,setValidData] = useState(false)


      const submit_form =async(e)=>{
        e.preventDefault()
        check_name(name)
        check_email(email)
        check_password(password)
        check_confirm_password(confirmPassword)
        console.log(name,password,email)
        console.log("Value of valid data is",validData)
        if(validData){
          try{
            const res = await axios.post("http://127.0.0.1:8000/api/v1/user/create_account/",{"email":email,"name":name,"password":password});
            console.log(res.data)
          }
          catch(error){
            setSubmitError(error.response)
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
    function check_confirm_password(confirm_password){
         setConfirmPassword(confirmPassword)
         console.log("Your confirm password lenght is",confirm_password.length)
         console.log("COnfirm Passowrd is",confirm_password)
         if(confirm_password.length < 8){
            console.log("Your password lenght is",confirm_password.length)
            setConfirmPasswordError("Password should have at least 8 characters.")
            setValidData(false)
        }
        else if(confirm_password != password){
            console.log("Passowrd is :",password)
             setConfirmPasswordError("Password don't match.")
             setValidData(false) 
        }
        else{
            setConfirmPasswordError("")
            setValidData(true)
        }
    }

    return(
      <div className="min-h-screen flex items-center justify-center">  
       <form action="" className="flex flex-col gap-2 mx-auto w-80"onSubmit={submit_form}>
          <h2 className="text-3xl mb-2 font-semibold text-center">Create Account</h2>
           {submitError ? <p className="text-red-500 text-sm">{submitError}</p> : null}

          <div className="flex flex-col gap-2">
             <label htmlFor="">Name</label>
             <input type="text" name="name" className="border outline-none focus:border-amber-300
              border-gray-400 py-2 px-3 rounded-lg" 
             placeholder="John Brown"
             onChange={(e)=>{
                 check_name(e.target.value)
             }} />
             {nameError ? <p className="text-red-500 text-sm">{nameError}</p> : null}
          </div>

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
             <input type="text" defaultValue="" name="password" className="border outline-none focus:border-amber-300 
             border-gray-400 py-2 px-3 rounded-lg" 
             placeholder="8 letters minimum" 
             onChange={(e)=>{
                check_password(e.target.value)
             }}/>
              {passwordError ? <p className="text-red-500 text-sm">{passwordError}</p> : null}
          </div>

           <div className="flex flex-col gap-2">
             <label htmlFor="">Confirm Password</label>
             <input type="text" name="password"className="border outline-none focus:border-amber-300 
             border-gray-400 py-2 px-3 rounded-lg" 
             placeholder="8 letters minimum" 
             onChange={(e)=>{
                check_confirm_password(e.target.value)
             }}/>
              {confirmPassowrdError ? <p className="text-red-500 text-sm">{confirmPassowrdError}</p> : null}
          </div>

          <div className="flex justify-center">
             <button className=" bg-amber-300 mt-2 text-black px-1 py-2 w-25 rounded-lg">Submit</button>
          </div>

       </form>
       </div>
    )
}