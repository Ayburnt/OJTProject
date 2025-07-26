import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { HiOutlineIdentification } from "react-icons/hi";
import { HiMail } from 'react-icons/hi';
import { FaGoogle } from "react-icons/fa";
import api, { ACCESS_TOKEN } from '../api.js';

function Signup({ onAuthSuccess }) {
    useEffect(() => {
        document.title = "Sign Up | Sari-Sari Events";
    }, [])

    const defaultHandleAuthSuccess = (userData, tokens) => {
        localStorage.setItem(ACCESS_TOKEN, tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);

        // Conditional redirection based on user role
        if (userData.role === 'client') {
            navigate("/client-dashboard");
        } else if (userData.role === 'guest') {
            navigate("/");
        } else {
            navigate("/dashboard");
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
    const [selectedRole, setSelectedRole] = useState("guest");

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("");
    const [agree, setAgree] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    // New state for email specific error
    const [emailError, setEmailError] = useState("");
    // New state for OTP verification loading
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (!agree) {
            setMessage("Please agree to the terms and conditions.");
            return;
        }

        setIsLoading(true);
        setMessage('Signing up...');

        try {
            const backendResponse = await api.post('/auth/register/', {
                first_name: firstname,
                last_name: lastname,
                email: email,
                password: password,
                role: selectedRole, // Use selectedRole for manual signup
                confirm_password: confirmPassword,
                phone_number: phoneNo,
                birthday: birthday,
                gender: gender, // Assuming your backend accepts gender
            });

            const data = backendResponse.data;

            if (backendResponse.status === 201) { // Check for 201 Created status for successful registration
                setMessage('Sign-up successful! Redirecting to dashboard...');
                actualOnAuthSuccess(data.user, data.tokens); // Use actualOnAuthSuccess
            } else {
                // This block might not be reached if Axios throws an error for non-2xx status
                setMessage(data.detail || 'Sign-up failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during manual sign-up:', error);
            const data = error.response?.data;
            if (data) {
                if (data.email) setMessage(`Email: ${data.email[0]}`);
                else if (data.password) setMessage(`Password: ${data.password[0]}`);
                else if (data.confirm_password) setMessage(`Confirm Password: ${data.confirm_password[0]}`);
                else if (data.phone_number) setMessage(`Phone Number: ${data.phone_number[0]}`);
                else if (data.birthday) setMessage(`Birthday: ${data.birthday[0]}`);
                else if (data.non_field_errors) setMessage(data.non_field_errors[0]);
                else setMessage(data.detail || 'Sign-up failed. Please try again.');
            } else {
                setMessage('An error occurred during sign-up.');
            }
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
                client_id: '1012610059915-plt61d82bht9hnk9j9p8ntnaf8ta4nu7.apps.googleusercontent.com', // <<-- REPLACE THIS WITH YOUR ACTUAL GOOGLE CLIENT ID
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
        console.log('Google Sign-Up Response:', response);
        console.log('Role from ref (should be correct):', currentRole); // This should now show the correct role

        setIsLoading(true);
        setMessage('Signing up with Google...');
        try {
            // Send the role from the ref. Phone/birthday are not sent from frontend for Google sign-up.
            const backendResponse = await api.post('/auth/google/register/', {
                token: response.credential,
                role: currentRole, // Use the currentRole passed from the ref
            });

            const data = backendResponse.data;

            setMessage('Google Sign-up successful!');
            actualOnAuthSuccess(data.user, data.tokens); // Use actualOnAuthSuccess
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

    const handleEmailPass = async (e) => {
        e.preventDefault();
        // Clear previous errors
        setStep2Err("");
        setEmailError("");

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
            const emailCheckResponse = await api.post('/auth/check-email/', { email });
            if (emailCheckResponse.data.exists) {
                setEmailError("This email is already registered. Please use a different email or sign in.");
                setIsLoading(false);
                return;
            }

            // Step 2: Send OTP if email is unique
            const otpSendResponse = await api.post('/auth/send-otp/', { email });
            if (otpSendResponse.status === 200) {
                setMessage("Verification code sent to your email.");
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
        setMessage("Verifying code...");

        try {
            const response = await api.post('/auth/verify-otp/', { email, otp: enteredOtp });
            if (response.status === 200) {
                setMessage("Email verified successfully!");
                setStep(4); // Proceed to fill up information
                setOtpError(false);
                setOtpErrMsg("");
            } else {
                setOtpError(true);
                setOtpErrMsg(response.data.detail || "Invalid or expired verification code.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            const data = error.response?.data;
            setOtpError(true);
            setOtpErrMsg(data?.detail || "Failed to verify code. Please try again.");
        } finally {
            setIsVerifyingOtp(false);
        }
    };


    return (
        <div className="flex items-start justify-center h-screen bg-primary">
            <form
                className="rounded w-[90%] py-10 flex flex-col justify-center items-center">
                {step === 1 && (
                    <>
                        <div className="w-full text-left mb-10">
                            <IoArrowBackCircle className="text-secondary text-[2.5rem]" onClick={() => navigate(-1)} /> {/* Use navigate(-1) for back */}
                        </div>

                        <p className="font-outfit text-xl mb-10">Choose your role to get started</p>

                        <div className="flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-[5rem] w-full transition-colors duration-500">
                            <div className={`w-[80%] xl:w-[20%] flex items-center justify-center flex-col border-3 border-secondary rounded-2xl cursor-pointer transition-colors duration-400
                    ${isOrganizer && `bg-secondary`}`}
                                onClick={() => {
                                    setIsOrganizer(true);
                                    setIsAttendee(false);
                                    setSelectedRole("client"); // Set role to 'client' for organizer
                                }}>
                                <HiOutlineCalendarDays className={`text-secondary text-[9rem] ${isOrganizer && `text-white`}`} />
                                <p className={`uppercase font-outfit text-secondary font-bold ${isOrganizer && `text-white`}`}>organizer</p>
                            </div>

                            <div className={`w-[80%] xl:w-[20%] flex items-center justify-center flex-col border-3 border-secondary rounded-2xl cursor-pointer transition-colors duration-400
                    ${isAttendee && `bg-secondary`}`}
                                onClick={() => {
                                    setIsOrganizer(false);
                                    setIsAttendee(true);
                                    setSelectedRole("guest"); // Set role to 'guest' for attendee
                                }}>
                                <HiOutlineIdentification className={`text-secondary text-[9rem] ${isAttendee && `text-white`}`} />
                                <p className={`uppercase font-outfit text-secondary font-bold ${isAttendee && `text-white`}`}>attendee</p>
                            </div>
                        </div>

                        <button className="bg-secondary w-[70%] xl:w-[20%] py-2 mt-10 rounded-md text-white uppercase shadow-md cursor-pointer" disabled={!isOrganizer && !isAttendee}
                            onClick={() => {
                                // Only proceed if a role is selected
                                if (selectedRole) {
                                    setStep(2);
                                } else {
                                    setMessage("Please select a role to continue.");
                                }
                            }}>done</button>
                        <p className="text-grey font-outfit mt-10">Already have an account? <Link className="text-secondary" to={'/login'}>Sign in</Link></p>
                        {message && <p className="text-center text-sm mt-4 text-gray-600">{message}</p>}
                    </>
                )}


                {step === 2 && (
                    <>
                        <div className="w-full text-left">
                            <IoArrowBackCircle className="text-secondary text-[2.5rem] mb-10" onClick={() => setStep(1)} />
                        </div>

                        <h2 className="text-2xl font-bold font-outfit mb-4 text-center">Sign Up</h2>


                        <div className="mb-4 w-80">
                            <label htmlFor="email" className="block mb-2 font-outfit text-sm pl-1 font-medium">E-mail</label>
                            <input
                                type="email" id="email" name="email"
                                className={`w-full px-4 py-2 border rounded outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-grey focus:ring-secondary'}`}
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="password" className="block mb-2 pl-1 text-sm font-outfit font-medium">Password</label>
                            <input
                                type="password" id="password" name="password"
                                className={`w-full px-4 py-2 border rounded border-grey rounded outline-none focus:ring-2 ${isMatch === false ? `border-red-500 focus:ring-red-500` : `focus:ring-secondary`}`}
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <div className="mb-6 w-80">
                            {passwordErr && <p className="text-red-500 text-sm mb-2">{passwordErr}</p>}
                            <label htmlFor="confirmPassword" className="block mb-2 pl-1 text-sm font-outfit font-medium">Confirm Password</label>
                            <input
                                type="password" id="confirmPassword" name="confirmPassword"
                                className={`w-full px-4 py-2 border rounded border-grey rounded outline-none focus:ring-2 ${isMatch === false ? `border-red-500 focus:ring-red-500` : `focus:ring-secondary`}`}
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>

                        <button
                            className="w-80 bg-secondary text-white py-2 font-outfit rounded-lg transition"
                            onClick={handleEmailPass}
                            disabled={isLoading} // Disable button while loading
                        >
                            {isLoading ? 'Processing...' : 'Sign up'}
                        </button>

                        <div className="flex items-center justify-center mt-7 w-full max-w-xs">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* This div is where the Google button will be rendered by the GSI script */}
                        <div id="google-sign-up-button" className="flex justify-center mt-5">
                            {/* Google button will appear here */}
                        </div>

                        <p className="text-grey font-outfit mt-10">Already have an account? <Link className="text-secondary" to={'/login'}>Sign in</Link></p>
                        {message && <p className="text-center text-sm mt-4 text-gray-600">{message}</p>}
                        {step2Err && <p className="text-center text-sm mt-4 text-red-500">{step2Err}</p>}
                    </>
                )}


                {step === 3 && (
                    <div className="w-full text-left">
                        <IoArrowBackCircle className="text-secondary text-[2.5rem] mb-10" onClick={() => setStep(2)} />
                        <div className="flex flex-col justify-between h-screen px-4 py-4 bg-primary">

                            <div className="text-center mt-5">
                                <h2 className="text-3xl font-outfit font-bold"> E-mail <br /> Verification </h2>
                                <div className="flex justify-center mt-6">
                                    <HiMail className="text-9xl text-secondary " />
                                </div>
                                <p className="text-base p-2 font-bold font-outfit text-left mt-10"> Please enter your verification code </p>
                                <p className="text-base p-1 font-outfit text-left "> We have sent a verification to your registered email ID. </p>

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

                                    <div className="border-t-2 border-black my-3 w-full"></div>
                                </div>

                                <button
                                    type="button" onClick={handleOtpVerification}
                                    className="w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 font-outfit transition shadow-lg"
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
                            <IoArrowBackCircle className="text-secondary text-[2.5rem] mb-10" onClick={() => setStep(3)} />
                        </div>

                        <h2 className="text-2xl font-bold mt-3 mb-4 text-center font-outfit">Fill up</h2>

                        <div className="mb-4 w-80">
                            <label htmlFor="firstN" className="block mb-2 pl-1 text-sm font-medium font-outfit"> First Name </label>
                            <input
                                type="text" id="firstname" name="firstname"
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="lastN" className="block mb-2pl-1 text-sm font-medium font-outfit">Last Name</label>
                            <input
                                type="text" id="lastname" name="lastname"
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="phoneNo" className="block mb-2 pl-1 text-sm font-medium font-outfit">Phone Number</label>
                            <input
                                type="text" id="phoneNo" name="phoneNo"
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required />
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="date" className="block pl-1 mb-2 text-sm font-medium font-outfit">Date of Birth</label>
                            <input type="date" id="birthday" name="birthday"
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
                        </div>

                        <div className="mb-4 w-80">
                            <label htmlFor="gender" className="block mb-2 pl-1 text-sm font-medium font-outfit">Gender</label>
                            <select
                                id="gender" name="gender"
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                value={gender} onChange={(e) => setGender(e.target.value)} required
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex items-center w-80">
                            <input
                                type="checkbox" id="agree" className="mr-2"
                                checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                            <p className="font-outfit text-sm mb-4">
                                I agree and I have read and accepted Eventchuchu.
                                <span className="text-blue-500">Terms and Conditions</span> </p>
                        </div>
                        <button
                            type="submit" onClick={handleFinalSubmit} // Call handleFinalSubmit on click
                            className="w-80 bg-secondary text-white py-2 rounded-lg transition">
                            Continue </button>
                        <hr className=" mt-7 border-black w-85 h-2" />
                        <p className="text-grey font-outfit mt-5">Already have an account? <Link className="text-secondary" to={'/login'}>Sign in</Link></p>
                        {message && <p className="text-center text-sm mt-4 text-gray-600">{message}</p>}
                    </>
                )}
            </form>
        </div>
    );
}

export default Signup;
