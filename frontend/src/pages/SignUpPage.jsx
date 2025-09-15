import React from "react";
import { useState } from "react";
import { RoseIcon } from "lucide-react";
import {Link} from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {signup} from "../lib/api.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {mutate:signupMutation, isPending, error}= useMutation({
    mutationFn: signup,
    onSuccess: ()=> {
      queryClient.invalidateQueries({queryKey:["authUser"]});
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create account");
    },
  }) ;

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-4 md:p-6"
      data-theme="coffee"
    >
      <div
        className="border border-primary/25 flex flex-col lg:flex-row w-full 
      max-w-3xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden"
      >
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-2 sm:p-4 flex flex-col">
          {/* login */}
          <div className="text-center mb-2 flex items-center justify-start gap-2">
            <RoseIcon className="size-8 text-primary" />
            <span
              className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent 
            bg-gradient-to-r from-primary to-secondary tracking-wider"
            >
              Hy-Chat
            </span>
          </div>

          {/* Display error if any */}
          {error && (
            <div className="alert alert-error mb-2">
              <span className="text-sm">{error.response?.data?.message || error.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Create an Account
                  </h2>
                  <p className="text-sm opacity-70 break-words">
                    Join Hy-Chat and start your language learning adventure!
                  </p>
                </div>
                <div className="space-y-1.5">
                  {/* Full Name */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="eg. saksham shrivastava"
                      className="input input-bordered w-full text-sm"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* Email */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="text"
                      placeholder="eg. saksham@example.com"
                      className="input input-bordered w-full text-sm"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full text-sm"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      password must be atleast 4 characters long.
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight break-words">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-2">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* sign up form right side*/}

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-4">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-2 mt-4">
              <h2 className="text-lg sm:text-xl font-semibold break-words">
                Connect with Songs partners worldwide
              </h2>
              <p className="opacity-70 text-sm break-words">
                Practice conversations, make friends, and improve your song
                choices together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
