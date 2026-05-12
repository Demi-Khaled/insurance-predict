const jwt = require('jsonwebtoken');
const { prisma } = require('../db');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, googleId: true, profilePicture: true, age: true, skinType: true, medicalConditions: true, createdAt: true, isDarkMode: true, tokenVersion: true } // Exclude password explicitly since Prisma doesn't have a `.select('-password')` equivalent
      });
      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({ message: 'Session expired or invalid' });
      }
      
      req.user = user;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
