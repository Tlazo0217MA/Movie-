const { auth } = require('../config/firebaseConfig'); 


const verifyToken = async (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Unauthorized: No token provided or malformed header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    
    const decodedToken = await auth.verifyIdToken(idToken);
    
    
    req.user = decodedToken;
    
    
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    
    
    return res.status(403).send({ error: 'Unauthorized: Invalid or expired token.' });
  }
};

module.exports = verifyToken;