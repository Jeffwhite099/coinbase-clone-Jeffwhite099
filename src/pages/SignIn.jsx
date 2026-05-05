import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";
import Button from "../components/ui/Button";

function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // Keep the loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthLayout title="Sign in to Coinbase">
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          name="email"
          placeholder="Your email address"
          value={formData.email}
          onChange={handleChange}
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="mt-8"
        />

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-[14px] text-red-600">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="auth"
          className="mt-5 bg-[#86a7eb]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Continue"}
        </Button>
      </form>

      {/* OR */}
      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#e5e7eb]" />
        <span className="text-[14px] text-[#6b7280]">OR</span>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <AuthSocialButtons mode="signin" />

      {/* Signup link */}
      <p className="mt-10 text-center text-[16px] font-semibold text-black">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-[#1652f0]">
          Sign up
        </Link>
      </p>

       {/* Footer text */}
       <p className="mx-auto mt-10 max-w-[320px] text-center text-[14px] leading-[1.45] text-[#6b7280]">
         Not your device? Use a private window. See{" "}
         <a href="#" className="underline">
           Privacy Policy
         </a>{" "}
         for more info.
       </p>
       
       {/* Demo note */}
       <p className="mx-auto mt-6 max-w-[320px] text-center text-[13px] leading-[1.4] text-[#6b7280]">
         Demo app – do not use your real password
       </p>
    </AuthLayout>
  );
}

export default SignIn;
