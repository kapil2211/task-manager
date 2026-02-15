import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import bgVector from "../assets/login-bg.png"; // keep if you already have this

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center px-6 py-20">

        {/* Background Vector Image (if you already use it) */}
        <img
          src={bgVector}
          alt="To-do Illustration"
          className="absolute right-10 bottom-10 w-[480px] opacity-90 pointer-events-none hidden lg:block"
        />

        <div className="relative z-10 w-full max-w-md 
          bg-white/30 backdrop-blur-xl border border-white/40
          p-10 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-xl border px-4 py-2 bg-white/60"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border px-4 py-2 bg-white/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-2 rounded-xl
              hover:bg-emerald-600 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
