import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Token } from '../model/Token';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({
      status: false,
      message:'Access denied. No token provided.'});
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');

    // Check if decoded is a JwtPayload
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      return res.status(400).send({
        status: false,
        message:'Invalid token.'});
    }

    const userId = Number((decoded as JwtPayload).userId);

    const tokenRepository = getRepository(Token);
    const storedToken = await tokenRepository.findOne({ where: { token, userId } });

    if (!storedToken || storedToken.revokedAt) {
      return res.status(401).send({
        status: false,
        message:'Invalid or revoked token.'});
    }
    next();
  } catch (ex) {
    res.status(400).send({
      status: false,
      message:'Invalid token.'});
  }
};

export { verifyToken };
