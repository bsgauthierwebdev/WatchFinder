import { useAuth } from './../../context/AuthContext';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./profile.css"

const Profile = () => {
    const {userData, refreshUserData} = useAuth()
    const fileInputRef = useRef(null)
    const user = userData?.user

    const [activeSection, setActiveSection] = useState("")
    const [username, setUsername] = useState(user?.username || "")
    const [email, setEmail] = useState(user?.email || "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [profileImg, setProfileImg] = useState(null)
    const [preview, setPreview] = useState(user?.profile_img ? `http://localhost:8800${user.profile_img}` : null)

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const clearMessages = () => {
        setError("")
        setSuccess("")
    }

    const handleChangeUsername = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await axios.put(
                "/api/users/update-username", 
                {username},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            setSuccess("Username updated successfully")
            refreshUserData()

            setTimeout(() => {
                clearMessages()
            }, 3000)
        } catch (err) {
            console.error("Update failed: ", err)
            setError(err.response?.data?.error || "Username update failed")

            setTimeout(() => {
                clearMessages()
            }, 3000)
        }
    }

    const handleChangeEmail = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await axios.put(
                "/api/users/update-email", 
                {email},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            setSuccess("Email updated successfully")
            refreshUserData()

            setTimeout(() => {
                clearMessages()
            }, 3000)
        } catch (err) {
            setError(err.response?.data?.error || "Email update failed")

            setTimeout(() => {
                clearMessages()
            }, 3000)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        clearMessages()

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            await axios.put(
                "/api/users/change-password", 
                {
                    currentPassword,
                    newPassword, 
                    confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            setSuccess("Password changed successfully")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")

            setTimeout(() => {
                clearMessages()
            }, 3000)
        } catch (err) {
            setError(err.response?.data?.error || "Password update failed")

            setTimeout(() => {
                clearMessages()
            }, 3000)
        }
    }

    const handleChangeProfileImg = async (e) => {
        e.preventDefault()
        clearMessages()

        if (!profileImg) {
            setError("Please select an image")
            return
        }

        const formData = new FormData()
        formData.append("profile_img", profileImg)

        try {
            await axios.put("/api/users/update-profile-pic", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            })
            setSuccess("Profile picture updated")
            refreshUserData()
        } catch (err) {
            setError(err.response?.data?.error || "Profile image update failed")

            setTimeout(() => {
                clearMessages()
            }, 3000)
        }
    }

    const handleImageChange = (e) => {
    const file = e.target.files[0]; 
        if (file) {
            setProfileImg(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setProfileImg(null);
            setPreview(user?.profile_img ? `http://localhost:8800${user.profile_img}` : null);
        }
    };

    const handleCancel = () => {
        setActiveSection("")
        clearMessages()

        setUsername(user.username || "")
        setEmail(user?.email || "")
        setPassword("")
        setConfirmPassword("")
        setProfileImg(null)
        setPreview(user?.profile_img ? `http://localhost:8800${user.profile_img}` : null)
    }

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    return (
        <div className="profile-container">
            <div className="profile-form__title">
                <h2 className="profile-header">Update Your Account</h2>
            </div>

            <div className="profile-actions">
                <button className = "action-button" onClick = {() => setActiveSection("username")}>Update Username</button>
                <button className = "action-button" onClick = {() => setActiveSection("email")}>Update Email</button>
                <button className = "action-button" onClick = {() => setActiveSection("password")}>Update Password</button>
                <button className = "action-button" onClick = {() => setActiveSection("profileImg")}>Update Profile Picture</button>
            </div>

            {activeSection === "username" && (
                <form className = "profile-form" onSubmit = {handleChangeUsername}>
                    <input 
                        type = "text" 
                        value = {username} 
                        onChange = {(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <button className = "update-btn" type = "submit">Update Username</button>
                    <button className="cancel-btn" type = "button" onClick = {handleCancel}>Cancel</button>
                </form>
            )}

            {activeSection === "email" && (
                <form className = "profile-form" onSubmit = {handleChangeEmail}>
                    <input 
                        type = "email" 
                        value = {email} 
                        onChange = {(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <button className = "update-btn" type = "submit">Update Email</button>
                    <button className="cancel-btn" type = "button" onClick = {handleCancel}>Cancel</button>
                </form>
            )}

            {activeSection === "password" && (
                <form className = "profile-form" onSubmit = {handleChangePassword}>
                    <input 
                        type = "password"
                        value = {currentPassword}
                        onChange = {(e) => setCurrentPassword(e.target.value)}
                        placeholder = "Current Password"
                        required
                    />
                    <input 
                        type = "password" 
                        value = {newPassword} 
                        onChange = {(e) => setNewPassword(e.target.value)} 
                        placeholder = "New Password"
                        required 
                    />
                    <input 
                        type = "password" 
                        value = {confirmPassword} 
                        onChange = {(e) => setConfirmPassword(e.target.value)} 
                        placeholder = "Confirm Password"
                        required 
                    />
                    <button className = "update-btn" type = "submit">Update Password</button>
                    <button className="cancel-btn" type = "button" onClick = {handleCancel}>Cancel</button>
                </form>
            )}

            {activeSection === "profileImg" && (
                <form className = "profile-form" onSubmit = {handleChangeProfileImg}>
                    <input 
                        type = "file" 
                        accept = "image/"
                        onChange = {handleImageChange} 
                        ref = {fileInputRef} 
                    />
                    {preview && (
                        <img 
                            src = {preview}
                            alt = "preview"
                            className = "profile-preview"
                        />
                    )}
                    <button className = "update-btn" type = "submit">Update Profile Picture</button>
                    <button className="cancel-btn" type = "button" onClick = {handleCancel}>Cancel</button>
                </form>
            )}

            <div className="profile-messages">
                {error && <p className = "error-message">{error}</p>}
                {success && <p className = "success-message">{success}</p>}
            </div>
        </div>
    )
}

export default Profile
