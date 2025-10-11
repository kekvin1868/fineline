import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const AUTHENTIK_URL = process.env.AUTHENTIK_URL;
const AUTHENTIK_SECRET_KEY = process.env.AUTHENTIK_SECRET_KEY;
const CLIENT_ID = process.env.AUTHENTIK_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTHENTIK_CLIENT_SECRET;
const AUTHENTIK_API_TOKEN = process.env.AUTHENTIK_API_TOKEN;
const AUTHENTIK_REDIRECT_URI = process.env.AUTHENTIK_REDIRECT_URI;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3001';

// Generate JWT
const generateToken = (id) => {
  if (!AUTHENTIK_SECRET_KEY) {
    throw new Error('Configuration is undefined or not configured.');
  }

  return jwt.sign({ userId: id }, AUTHENTIK_SECRET_KEY, {
    expiresIn: '7d',
  });
};

// COOKIE HELPER

// --- Set Auth Cookies --- //
const setAuthCookies = (res, token) => {
  res.cookie('appToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

// --- Clear Auth Cookies --- //
const clearAuthCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  };

  res.clearCookie('appToken', cookieOptions);
  res.clearCookie('authentik_token', cookieOptions);
  res.clearCookie('authentikRefreshToken', cookieOptions);
  res.clearCookie('oauth_state', cookieOptions);
  res.clearCookie('id_token', cookieOptions);
}

// --- Session Validation --- //
router.get('/me', protect, async (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username } });
});

// --- Initiate Authentik Login Redirect --- //
router.get('/login', (req, res) => {
  const state = Math.random().toString(36).substring(2, 15);

  const authParams = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: AUTHENTIK_REDIRECT_URI,
    scope: 'openid profile email',
    state: Math.random().toString(36).substring(2, 15) // CSRF protection
  });

  // Store state in cookie for verification
  res.cookie('oauth_state', authParams.get('state'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000 // 10 minutes
  });

  const authURL = `${AUTHENTIK_URL}/application/o/authorize/?${authParams.toString()}`;
  
  console.log('Redirecting to Authentik:', authURL);
  
  // Redirect user to Authentik login page
  res.redirect(authURL);
});

// --- HANDLE CALLBACK (Authorization Code Flow) --- //
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return res.status(400).json({ error: 'Authentication failed', details: error });
  }

  // Verify state parameter (CSRF protection)
  const storedState = req.cookies.oauth_state;
  if (!state || state !== storedState) {
    console.error('State mismatch:', { received: state, expected: storedState });
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  // Clear the state from session
  res.clearCookie('oauth_state');

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not received' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      `${AUTHENTIK_URL}/application/o/token/`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: AUTHENTIK_REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log("Token from Authentik: ", tokenResponse.data);

    const { access_token, refresh_token, id_token } = tokenResponse.data;

    // Get user information from Authentik
    const userInfoResponse = await axios.get(`${AUTHENTIK_URL}/application/o/userinfo/`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userInfoResponse.data;
    const username = userInfo.preferred_username || userInfo.username;

    console.log('User info from Authentik:', userInfo);

    // Find or create the user in the local database
    let user = await User.findOne({ where: { username } });
    if (!user) {
      user = await User.create({ username });
    }

    // Generate & Set App Token Cookie
    const token = generateToken(user.id);
    console.log('Generated JWT:', token);
    setAuthCookies(res, token);

    // Store the Authentik access token
    res.cookie('authentik_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('id_token', id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Optionally store refresh token
    if (refresh_token) {
      res.cookie('authentikRefreshToken', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    // Redirect to dashboard
    console.log('Redirecting to:', `${FRONTEND_BASE_URL}/dashboard`);
    res.redirect(`${FRONTEND_BASE_URL}/dashboard`);
  } catch (err) {
    console.error('Error during token exchange:', err.response?.data || err.message);

    if (err.response) {
      console.log('Authentik token error status:', err.response.status);
      console.log('Authentik token error details:', err.response.data);
    }

    res.status(500).json({ 
      error: 'Authentication failed', 
      details: err.response?.data || err.message 
    });
  }
});

// --- LOGOUT --- //
// router.post('/logout', (req, res) => {
//   clearAuthCookies(res);
  
//   const postLogoutRedirect = `${FRONTEND_BASE_URL}/login`;
  
//   // Raw URL for invalidation flow
//   const logoutUrl = `${AUTHENTIK_URL}/api/v3/flows/executor/default-invalidation-flow/?next=${encodeURIComponent(postLogoutRedirect)}`;
  
//   console.log('Invalidation flow URL:', logoutUrl);

//   res.status(200).json({ 
//     message: 'Local session cleared. Redirecting to Authentik logout.',
//     endSessionUrl: logoutUrl
//   });
// });


// OPTION 2: Authentik End-Session
router.post('/logout', (req, res) => {
  clearAuthCookies(res);

  const currentIdToken = req.cookies.id_token || ''
  const postLogoutRedirect = `${FRONTEND_BASE_URL}/login`;;
  
  const endSessionParams = new URLSearchParams({
    id_token_hint: currentIdToken,
    post_logout_redirect_uri: postLogoutRedirect,
  });

  const endSessionUrl = `${AUTHENTIK_URL}/application/o/fineline/end-session/?${endSessionParams.toString()}`;
  console.log('End-session URL:', endSessionUrl); // Debug

  res.status(200).json({ 
    message: 'Local session cleared. Redirecting to Authentik logout.',
    endSessionUrl 
  });
});

export default router;
