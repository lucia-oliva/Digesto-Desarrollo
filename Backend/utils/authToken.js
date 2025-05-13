import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const generateAccessToken = (user) => {
    return jwt.sign({ user }, ACCESS_SECRET, { expiresIn: '15m' });
};


export const generateRefreshToken = (user) => {
    return jwt.sign({ user }, REFRESH_SECRET, { expiresIn: '7d' });
};


export const verifyAccessToken = (token) => {
    try{
    return jwt.verify(token, ACCESS_SECRET);
    }catch(err){
        throw new Error('Token inválido');
    }
};

export const verifyRefreshToken = (token) => {
    try{
    return jwt.verify(token, REFRESH_SECRET);
    }catch(err){
        throw new Error('Token inválido');
    }
};