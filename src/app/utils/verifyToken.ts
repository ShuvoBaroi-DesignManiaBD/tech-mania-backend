import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { Request } from "express";
import { verifyToken } from "../module/Auth/auth.utils";

const decodeToken = (req: Request) => {
    let accessToken = req.headers?.accesstoken;
    const refreshToken = req.cookies?.refreshToken || req.headers?.refreshToken;
    // console.log(accessToken, '/----/', refreshToken);
    // checking if the token is missing
    if (!accessToken && !refreshToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    } else if (!accessToken && refreshToken) {
      const decodedFromRefreshToken = verifyToken(
        refreshToken,
        config.jwt_refresh_key
      );

      return decodedFromRefreshToken;
    } else if (accessToken) {
      // console.log('line 47',refreshToken);
      let decoded;
      // checking if the given token is valid
      try {
        decoded = jwt.verify(
          accessToken as string,
          config.jwt_access_key as string
        ) as JwtPayload;
        // console.log('line 55',accessToken);
      } catch (error) {
        console.log(error);
        
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized !")
      }

      return decoded;
      
    }
};

export default decodeToken;