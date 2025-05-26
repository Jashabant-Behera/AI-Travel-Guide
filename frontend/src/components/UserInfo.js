"use client";
import "../styles/userinfo.css";
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCheck, faShieldAlt, faUser, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import api from "../utils/api";
import Link from "next/link";

const PROFILE_PICTURES = [
  "/profiles/avatar1.png",
  "/profiles/avatar2.png",
  "/profiles/avatar3.png",
  "/profiles/avatar4.png",
  "/profiles/avatar5.png",
  "/profiles/avatar6.png",
];

const BANNER_IMAGES = [
  "/banners/banner1.jpg",
  "/banners/banner2.jpg",
  "/banners/banner3.jpg",
  "/banners/banner4.jpg",
  "/banners/banner5.jpg",
];

const UserInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userData, setUserData } = useContext(AppContext);
  const [editMode, setEditMode] = useState({
    name: false,
    gender: false,
    location: false,
  });
  const [formValues, setFormValues] = useState({
    name: "",
    gender: "",
    location: "",
  });

  const [bannerImage, setBannerImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [showBannerSelector, setShowBannerSelector] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    console.log("Current userData:", userData);
    if (userData) {
      setFormValues({
        name: userData.name || "",
        gender: userData.gender || "",
        location: userData.userLocation || "",
      });
      setProfileImage(userData.profileImage || "/profiles/avatar1.png");
      setBannerImage(userData.bannerImage || "/banners/banner1.jpg");
      setIsLoading(false);
    }
  }, [userData]);

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSave = async (field) => {
    try {
      setIsUpdating(true);
      const payload =
        field === "location"
          ? { userLocation: formValues.location }
          : { [field]: formValues[field] };

      const { data } = await api.put("/api/user/update", payload);

      if (data?.success) {
        toast.success("Profile updated successfully");
        const updatedUserData = {
          ...userData,
          ...(field === "location"
            ? { userLocation: formValues.location }
            : { [field]: formValues[field] }),
        };
        setUserData(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        setEditMode({ ...editMode, [field]: false });
      } else {
        throw new Error(data?.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const selectProfilePicture = async (img) => {
    try {
      setIsUpdating(true);
      const { data } = await api.put("/api/user/update", {
        profileImage: img,
      });

      if (data?.success) {
        toast.success("Profile picture updated");
        setProfileImage(img);
        const updatedUser = { ...userData, profileImage: img };
        setUserData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setShowProfileSelector(false);
      } else {
        throw new Error(data?.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const selectBannerImage = async (img) => {
    try {
      setIsUpdating(true);
      const { data } = await api.put("/api/user/update", {
        bannerImage: img,
      });

      if (data?.success) {
        toast.success("Banner image updated");
        setBannerImage(img);
        const updatedUser = { ...userData, bannerImage: img };
        setUserData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setShowBannerSelector(false);
      } else {
        throw new Error(data?.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="user-info-container">
      {isUpdating && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {showProfileSelector && (
        <div className="image-selector-modal">
          <div className="image-selector-content">
            <div className="modal-header">
              <h3>Choose a Profile Picture</h3>
              <button
                onClick={() => setShowProfileSelector(false)}
                className="close-btn"
                disabled={isUpdating}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="image-grid">
              {PROFILE_PICTURES.map((img, index) => (
                <div
                  key={index}
                  className={`image-option ${profileImage === img ? "selected" : ""}`}
                  onClick={() => !isUpdating && selectProfilePicture(img)}
                >
                  <Image
                    src={img}
                    alt={`Profile ${index + 1}`}
                    width={100}
                    height={100}
                    className="selector-img"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showBannerSelector && (
        <div className="image-selector-modal">
          <div className="image-selector-content">
            <div className="modal-header">
              <h3>Choose a Banner</h3>
              <button
                onClick={() => setShowBannerSelector(false)}
                className="close-btn"
                disabled={isUpdating}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="image-grid">
              {BANNER_IMAGES.map((img, index) => (
                <div
                  key={index}
                  className={`image-option ${bannerImage === img ? "selected" : ""}`}
                  onClick={() => !isUpdating && selectBannerImage(img)}
                >
                  <Image
                    src={img}
                    alt={`Banner ${index + 1}`}
                    width={200}
                    height={100}
                    className="selector-img"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="banner-profile-container">
        <div className="banner-section">
          <Image
            src={bannerImage}
            alt="Banner"
            fill
            className="banner-img"
            priority
            onError={(e) => {
              e.target.src = "/banners/banner1.jpg";
              setBannerImage("/banners/banner1.jpg");
            }}
          />
          <div className="banner-corner-effect"></div>
          <div className="penoverlay" onClick={() => !isUpdating && setShowBannerSelector(true)}>
            <FontAwesomeIcon icon={faPen} className="penicon" />
          </div>
        </div>

        <div className="profile-img-wrapper">
          <Image
            src={profileImage}
            alt="Profile"
            width={160}
            height={160}
            className="profile-img"
            onError={(e) => {
              e.target.src = "/profiles/avatar1.png";
              setProfileImage("/profiles/avatar1.png");
            }}
          />
          <div className="profile-corner-effect"></div>
          <div className="edit-overlay" onClick={() => !isUpdating && setShowProfileSelector(true)}>
            <FontAwesomeIcon icon={faPen} className="edit-icon" />
          </div>
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
                  <button
                    onClick={() => handleSave(field)}
                    className="save-btn"
                    disabled={isUpdating}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              ) : (
                <div className="view-group">
                  <span className="readonly-text">
                    {field === "location"
                      ? userData.userLocation || "Not specified"
                      : userData[field] || "Not specified"}
                  </span>
                  <button
                    className="edit-btn"
                    onClick={() => setEditMode({ ...editMode, [field]: true })}
                    disabled={isUpdating}
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
              Feeling like your password's been around since dial-up? Time to upgrade your digital
              fortress.
            </p>
            <div className="security-btn-container">
              <Link href="/reset" className="security-btn">
                Change Password
              </Link>
            </div>
          </div>

          <div className="security-option">
            <h3>Email Verification</h3>
            {userData?.isAccountVerified ? (
              <p>Your email is verified and good to go.</p>
            ) : (
              <>
                <p>Let's lock in your email and make things official.</p>
                <div className="security-btn-container">
                  <Link href="/emailVerify" className="security-btn">
                    Verify Email
                  </Link>
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
