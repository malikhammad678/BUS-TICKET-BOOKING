import { useState } from "react";
import { useAppContext } from "../context/Context";
import { useLocation } from "react-router-dom";
import { Bus, Eye, EyeOff, Mail, Lock, User, Loader } from "lucide-react";

const Login = () => {
  const { navigate, userLogin, loading } = useAppContext();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/";
  const redirectBus = location.state?.bus || null;

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userLogin(
        name,
        email,
        password,
        state === "Login" ? "login" : "signup",
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top banner */}
          <div className="bg-gradient-to-br from-primary to-primary/80 px-8 pt-10 pb-14 text-white text-center relative">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Bus size={22} className="text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {state === "Login" ? "Welcome Back 👋" : "Create Account"}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {state === "Login"
                ? "Login to book your bus ticket"
                : "Join thousands of happy travelers"}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pt-12 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {state === "Sign Up" && (
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              )}

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer flex items-center justify-center bg-primary text-white py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200 mt-2"
              >
                {loading ? (
                  <Loader className="animate-spin text-white size-5 " />
                ) : state === "Login" ? (
                  "Login & Continue"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              {state === "Login" ? (
                <>
                  Don't have an account?{" "}
                  <span
                    className="text-primary font-semibold cursor-pointer hover:underline"
                    onClick={() => setState("Sign Up")}
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-primary font-semibold cursor-pointer hover:underline"
                    onClick={() => setState("Login")}
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
