const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const verifyAsync = promisify(jwt.verify);

const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }


  

  const [scheme, token] = authorizationHeader.split(' ');

  if (!token || !scheme) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
  }

  try {
    // Verify the JWT using the secret key from environment variables
    const decodedToken = await verifyAsync(token, process.env.SECRET_KEY);
    //console.log('Decoded Token:', decodedToken);

    req.userId = decodedToken.userId; // Attach the user ID to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = { verifyToken };
