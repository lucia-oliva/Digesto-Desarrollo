import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const generateAccessToken = ({
  id, roles = [], dependenciaId = null,}) =>
  jwt.sign({sub: String(id),roles,dependenciaId,},
    ACCESS_SECRET,{ expiresIn: "15m" },);

export const generateRefreshToken = ({ id }) =>
  jwt.sign({sub: String(id),},REFRESH_SECRET,
    { expiresIn: "7d" },);

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
