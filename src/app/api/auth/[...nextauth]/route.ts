import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import jwt from "jsonwebtoken";


import CredentialsProvider from "next-auth/providers/credentials";
import { handleLogout } from "@/lib/utils";
import { getSession } from "next-auth/react";


async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        console.log("Attempting to refresh access token...");

        const apiUrl = `${process.env.NEXT_PUBLIC_API}/auth/v1/refresh`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh_token: token.refreshToken,
            }),
        });

        // **แก้ไข:** ตรวจสอบว่า response สำเร็จหรือไม่
        if (response.ok) {
            const refreshedTokens = await response.json();
            const decoded = jwt.decode(refreshedTokens.access_token) as { exp?: number };
            console.log("Access token refreshed successfully.");

            console.log({REFACE :refreshedTokens });
            
            return {
                ...token,
                accessToken: refreshedTokens.access_token,
                // accessTokenExpires: Date.now() + 60 * 1000,
                accessTokenExpires: decoded.exp ? decoded.exp * 1000 : Date.now() + 60 * 1000,
                refreshToken: refreshedTokens.refresh_token,
                error: undefined, // ล้าง error เก่าทิ้ง
            };
        }
        console.error("Failed to refresh access token. Status:", response.status);

        const decoded = jwt.decode(token.accessToken) as { user_id?: number };
        console.log({ 111: decoded.user_id });
        if (response.status === 401) {
            const decoded = jwt.decode(token.accessToken) as { user_id?: number };
            await handleLogout(Number(decoded?.user_id));
            return {
                ...token,
                error: "RefreshAccessTokenError 111",
            };
        }

        return {
            ...token,
            error: "RefreshAccessTokenError 222",
        };
    } catch (error) {
        console.error("Error in refreshAccessToken function:", error);
        // กรณีเกิด Network error หรืออื่นๆ
        const decoded = jwt.decode(token.accessToken) as { user_id?: number };
        await handleLogout(Number(decoded.user_id))
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            // ฟังก์ชันนี้จะถูกเรียกเมื่อมีการ signIn
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/${process.env.NEXT_PUBLIC_V}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });

                    if (res.ok) {
                        console.log("User authorized successfully:");


                        const userFromApi = await res.json();
                        const token = userFromApi.access_token
                        const decoded = jwt.decode(token) as { user_id?: string, exp: number, [key: string]: any };
                        console.log({LOGIN : userFromApi});
                        
                        return {
                            id: decoded.user_id!,
                            name: decoded.username,
                            role_id: userFromApi.role_id,
                            accessToken: userFromApi.access_token,
                            refreshToken: userFromApi.refresh_token,
                            accessTokenExpires: decoded.exp ? decoded.exp * 1000 : 60 * 1000,
                        };
                    }



                    // if (credentials?.username === 'aaa' && credentials?.password === "aaa") {
                    //     console.log("User authorized successfully:");

                    //     return {
                    //         id: "10",
                    //         name: "test",
                    //         role_id: 1,
                    //         accessToken: "111111",
                    //         refreshToken:"222222",
                    //         accessTokenExpires:  60 * 1000,
                    //     };
                    // }


                    return null;

                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // 1. ครั้งแรกที่ Login (object `user` จะถูกส่งมา)
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = user.accessTokenExpires as number;
                token.role_id = user.role_id;
                token.id = user.id;
                return token;
            }

            // 2. ครั้งต่อๆ ไปที่เข้ามา (เช็ค session)
            // ตรวจสอบว่า Access Token หมดอายุหรือยัง
            if (Date.now() < (token.accessTokenExpires as number)) {
                // ถ้ายังไม่หมดอายุ ก็คืนค่า token เดิม
                return token;
            }

            // 3. ถ้า Access Token หมดอายุแล้ว ให้เรียกฟังก์ชัน refresh
            console.log("refreshing.............");
            const refreshedToken = await refreshAccessToken(token);
            return refreshedToken
        },

        async session({ session, token }) {
            // ส่งข้อมูลจาก token ไปที่ session
            if (token) {
                session.user.id = token.id as string;
                session.user.role_id = token.role_id as number;
                session.accessToken = token.accessToken as string;
                session.refreshToken = token.refreshToken as string;
                session.error = token.error as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/sign-in', 
    },
    session: {
        strategy: "jwt", 
    },
    secret: process.env.NEXTAUTH_SECRET, 
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
