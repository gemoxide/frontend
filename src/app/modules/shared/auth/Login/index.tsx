import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginRequestAction } from "../../../../core/state/reducer/auth";
import { ROUTES } from "../../../../core/constants/routes";
import type { AppDispatch, RootState } from "../../../../core/state/store";
import { toast } from "react-toastify";
const Login: React.FC = () => {
  console.log("Login component is rendering");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get authentication state from Redux
  const {
    loading: loginLoading,
    success: loginSuccess,
    error: loginError,
  } = useSelector((state: RootState) => state.auth.login);

  const {
    loading: userLoading,
    success: userSuccess,
    data: currentUser,
  } = useSelector((state: RootState) => state.auth.user);

  // Get redirect URL from query params
  const redirectUrl = searchParams.get("redirect") || ROUTES.USER.dashboard.key;

  // Handle navigation after successful authentication
  useEffect(() => {
    if (loginSuccess && userSuccess && currentUser) {
      console.log("Login successful, navigating to:", redirectUrl);
      navigate(redirectUrl);
    }
  }, [loginSuccess, userSuccess, currentUser, navigate, redirectUrl]);

  // Handle login errors
  useEffect(() => {
    if (loginError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  }, [loginError]);

  // Update loading state based on Redux state
  useEffect(() => {
    setLoading(loginLoading || userLoading);
  }, [loginLoading, userLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      dispatch(loginRequestAction({ email, password }));
      console.log("Login dispatched");
    } catch (error: unknown) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      toast.success("Login successful");
    }
    if (loginError) {
      toast.error("Invalid email or password. Please try again.");
    }
  }, [loginSuccess, loginError]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          CCLPI Login Form
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <form
              autoComplete="off"
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
