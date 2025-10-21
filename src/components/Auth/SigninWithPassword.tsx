"use client";
import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { handleAxiosError } from "@/utils/api";
import { toast } from "react-toastify";

export default function SigninWithPassword() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false, // ตั้งเป็น false เพื่อจัดการเอง
        username,
        password,
      });

      console.log({ result });

      if (result?.error) {
        setError('Invalid email or password');
        console.log(result.error);
        setUsername("")
        setPassword("")
        toast.error('เข้าสู่ระบบไม่สำเร็จ')
      } else if (result?.ok) {
        router.refresh()
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      setUsername("")
      setPassword("")
      console.log('Sign in error:', error);
      toast.error('เข้าสู่ระบบไม่สำเร็จ')
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="text"
        label="ชื่อผู้ใช้งาน"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="กรอกชื่อผู้ใช้งาน"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        icon={<UserIcon />}
        iconPosition="left"
        maxLength={30}
      />

      <InputGroup
        type="password"
        label="รหัสผ่าน"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="กรอกรหัสผ่าน"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        icon={<PasswordIcon />}
        iconPosition="left"
        maxLength={30}
      />


      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          เข้าสู่ระบบ
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
