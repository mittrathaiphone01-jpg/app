import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            role_id: number
        } & DefaultSession["user"];
        accessToken: string;
        error?: string;
        refreshToken?: string

    }

    interface User extends DefaultUser {
        // role: string;
        accessToken: string;
        refreshToken: string;
        // expiresIn: number;
        role_id: number
        accessTokenExpires : number
        
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: string;
        id: string;
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        error?: string;
        
    }
}