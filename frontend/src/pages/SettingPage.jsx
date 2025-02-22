import React, { useState, useEffect } from "react";
import './SettingPage.css'; 
import Notification from '../components/Notification';
import axios from 'axios'; 
import config from '../api/config';

function SettingPage() {
    const [userDetails, setUserDetails] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [newAvatar, setNewAvatar] = useState(null); // Store new image file for upload check
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            const response = await axios.get(`${config.apiUrl}/auth/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsAuthenticated(true);
            setUserDetails(response.data);
            setName(response.data.name);
            setAvatar(response.data.profileImage);

        } catch (error) {
            console.error('Error fetching user details:', error);
            setIsAuthenticated(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result); // Show preview
                setNewAvatar(file); // Store for upload check
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCloudinaryUpload = async (imageFile) => {
        try {
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("upload_preset", "post_preset"); // Replace with your Cloudinary preset

            const response = await fetch("https://api.cloudinary.com/v1_1/dzjwb2bng/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!data.secure_url) throw new Error("Image upload failed");

            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            throw error;
        }
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            let imageUrl = avatar;

            // Upload to Cloudinary only if a new image is selected
            if (newAvatar) {
                imageUrl = await handleCloudinaryUpload(newAvatar);
            }

            const token = localStorage.getItem('token');
            await axios.put(`${config.apiUrl}/auth/user/update-setting`, 
                { name, profileImage: imageUrl }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchUserDetails();
            setNewAvatar(null);
            setNotification({
                show: true,
                message: 'Profile updated successfully!',
                type: 'success'
              });
        } catch (error) {
            console.error("Error updating user details:", error);
        }
        setLoading(false);
    };

    return (
        <div className="settings-container-page-x3">
            <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
            <h2 className="settings-title">Profile Settings</h2>
            <p className="settings-subtitle">Manage your profile settings and preferences</p>
            
            <div className="settings-card">
                <div className="avatar-43-section-sett6">
                    <img src={avatar || "default-avatar-url"} alt="avatar" className="avatar-43" />
                    <div className='settings-car-ds34'>
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden id="fileInput" />
                        <button className="change-avatar-43-btn" onClick={() => document.getElementById('fileInput').click()}>Change avatar</button>
                        <p className="avatar-43-info">Recommended size: 400x400px. Max size: 2MB. Supports PNG, JPG, JPEG, or WebP.</p>
                    </div>
                </div>
                
                <div className="input-section">
                    <label className="input-label">Name</label>
                    <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                
                <button className="save-btn-setting-btn3" onClick={handleSaveChanges} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

export default SettingPage;
