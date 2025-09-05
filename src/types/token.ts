import type { UserInfo } from "../lib/types";





export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
    user: UserInfo;
}