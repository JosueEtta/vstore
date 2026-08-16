import React, { useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router"


export default function Signup() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPassowrdError, setConfirmPasswordError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const navigate = useNavigate()

    const validateName = (value) => {
        const trimmed = value.trim();
        if (!trimmed) {
            return "Name should not be empty.";
        }
        return "";
    };

    const validateEmail = (value) => {
        const trimmed = value.trim();
        if (!trimmed) {
            return "Email is required.";
        }
        if (!trimmed.includes("@") || !trimmed.includes(".")) {
            return "Email must contain @ and a domain.";
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

    const validateConfirmPassword = (value) => {
        if (!value) {
            return "Confirm password is required.";
        }
        if (value.length < 8) {
            return "Password should have at least 8 characters.";
        }
        if (value !== password) {
            return "Passwords don't match.";
        }
        return "";
    };

    const submit_form = async (e) => {
        e.preventDefault();

        const nextNameError = validateName(name);
        const nextEmailError = validateEmail(email);
        const nextPasswordError = validatePassword(password);
        const nextConfirmPasswordError = validateConfirmPassword(confirmPassword);

        setNameError(nextNameError);
        setEmailError(nextEmailError);
        setPasswordError(nextPasswordError);
        setConfirmPasswordError(nextConfirmPasswordError);
        setSubmitError("");
        setSubmitSuccess("");

        if (nextNameError || nextEmailError || nextPasswordError || nextConfirmPasswordError) {
            return;
        }

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/v1/user/create_account/", {
                email,
                name,
                password,
            });

            setSubmitSuccess(res.data.message || "Account created successfully.");
            navigate("/login")
        } catch (error) {
            const errors = error.response?.data?.errors;
            const message = errors?.email?.[0] || errors?.name?.[0] || errors?.password?.[0] || errors?.non_field_errors?.[0] || "Account creation failed.";
            setSubmitError(message);
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center">
       <form action="" className="flex flex-col gap-2 mx-auto w-80" onSubmit={submit_form}>
          <h2 className="text-3xl mb-2 font-semibold text-center text-gray-950">Create Account</h2>
           {submitError ? <p className="text-red-500 text-sm">{submitError}</p> : null}
           {submitSuccess ? <p className="text-green-600 text-sm">{submitSuccess}</p> : null}

          <div className="flex flex-col gap-2">
             <label htmlFor="" className="text-gray-950 font-semibold">Name</label>
             <input
                type="text"
                name="name"
                className="border outline-none focus:border-amber-300 border-gray-300 py-2 px-3 rounded-lg"
                placeholder="John Brown"
                value={name}
                onChange={(e) => {
                    const value = e.target.value;
                    setName(value);
                    setNameError(validateName(value));
                }}
             />
             {nameError ? <p className="text-red-500 text-sm">{nameError}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
             <label htmlFor="" className="text-gray-950 font-semibold">Email</label>
             <input
                type="email"
                name="email"
                className="border outline-none focus:border-amber-300 border-gray-300 py-2 px-3 rounded-lg"
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
             <label htmlFor="" className="text-gray-950 font-semibold">Password</label>
             <input
                type="password"
                name="password"
                className="border outline-none focus:border-amber-300 border-gray-300 py-2 px-3 rounded-lg"
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

           <div className="flex flex-col gap-2">
             <label htmlFor="" className="text-gray-950 font-semibold">Confirm Password</label>
             <input
                type="password"
                name="confirmPassword"
                className="border outline-none focus:border-amber-300 border-gray-300 py-2 px-3 rounded-lg"
                placeholder="8 letters minimum"
                value={confirmPassword}
                onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);
                    setConfirmPasswordError(validateConfirmPassword(value));
                }}
             />
              {confirmPassowrdError ? <p className="text-red-500 text-sm">{confirmPassowrdError}</p> : null}
          </div>

          <div className="flex justify-center">
             <button className="bg-amber-500 mt-2 text-white font-semibold px-1 py-2 w-25 rounded-lg">Submit</button>
          </div>

       </form>
       </div>
    )
}