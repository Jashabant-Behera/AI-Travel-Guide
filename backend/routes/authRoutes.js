import express from 'express';
import {
    isAuthenticated,
    login,
    logout,
    resetOTP,
    resetPassword,
    sendOTP,
    signup,
    verifyEmail,
    getUserData,
    verifySession
  } from "../controllers/authController.js";
import verifyToken from '../middleware/authMiddleware.js';

  const router = express.Router();

  router.post("/signup", signup);
  router.post("/login", login);
  router.post("/logout", logout);

  router.post("/verifyOTP", verifyToken, sendOTP);
  router.post("/verifyAccount", verifyToken, verifyEmail);

  router.get("/isAuth", verifyToken, isAuthenticated);

  router.post("/resetOTP", resetOTP);
  router.post("/resetPassword", resetPassword);

  router.get("/data", verifyToken, getUserData);
  router.get('/verify-session', verifyToken, verifySession);
  
  export default router;