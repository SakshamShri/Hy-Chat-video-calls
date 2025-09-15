import { useState } from "react";
import { RoseIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: loginMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: login,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
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
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-2 sm:p-4 flex flex-col">
          {/* LOGO */}
          <div className="text-center mb-2 flex items-center justify-start gap-2">
            <RoseIcon className="size-8 text-primary" />
            <span
              className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent 
            bg-gradient-to-r from-primary to-secondary tracking-wider"
            >
              Hy-Chat
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-4 text-xs">
              <span className="text-xs">{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Welcome friend!</h2>
                  <p className="text-sm opacity-70 break-words">
                    Sign in to your account to be a part of a better community.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="eg. Saksham@example.com"
                      className="input input-bordered w-full text-sm"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full text-sm"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-primary hover:underline"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
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
                Connect with a listeners community.
              </h2>
              <p className="opacity-70 text-sm break-words">
                Connect, chat, and build meaningful friendships with people from around the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
