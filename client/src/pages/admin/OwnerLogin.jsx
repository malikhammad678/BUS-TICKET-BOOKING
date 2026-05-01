import { useState } from "react";
import { Bus, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAppContext } from "../../context/Context";

const OwnerLogin = () => {
  const { AdminLogin, isAdminLoading, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    AdminLogin(email,password)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 px-8 pt-10 pb-14 text-white text-center relative">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Bus size={22} className="text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Admin Login
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Welcome Back
            </p>
          </div>
          <div className="px-8 pt-12 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                className="w-full cursor-pointer bg-primary text-white py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200 mt-2"
              >
                {
                  isAdminLoading ? 'Loading...' : 'Login'
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;