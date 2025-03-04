
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const authMiddleware= {
    protect: async (req, res, next) => {
        try {
          let token;
          
          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
              throw new Error('User not found');
            }
            
            next();
          } else {
            throw new Error('No token provided');
          }
        } catch (error) {
          res.status(401).json({ message: 'Not authorized: ' + error.message });
        }
      }

    
};

