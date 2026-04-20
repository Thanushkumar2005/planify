import { useState } from "react";
import API from "./api";

function LoginPage({ onSwitch, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setStatusType("");

    if (!email || !password) {
      setStatusMessage("Please enter both email and password.");
      setStatusType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      const { token, user } = response.data;
      localStorage.setItem("planify_token", token);
      localStorage.setItem("planify_user", JSON.stringify(user));

      setStatusMessage("Login successful. Redirecting...");
      setStatusType("success");
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed. Please check your details.";
      setStatusMessage(message);
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-sky-900/95 via-indigo-950/90 to-fuchsia-900/95 border border-slate-700 shadow-2xl shadow-slate-950/40 backdrop-blur-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-sky-200">Planify</h1>
          <p className="mt-3 text-sm text-slate-200">
            Sign in to your Planify account and start organizing your day with color.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-sky-400"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <div className="relative mt-3">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 pr-12 text-slate-100 outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-sky-400"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-400 focus:ring-sky-400"
              />
              Remember me
            </label>
            <button type="button" className="font-medium text-sky-400 hover:text-sky-300">
              Forgot password?
            </button>
          </div>

          {statusMessage ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                statusType === "success"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
              }`}
            >
              {statusMessage}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don’t have an account?{' '}
          <button type="button" onClick={onSwitch} className="font-medium text-sky-200 hover:text-sky-100">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
