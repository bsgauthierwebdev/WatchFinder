import { useRef, useState } from "react"
import { useAuth } from "../../../context/AuthContext"
import axios from "axios"
import "./dashboardUserCard.css"

const DashboardUserCard = () => {
    const {userData, refreshUserData} = useAuth()
    const fileInputRef = useRef(null)

    const user = userData.user

    const [formState, setFormState] = useState({
        username: userData?.user?.username || "",
        email: userData?.user?.email || "",
        password: "",
        confirmPassword: "",
        profile_img: null
    })

    const [previewImg, setPreviewImg] = useState(
        user?.profile_img ? `http://localhost:8800${user.profile_img}` : null
    )

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState (null)

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormState(prev => ({...prev, [name]: value}))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormState(prev => ({...prev, profile_img: file}))
            setPreviewImg(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (formState.password && formState.password !== formState.confirmPassword) {
            return setError("Passwords do not match")
        }

        try {
            const formData = new FormData()
            formData.append("username", formState.username)
            formData.append("email", formState.email)
            if (formState.password) {
                formData.append("password", formState.password)
            }
            if (formState.profile_img) {
                formData.append("profile_img", formState.profile_img)
            } 

            const response = await axios.put(
                `http://localhost:8800/api/users/${user.user_id}`,
                formData,
                {headers: {"Content-Type": "multipart/form-data"}}
            )

            if (response.status === 200) {
                setSuccess("Profile updated successfully")
                setFormState(prev => ({
                    ...prev,
                    password: "",
                    confirmPassword: "",
                    profile_img: null
                }))
                setPreviewImg(user?.profile_img ? `http://localhost:8800${user.profile_img}` : null)
                if (typeof refreshUserData === "function") {
                    refreshUserData()
                }
            }

        } catch (err) {
            console.error("Update failed: ", err)
            setError("Something went wrong while updating profile")
        }
    }
  return (
    <div className="dashboard-usercard__container">
        <h2 className="usercard__header">Update Account Settings</h2>
        <form className="usercard__form" onSubmit = {handleSubmit}>
            <div className="usercard__inputs">
                <div className="usercard__text-inputs">
                    <div className="username-email-input">
                        <div className="form-group">
                            <label htmlFor="username">Update Username</label>
                            <input 
                                type="text"
                                name = "username"
                                value = {formState.username} 
                                className="username-input" 
                                onChange = {handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Update Email</label>
                            <input 
                                type="email"
                                name = "email"
                                value = {formState.email} 
                                className="email-input" 
                                onChange = {handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="password-input">
                        <div className="form-group">
                            <label htmlFor="password">Update Password</label>
                            <input 
                                type="password"
                                name = "password"
                                value = {formState.password} 
                                className="password-input" 
                                onChange = {handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                type="password"
                                name = "confirmPassword"
                                value = {formState.confirmPassword} 
                                className="confirm-password-input" 
                                onChange = {handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="usercard__img-inputs">
                    <div className="image-upload">
                        <div className="form-group">
                            <label htmlFor="profile-img">Update Profile Picture</label>
                            <input 
                                type="file"
                                accept="image/*"
                                name = "profileImg"
                                className="profile-img-input" 
                                onChange = {handleImageChange}
                                ref={fileInputRef}
                            />
                        </div>
                    </div>
                    <div className="image-preview">
                        <div className="form-group">
                            {
                                previewImg && 
                                    <img 
                                        src = {previewImg || defaultProfileImg} 
                                        alt = "Preview" 
                                        className = "profile-img-preview" 
                                        onClick = {() => fileInputRef.current.click()}
                                        style = {{cursor: "pointer"}}
                                    />
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="usercard__alerts">
                {error && <p className = "form-error">{error}</p>}
                {success && <p className = "form-success">{success}</p>}
            </div>
            
            <div className="usercard__btn">
                <button className="usercard__submit" type = "submit">Save Changes</button>
            </div>
            
        </form>
    </div>
  )
}

export default DashboardUserCard
