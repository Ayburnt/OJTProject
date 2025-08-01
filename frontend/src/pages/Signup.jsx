import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { HiOutlineCalendarDays } from "react-icons/hi2"; // Changed from LuCalendarDays to match current code
import { HiOutlineIdentification } from "react-icons/hi";
import { HiMail } from 'react-icons/hi';
import { IoIosArrowBack } from "react-icons/io";
import api, { ACCESS_TOKEN } from '../api.js';

function Signup({ onAuthSuccess }) {
    useEffect(() => {
        document.title = "Sign Up | Sari-Sari Events";
    }, []);

    // Default handleAuthSuccess if not provided as a prop
    const defaultHandleAuthSuccess = (userData, tokens) => {
        localStorage.setItem(ACCESS_TOKEN, tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        
        // Store other user data received from backend
        localStorage.setItem('userFirstName', userData.first_name || '');
        localStorage.setItem('userProfile', userData.profile_picture || '');

        if (userData.needs_profile_completion || selectedRole === 'guest') {
            // Pre-fill step 4 fields with any data already available (e.g., from Google)
            setFirstname(userData.first_name || '');
            setLastname(userData.last_name || '');
            setPhoneNo(userData.phone_number || '');
            setBirthday(userData.birthday || '');
            setGender(userData.gender || '');
            setCompanyName(userData.company_name || '');
            setCompanyWebsite(userData.company_website || '');
            setStep(4); // Navigate to the fill-up form
        } else {        
            if (userData.role === 'client') {
                navigate("/client-dashboard");
            } else if (userData.role === 'guest') {
                navigate("/");
            } else {
                navigate("/dashboard"); // Fallback for other roles like 'admin'
            }
        }
    };

    const actualOnAuthSuccess = onAuthSuccess || defaultHandleAuthSuccess;

    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(paste)) {
            const newOtp = paste.split('');
            setOtp(newOtp);
            newOtp.forEach((digit, idx) => {
                if (inputsRef.current[idx]) {
                    inputsRef.current[idx].value = digit;
                }
            });
        }
        e.preventDefault();
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [isAttendee, setIsAttendee] = useState(false);
    const [selectedRole, setSelectedRole] = useState("guest"); // Default to 'guest'

    // States for Step 4 (Fill up Information)
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [birthday, setBirthday] = useState(""); // birthday
    const [gender, setGender] = useState("");
    const [companyName, setCompanyName] = useState(""); // New field for client
    const [companyWebsite, setCompanyWebsite] = useState(""); // New field for client
    const [agree, setAgree] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [roleMsg, setRoleMsg] = useState("");

    // New state for email specific error
    const [emailError, setEmailError] = useState("");
    // New state for OTP verification loading
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    // Manual Signup Flow: Step 2 to Step 3 (Email/Pass to OTP)
    const handleEmailPass = async (e) => {
        e.preventDefault();
        // Clear previous errors
        setStep2Err("");
        setEmailError("");
        setMessage(""); // Clear general message

        if (!email || !password || !confirmPassword) {
            setStep2Err("Please fill in all fields.");
            return;
        }
        if (!isMatch) {
            return; // Passwords don't match, error already displayed
        }

        setIsLoading(true);
        setMessage("Checking email and sending verification code...");

        try {
            // Step 1: Check if email exists
            const emailCheckResponse = await api.post('/auth/email-check/', { email }); // Corrected endpoint
            if (emailCheckResponse.data.exists) {
                setEmailError("This email is already registered. Please use a different email or sign in.");
                setIsLoading(false);
                return;
            }

            // Step 2: Send OTP if email is unique
            const otpSendResponse = await api.post('/auth/otp-send/', { email }); // Corrected endpoint
            if (otpSendResponse.status === 200) {
                setMessage("");
                setStep(3); // Proceed to OTP verification step
            } else {
                setMessage(otpSendResponse.data.detail || "Failed to send verification code. Please try again.");
            }
        } catch (error) {
            console.error('Error during email check or OTP send:', error);
            const data = error.response?.data;
            if (data) {
                if (data.email) setEmailError(data.email[0]);
                else setMessage(data.detail || 'An error occurred. Please try again.');
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Manual Signup Flow: Step 3 (OTP Verification)
    const [otpError, setOtpError] = useState(false);
    const [otpErrMsg, setOtpErrMsg] = useState("");
    const handleOtpVerification = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            setMessage("Please enter the complete 6-digit code.");
            return;
        }

        setIsVerifyingOtp(true);
        setMessage("");

        try {
            const response = await api.post('/auth/otp-verify/', { email, otp: enteredOtp });
            if (response.status === 200) {
                setMessage("");
                setOtpError(false);
                setOtpErrMsg("");

                // After OTP verification, now perform the actual user registration
                const registrationResponse = await api.post('/auth/register/', {
                    first_name: firstname, // These might be empty, will be filled in step 4
                    last_name: lastname,   // These might be empty, will be filled in step 4
                    email: email,
                    password: password,
                    role: selectedRole,
                    confirm_password: confirmPassword,
                    phone_number: null, // Initial registration doesn't include these
                    birthday: null,
                    gender: null,
                    company_name: null,
                    company_website: null,
                });

                const data = registrationResponse.data;
                if (registrationResponse.status === 201) {
                    setMessage('');
                    actualOnAuthSuccess(data.user, data.tokens); // This will handle redirection (to step 4 or dashboard)
                } else {
                    setMessage(data.detail || 'Registration failed after OTP. Please try again.');
                }

            } else {
                setOtpError(true);
                setOtpErrMsg(response.data.detail || "Invalid or expired verification code.");
            }
        } catch (error) {
            console.error("Error verifying OTP or during registration:", error);
            const data = error.response?.data;
            setOtpError(true);
            setOtpErrMsg(data?.detail || "Failed to verify code or register. Please try again.");
        } finally {
            setIsVerifyingOtp(false);
            setIsLoading(false); // Ensure main loading state is also reset
        }
    };

    // Function to handle profile completion submission (from step 4)
    const handleProfileCompletionSubmit = async (e) => {
        e.preventDefault();
        if (!agree) {
            setMessage("Please agree to the terms and conditions.");
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // Send updated profile data to the new profile completion endpoint
            const backendResponse = await api.post('/auth/complete-profile/', {
                first_name: firstname,
                last_name: lastname,
                phone_number: phoneNo,
                birthday: birthday,
                gender: gender,
                company_name: companyName,
                company_website: companyWebsite,
            });

            const data = backendResponse.data;

            if (backendResponse.status === 200) {
                setMessage('');
                // Update local storage with new profile data
                localStorage.setItem('userFirstName', data.user.first_name || '');
                localStorage.setItem('userProfile', data.user.profile_picture || '');
                localStorage.setItem('userRole', data.user.role); // Ensure role is consistent
                localStorage.setItem('isLoggedIn', true);

                // Final redirect after profile completion
                if (data.user.role === 'client') {
                    navigate("/organizer-dashboard");
                } else if (data.user.role === 'guest') {
                    navigate("/");
                } else {
                    navigate("/dashboard");
                }
            } else {
                setMessage(data.detail || 'Failed to save profile information. Please try again.');
            }
        } catch (error) {
            console.error('Error during profile completion:', error);
            const data = error.response?.data;
            setMessage(data?.detail || 'An error occurred while saving profile information.');
        } finally {
            setIsLoading(false);
        }
    };

    // Use a ref to store the latest 'selectedRole' value
    const selectedRoleRef = useRef(selectedRole);
    useEffect(() => {
        selectedRoleRef.current = selectedRole; // Keep the ref updated with the latest 'selectedRole' state
    }, [selectedRole]); // This useEffect runs when 'selectedRole' state changes

    // State to track if Google script is loaded
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
    // Ref to track if Google GSI has been initialized (to prevent re-initialization)
    const googleGsiInitialized = useRef(false);

    // Effect to load Google API script once
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setGoogleScriptLoaded(true); // Mark script as loaded
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []); // Runs only once on mount

    // New useEffect to initialize and render Google button when script is loaded AND step is 2
    useEffect(() => {
        if (googleScriptLoaded && window.google && step === 2 && !googleGsiInitialized.current) {
            // Initialize Google Sign-In only once
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Ensure this is correctly configured in your .env
                callback: (response) => handleGoogleSignUp(response, selectedRoleRef.current),
            });

            // Render the Google Sign-Up button directly
            const googleButtonContainer = document.getElementById('google-sign-up-button');
            if (googleButtonContainer) {
                window.google.accounts.id.renderButton(
                    googleButtonContainer,
                    { theme: 'outline', size: 'large', text: 'signup_with', width: '360' }
                );
                googleGsiInitialized.current = true; // Mark GSI as initialized
            } else {
                console.error("Google Sign-Up button container not found!");
            }
        }
    }, [googleScriptLoaded, step]); // Re-run when script loads or step changes

    // Modified handleGoogleSignUp to accept 'currentRole' from the ref
    const handleGoogleSignUp = async (response, currentRole) => {

        setIsLoading(true);
        setMessage('');
        try {
            // Send the role from the ref. Phone/birthday are not sent from frontend for Google sign-up.
            const backendResponse = await api.post('/auth/google/register/', {
                token: response.credential,
                role: currentRole, // Use the currentRole passed from the ref
            });

            const data = backendResponse.data;

            setMessage('');
            actualOnAuthSuccess(data.user, data.tokens); // This will handle redirection (to step 4 or dashboard)

        } catch (error) {
            console.error('Error during Google sign-up:', error);
            const data = error.response?.data;
            if (data) {
                if (data.detail) setMessage(data.detail);
                else if (data.message) setMessage(data.message);
                else setMessage('Google Sign-up failed. Please try again.');
            } else {
                setMessage('An error occurred during Google sign-up.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const [isMatch, setIsMatch] = useState(true);
    const [passwordErr, setPasswordErr] = useState("");
    const [step2Err, setStep2Err] = useState("");

    useEffect(() => {
        if (password === '' && confirmPassword === '') {
            setPasswordErr('');
            setIsMatch(true);
            return;
        }

        if (password !== confirmPassword) {
            setIsMatch(false);
            setPasswordErr("Passwords do not match.");
        } else {
            setPasswordErr("");
            setIsMatch(true);
        }
    }, [password, confirmPassword]);


    return (
        <div className="flex items-start justify-center h-screen bg-primary"> {/* Light background like in the image */}
            <form
                className="w-[90%] max-w-lg py-12 flex flex-col justify-center items-center font-outfit"
            >
                {step === 1 && (
                    <>

                        <div className="w-full max-w-md flex items-center text-left ml-2 mt-1 mb-8 px-6 gap-1 cursor-pointer" onClick={() => navigate('/')}>
                            <IoIosArrowBack className="text-secondary text-xl" />
                            <span className="text-secondary text-sm font-medium font-outfit">Back to home</span>
                        </div>

                        <div className="w-[45%] max-w-md flex items-center mb-6 ">
                            <img src="/sariLogo.png" alt="Sari-Sari Events Logo" />
                        </div>

                        <p className="font-outfit text-2xl text-center font-semibold text-black mb-12">Choose your role to get started</p> {/* Improved typography */}

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full transition-colors duration-500 px-6"> {/* Adjusted gap and added padding */}
                            <div
                                className={`w-full max-w-sm flex items-center justify-center flex-col border-3 border-secondary rounded-xl cursor-pointer transition-all duration-400 p-8
                                ${isOrganizer ? 'bg-secondary text-white shadow-md scale-105' : 'bg-white text-secondary'}`}
                                onClick={() => {
                                    setIsOrganizer(true);
                                    setIsAttendee(false);
                                    setSelectedRole("client");
                                }}>

                                <HiOutlineCalendarDays className="text-[8rem]" /> {/* Adjusted icon size */}
                                <p className={`uppercase font-outfit text-lg font-bold mt-4 ${isOrganizer ? 'text-white' : 'text-secondary'}`}>organizer</p> {/* Improved typography */}
                            </div>

                            <div
                                className={`w-full max-w-sm flex items-center justify-center flex-col border-3 border-[#009a94] rounded-xl cursor-pointer transition-all duration-400 p-8
                                ${isAttendee ? 'bg-secondary text-white shadow-md scale-105' : 'bg-white text-secondary'}`}
                                onClick={() => {
                                    setIsOrganizer(false);
                                    setIsAttendee(true);
                                    setSelectedRole("guest");
                                }}
                            >
                                <HiOutlineIdentification className="text-[8rem]" /> {/* Adjusted icon size */}
                                <p className={`uppercase font-outfit text-lg font-bold mt-4 ${isAttendee ? 'text-white' : 'text-secondary'}`}>attendee</p> {/* Improved typography */}
                            </div>
                        </div>

                        <button
                            className="bg-secondary text-white uppercase font-bold py-3 mt-10 w-[80%] max-w-xs rounded-md shadow-md cursor-pointer transition-all duration-300"
                            disabled={!isOrganizer && !isAttendee}
                            onClick={() => {
                                if (selectedRole) {
                                    setStep(2);
                                } else {
                                    setRoleMsg("Please select a role to continue.");
                                }
                            }}> Done </button>
                            {roleMsg && <p className="text-center text-sm mt-4 text-red-500">{roleMsg}</p>}
                        <p className="text-gray-600 font-outfit mt-8"> {/* Adjusted margin and color */}
                            Already have an account? <Link className="text-[#009a94] font-semibold" to={'/login'}>Sign in</Link> {/* Improved link style */}
                        </p>
                    </>
                )}


                {step === 2 && (
                    <>
                        <div className="w-full text-left">
                            <IoArrowBackCircle className="text-secondary text-[2rem] mb-5 mt-1 ml-3" onClick={() => setStep(1)} />
                        </div>

                        <h2 className="text-2xl font-bold font-outfit mb-4 text-center">Sign Up</h2>


                        <div className="mb-4 w-65">
                            <label htmlFor="email" className="block mb-2 font-outfit text-sm pl-1 font-medium">E-mail</label>
                            <input
                                type="email" id="email" name="email"
                                className={`w-full px-4 py-1 border rounded outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-grey focus:ring-secondary'}`}
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                            {emailError && <p className="font-outfit text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        <div className="mb-4 w-65">
                            <label htmlFor="password" className="block mb-2 pl-1 text-sm font-outfit font-medium">Password</label>
                            <input
                                type="password" id="password" name="password"
                                className={`w-full px-4 py-1 border rounded border-grey rounded outline-none focus:ring-2 ${isMatch === false ? `border-red-500 focus:ring-red-500` : `focus:ring-secondary`}`}
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <div className="mb-6 w-65">
                            <label htmlFor="confirmPassword" className="block mb-2 pl-1 text-sm font-outfit font-medium">Confirm Password</label>
                            <input
                                type="password" id="confirmPassword" name="confirmPassword"
                                className={`w-full px-4 py-1 border rounded border-grey rounded outline-none focus:ring-2 ${isMatch === false ? `border-red-500 focus:ring-red-500` : `focus:ring-secondary`}`}
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            {passwordErr && <p className="font-outfit text-red-500 text-sm mb-2">{passwordErr}</p>}
                        </div>
                        <button
                            className="w-65 bg-secondary text-white py-1 font-outfit rounded-lg transition"
                            onClick={handleEmailPass} // Call handleEmailPass for email check and OTP send
                            disabled={isLoading} // Disable button while loading
                        >
                            {isLoading ? 'Processing...' : 'Sign up'}
                        </button>

                        <div className="flex items-center justify-center mt-7 w-[80%] max-w-xs">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* This div is where the Google button will be rendered by the GSI script */}
                        <div id="google-sign-up-button" className="flex justify-center mt-5">
                            {/* Google button will appear here */}
                        </div>

                        <p className="text-grey font-outfit mt-10">Already have an account? <Link className="text-secondary" to={'/login'}>Sign in</Link></p>
                        {step2Err && <p className="text-center text-sm mt-4 text-red-500">{step2Err}</p>}
                    </>
                )}


                {step === 3 && (
                    <div className="w-full text-left font-outfit">
                        <IoArrowBackCircle className="text-secondary text-[2rem] mb-5 mt-1 ml-3" onClick={() => setStep(2)} />
                        <div className="flex flex-col justify-between h-screen px-4 py-4 bg-primary">

                            <div className="text-center mt-2">
                                <h2 className="text-3xl font-outfit font-bold"> E-mail <br /> Verification </h2>
                                <div className="flex justify-center mt-6">
                                    <HiMail className="text-9xl text-secondary " />
                                </div>
                                <p className="text-base p-2 font-bold font-outfit text-left mt-10"> Please enter your verification code </p>
                                <p className="text-xs p-1 font-outfit text-left "> We have sent a verification to your registered email ID. </p>

                                {otpError === true && <p className="font-outfit text-center text-lg mt-4 text-red-500 font-bold">{otpErrMsg}</p>}

                                {/* Bottom Section: OTP Input Box */}
                                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm mx-auto text-center">
                                    <div className={"flex justify-center gap-2 mb-2"} onPaste={handlePaste}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                ref={(el) => (inputsRef.current[index] = el)}
                                                onChange={(e) => handleChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className={`w-10 h-12 text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-gray-100 ${otpError ? `border-3 border-red-300` : `border-1 border-gray-300`}`}
                                            />
                                        ))}
                                    </div>

                                    <div className="border-t-1 border-black my-3 w-full"></div>
                                </div>

                                <button
                                    type="button" onClick={handleOtpVerification} // Call handleOtpVerification
                                    className="w-[80%] bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 mt-3 font-outfit transition shadow-lg"
                                    disabled={isVerifyingOtp}
                                >
                                    {isVerifyingOtp ? 'Verifying...' : 'Done'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    // Fillup Information
                    <>
                        <div className="w-full text-left">
                            <IoArrowBackCircle className="text-secondary text-[2rem] mb-5 mt-1 ml-3" onClick={() => {
                                // Decide where to go back based on how they got to step 4
                                // If already authenticated (e.g., Google signup), go back to login page
                                // If manual signup, go back to OTP step
                                if (localStorage.getItem('refreshToken')) { // Simple check if user is already "logged in"
                                    navigate("/login"); // Or a specific "profile incomplete" page
                                } else {
                                    setStep(3); // Go back to OTP if manual signup path
                                }
                            }} />
                        </div>

                        <h2 className="text-2xl font-bold mt-3 mb-4 text-center font-outfit">Create Your Attendee Account</h2>

                        <div className="mb-4 w-80">
                            <label htmlFor="firstN" className="block mb-2 pl-1 text-sm font-medium font-outfit"> First Name </label>
                            <input
                                type="text" id="firstname" name="firstname"
                                className="w-full px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
                                value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="lastN" className="block mb-2pl-1 text-sm font-medium font-outfit">Last Name</label>
                            <input
                                type="text" id="lastname" name="lastname"
                                className="w-full px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
                                value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="phoneNo" className="block mb-2 pl-1 text-sm font-medium font-outfit">Phone Number</label>
                            <input
                                type="tel" id="phoneNo" name="phoneNo" placeholder="e.g. 09xxxxxxxxx" maxLength={11} oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                                className="w-full px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
                                value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required />
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="date" className="block pl-1 mb-2 text-sm font-medium font-outfit">Date of Birth</label>
                            <input type="date" id="birthday" name="birthday"
                                className="w-full px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
                                value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="gender" className="block mb-2 pl-1 text-sm font-medium font-outfit">Gender</label>
                            <select
                                id="gender" name="gender"
                                className="w-full px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
                                value={gender} onChange={(e) => setGender(e.target.value)} required
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Conditionally render company fields for 'client' role */}
                        {selectedRoleRef.current === 'client' && (
                            <>
                                <div className="mb-4 w-80">
                                    <label htmlFor="companyName" className="block mb-2 pl-1 text-sm font-medium font-outfit">Company Name</label>
                                    <input
                                        type="text" id="companyName" name="companyName"
                                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                        value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                                </div>
                                <div className="mb-4 w-80">
                                    <label htmlFor="companyWebsite" className="block mb-2 pl-1 text-sm font-medium font-outfit">Company Website</label>
                                    <input
                                        type="url" id="companyWebsite" name="companyWebsite" // Changed type to url
                                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                        value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                                </div>
                            </>
                        )}

                        <div className="flex items-center w-65">
                            <input
                                type="checkbox" id="agree" className="mr-2"
                                checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                            <p className="font-outfit text-sm mb-4">
                                I agree and I have read and accepted Eventchuchu.
                                <span className="text-blue-500">Terms and Conditions</span> </p>
                        </div>
                        <button
                            type="submit" onClick={handleProfileCompletionSubmit} // Call handleProfileCompletionSubmit
                            className="w-65 bg-secondary text-white py-2 rounded-lg transition"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Continue'}
                        </button>
                        {message && <p className="font-outfit text-center text-sm mt-4 text-red-500">{message}</p>}
                        <p className="text-grey font-outfit mt-5">Already have an account? <Link className="text-secondary" to={'/login'}>Sign in</Link></p>                        
                    </>
                )}
            </form>
        </div>
    );
}

export default Signup;
