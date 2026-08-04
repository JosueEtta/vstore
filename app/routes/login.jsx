import React, { useState } from "react";
import axios from "axios";


export default function Login() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [submitError, setSubmitError] = useState("");

    const validateEmail = (value) => {
        const trimmed = value.trim();
        if (!trimmed) {
            return "Email is required.";
        }
        if (!trimmed.includes("@") || !trimmed.includes(".")) {
            return "Enter a valid email address.";
        }
        return "";
    };

    const validatePassword = (value) => {
        if (!value) {
            return "Password is required.";
        }
        if (value.length < 8) {
            return "Password should have at least 8 characters.";
        }
        return "";
    };

    const submit_form = async (e) => {
        e.preventDefault();

        const nextEmailError = validateEmail(email);
        const nextPasswordError = validatePassword(password);

        setEmailError(nextEmailError);
        setPasswordError(nextPasswordError);
        setSubmitError("");

        if (nextEmailError || nextPasswordError) {
            return;
        }

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/token/", {
                email,
                password,
            });

            const accessToken = res.data.accessToken || res.data.access;
            const refreshToken = res.data.refreshToken || res.data.refresh;
            const userRole = res.data.userRole || res.data.role || "client";

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userRole", userRole);
        } catch (error) {
            const serverErrors = error.response?.data?.errors;
            const detailMessage = error.response?.data?.detail || error.response?.data?.message;
            const message = detailMessage || serverErrors?.non_field_errors?.[0] || serverErrors?.email?.[0] || serverErrors?.password?.[0] || "Login failed.";

            setSubmitError(message);
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center">
       <form action="" className="flex flex-col gap-2 mx-auto w-80" onSubmit={submit_form}>
          <h2 className="text-3xl mb-2 font-semibold text-center">Login</h2>
           {submitError ? <p className="text-red-500 text-sm">{submitError}</p> : null}

          <div className="flex flex-col gap-2">
             <label htmlFor="">Email</label>
             <input
                type="email"
                name="email"
                className="border outline-none focus:border-amber-300 border-gray-400 py-2 px-3 rounded-lg"
                placeholder="john@gmail.com"
                value={email}
                onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    setEmailError(validateEmail(value));
                }}
             />
             {emailError ? <p className="text-red-500 text-sm">{emailError}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
             <label htmlFor="">Password</label>
             <input
                type="password"
                name="password"
                className="border outline-none focus:border-amber-300 border-gray-400 py-2 px-3 rounded-lg"
                placeholder="8 letters minimum"
                value={password}
                onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    setPasswordError(validatePassword(value));
                }}
             />
              {passwordError ? <p className="text-red-500 text-sm">{passwordError}</p> : null}
          </div>

          <div className="flex justify-center">
             <button className="bg-amber-300 mt-2 text-black px-1 py-2 w-25 rounded-lg">Submit</button>
          </div>

       </form>
       </div>
    )
}