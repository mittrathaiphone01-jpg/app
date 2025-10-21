import { handleLogout } from "@/lib/utils";
import axios, { AxiosError, AxiosInstance } from "axios";
import { getSession, signIn } from "next-auth/react";

export const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API || "",
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000 // 10 วินาที
})



// Interceptor สำหรับการส่ง Request (เพิ่ม Token เข้าไปใน Header)
api.interceptors.request.use(async (config) => {
    const session = await getSession();
    const token = session?.accessToken;

    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Interceptor สำหรับการรับ Response (ตรวจสอบ Token ที่หมดอายุ)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // เงื่อนไข: ถ้า Error เป็น 401 (Unauthorized) และยังไม่เคยลอง Retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // ตั้งค่า Flag เพื่อป้องกัน Infinite Loop

            try {
                // ดึง Session ใหม่ ซึ่งจะไปเรียก refreshAccessToken()
                const session = await getSession();

                // ตรวจสอบว่ามี error จากการ refresh token หรือไม่
                if (session?.error === 'RefreshAccessTokenError') {
                    console.log("Refresh token failed, redirecting to sign-in.");
                    signIn(); // พาผู้ใช้ไปหน้า Login
                    return Promise.reject(error);
                }

                // ถ้าได้ Token ใหม่มาแล้ว
                if (session?.accessToken) {
                    // อัปเดต Authorization Header ของ Request เดิม
                    originalRequest.headers["Authorization"] = `Bearer ${session.accessToken}`;
                    // ลองส่ง Request เดิมอีกครั้ง
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Error while refreshing token:", refreshError);
                signIn();
                return Promise.reject(refreshError);
            }
        }

        // สำหรับ Error อื่นๆ ที่ไม่ใช่ 401
        return Promise.reject(error);
    }
);

export const handleAxiosError = async (error: unknown): Promise<string> => {

    console.log(error);
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError

        if (err.response) {
            const data = err.response.data as { message?: string, error?: string }
            console.log({ handleAxiosError: data }); // ได้ error:  "ข้อมูลซ้ำ หรือ ส่งค่าว่างมา"

            return (data.message  ||  data.error || 'ไม่สามารถทำรายการได้')
            // return 'ไม่สามารถทำรายการได้ !'
        } else if (err.request) {
            return 'ไม่สามารถเชื่อมต่อ server ได้';
        } else {
            return err.message;
        }
    } else {
        return 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ';
    }
}

export const apiForm: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API || "",
    timeout: 10000,
})

apiForm.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.accessToken;

  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});