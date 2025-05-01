const axios = require('axios');
const User = require('../models/User');
const { generateToken } = require('../utils/authUtils');

// OAuth configuration
const GOOGLE_CLIENT_ID = '1054092785433-3f17gajhmrg1jp0lp11cnqunmgd98k2p.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://localhost:8080/auth/google/callback';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'http://localhost:8080/auth/github/callback';

// Helper function to split name into first and last name
const splitName = (fullName) => {
  const parts = fullName.split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ') || firstName;
  return { firstName, lastName };
};

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.body;
    console.log('Received Google auth request:', {
      hasCode: !!code,
      redirectUri: GOOGLE_REDIRECT_URI,
      timestamp: new Date().toISOString()
    });

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;
    console.log('Successfully obtained access token');

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, picture } = userInfoResponse.data;
    console.log('Retrieved user info:', { email, name });

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      const { firstName, lastName } = splitName(name);
      user = await User.create({
        email,
        firstName,
        lastName,
        profilePicture: picture,
        isVerified: true,
        authProvider: 'google'
      });
      console.log('Created new user:', user.email);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message
    });
  }
};

// GitHub OAuth callback
exports.githubCallback = async (req, res) => {
  try {
    const { code } = req.body;
    console.log('Received GitHub auth request:', {
      hasCode: !!code,
      redirectUri: GITHUB_REDIRECT_URI,
      timestamp: new Date().toISOString()
    });

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      code,
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      redirect_uri: GITHUB_REDIRECT_URI
    }, {
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const { access_token } = tokenResponse.data;
    console.log('Successfully obtained GitHub access token');

    // Get user info from GitHub
    const userInfoResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, avatar_url } = userInfoResponse.data;
    console.log('Retrieved GitHub user info:', { email, name });

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      const { firstName, lastName } = splitName(name);
      user = await User.create({
        email,
        firstName,
        lastName,
        profilePicture: avatar_url,
        isVerified: true,
        authProvider: 'github'
      });
      console.log('Created new GitHub user:', user.email);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('GitHub OAuth error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message
    });
  }
}; 