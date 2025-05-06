"use client";
import "../styles/userinfo.css";
import React, { useContext, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCheck, faShieldAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import ResetPassword from "./ResetPassword";
import EmailVerify from "./VerifyEmail";
import { toast } from "react-toastify";
import api from "../utils/api";

const UserInfo = () => {
  const { userData } = useContext(AppContext);
  const [editMode, setEditMode] = useState({
    name: false,
    gender: false,
    location: false,
  });
  const [formValues, setFormValues] = useState({
    name: userData.name,
    gender: userData.gender || "",
    location: userData.userLocation || "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [bannerImage, setBannerImage] = useState("/banner.jpg");
  const [profileImage, setProfileImage] = useState("/avatar.png");
  const bannerInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSave = (field) => {
    setEditMode({ ...editMode, [field]: false });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      if (type === "banner") setBannerImage(newUrl);
      else setProfileImage(newUrl);
    }
  };

  const triggerFileInput = (ref) => {
    ref.current.click();
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const timerInterval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyOTP = async () => {
    try {
      const { data } = await api.post(`/api/auth/verifyOTP`);
      if (data.success) {
        toast.success(data.message);
        startResendTimer();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="user-info-container">
      <div className="banner-profile-container">
        <div className="banner-section">
          <Image src={bannerImage} alt="Banner" fill className="banner-img" priority />
          <div className="banner-corner-effect"></div>
          <div className="penoverlay" onClick={() => triggerFileInput(bannerInputRef)}>
            <FontAwesomeIcon icon={faPen} className="penicon" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={bannerInputRef}
            onChange={(e) => handleImageChange(e, "banner")}
            className="hidden-input"
          />
        </div>

        <div className="profile-img-wrapper">
          <Image
            src={profileImage}
            alt="Profile"
            width={160}
            height={160}
            className="profile-img"
          />
          <div className="profile-corner-effect"></div>
          <div className="edit-overlay" onClick={() => triggerFileInput(profileInputRef)}>
            <FontAwesomeIcon icon={faPen} className="edit-icon" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            onChange={(e) => handleImageChange(e, "profile")}
            className="hidden-input"
          />
        </div>
      </div>

      <div className="user-basic-info">
        <h2>{formValues.name}</h2>
        <p>{userData.email}</p>
        <small>➤ {formValues.location || "Unknown Location"}</small>
      </div>

      <div className="profile-info-section">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faUser} /> Profile Info
        </h3>
        <div className="editable-form">
          {["name", "gender", "location"].map((field) => (
            <div className="editable-field" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {editMode[field] ? (
                <div className="edit-group">
                  {field === "gender" ? (
                    <div className="gender-radio-group">
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formValues.gender === "Male"}
                          onChange={handleInputChange}
                          className="gender-radio"
                        />
                        Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formValues.gender === "Female"}
                          onChange={handleInputChange}
                          className="gender-radio"
                        />
                        Female
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Others"
                          checked={formValues.gender === "Others"}
                          onChange={handleInputChange}
                          className="gender-radio"
                        />
                        Others
                      </label>
                    </div>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={formValues[field]}
                      onChange={handleInputChange}
                      className="editable-input"
                    />
                  )}
                  <button onClick={() => handleSave(field)} className="save-btn">
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              ) : (
                <div className="view-group">
                  <span className="readonly-text">{formValues[field] || "Not specified"}</span>
                  <button
                    className="edit-btn"
                    onClick={() => setEditMode({ ...editMode, [field]: true })}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="editable-field">
            <label>Email</label>
            <span className="readonly-text">{userData.email}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="section-title">
          <FontAwesomeIcon icon={faShieldAlt} /> Security
        </h3>
        <div className="security-section">
          <div className="security-option">
            <h3>Need a Fresh Password?</h3>
            <p>
              Feeling like your password’s been around since dial-up? Time to upgrade your digital
              fortress.
            </p>
            {showPasswordForm && <ResetPassword />}
            {!showPasswordForm ? (
              <button onClick={() => setShowPasswordForm(true)} className="security-btn">
                Change Password
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="security-btn cancel-btn"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="security-option">
            <h3>Email Verification</h3>
            {userData?.isVerified ? (
              <p>Your email is verified and good to go.</p>
            ) : (
              <>
                <p>Let's lock in your email and make things official.</p>
                <div className="security-btn-container">
                  {showVerifyForm && <EmailVerify />}
                  {!showVerifyForm ? (
                    <button
                      onClick={() => {
                        verifyOTP();
                        setShowVerifyForm(true);
                      }}
                      className={`security-btn ${resendTimer > 0 ? "disabled" : ""}`}
                      disabled={resendTimer > 0}
                    >
                      Verify Email
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          verifyOTP();
                          startResendTimer();
                        }}
                        className={`verify-btn ${resendTimer > 0 ? "disabled" : ""}`}
                        disabled={resendTimer > 0}
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                      </button>
                      <button
                        onClick={() => {
                          setShowVerifyForm(false);
                        }}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
