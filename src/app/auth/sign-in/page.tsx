import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
};

export default function SignIn() {
  return (
    <div className="p-6 md:p-26 flex justify-center items-center  h-screen">
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="rounded-[10px]  bg-white shadow-1 dark:bg-gray-dark dark:shadow-card w-full p-2 ">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signin />
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
  
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                เข้าสู่ระบบ
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                รื่นรมย์มือถือขอนเเก่น | Khon Kaen

              </h1>

              <p className="w-full min-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                ระบบจัดการหลังบ้านครบวงจร
              </p>

              <div className="mt-8">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
