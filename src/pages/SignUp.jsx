import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";
import Button from "../components/ui/Button";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/auth/register",  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your account" 
      description="Access all that Coinbase has to offer with a single account."
    >
      <form onSubmit={handleSubmit}>
        <AuthInput 
          label="Name"
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <AuthInput 
          label="Email"
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthInput 
          label="Password"
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="mt-4 text-[14px] text-red-500">{error}</div>
        )}

        <Button 
          variant="primary" 
          size="auth" 
          className="mt-7 bg-[#86a7eb]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Continue"}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#e5e7eb]" />
        <span className="text-[14px] text-[#6b7280]">OR</span>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <AuthSocialButtons mode="signup" />

      <p className="mt-8 text-center text-[16px] font-semibold text-black">
        Already have an account?{" "}
        <Link to="/signin" className="text-[#1652f0]">
          Sign in
        </Link>
      </p>

       <p className="mx-auto mt-8 max-w-[380px] text-center text-[14px] leading-[1.45] text-[#6b7280]">
         By creating an account you certify that you are over the
         age of 18 and agree to our{" "}
         <a href="#" className="underline">
           Privacy Policy
         </a>{" "}
         and{" "}
         <a href="#" className="underline">
           Cookie Policy
         </a>
         .
       </p>
       
       {/* Demo note */}
       <p className="mx-auto mt-6 max-w-[380px] text-center text-[13px] leading-[1.4] text-[#6b7280]">
         Demo app – do not use your real password
       </p>
    </AuthLayout>
  );
}

export default SignUp;