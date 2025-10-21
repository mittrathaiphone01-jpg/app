import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>

      <div className="">
        <SigninWithPassword />
      </div>

      {/* <GoogleSigninButton text="Sign in" /> */}

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          version 0.1 @2025
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

    </>
  );
}
