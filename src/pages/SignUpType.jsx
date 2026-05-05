import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/coinbase-logo.svg";
import { User, Briefcase } from "lucide-react";
import LoadingScreen from "../components/common/LoadingScreen";

function SignUpType() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectType = (type) => {
    navigate(`/signup/details?type=${type}`);
  };

  const options = [
    {
      id: "personal",
      title: "Personal",
      description: "Trade crypto as an individual.",
      icon: <User size={24} className="text-blue-600" />,
    },
    {
      id: "business",
      title: "Business",
      description: "Manage teams and portfolios, accept crypto payments, access APIs, and more",
      icon: <Briefcase size={24} className="text-blue-600" />,
    },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Top Logo */}
      <div className="px-8 pt-8">
        <Link to="/">
          <img src={logo} alt="Coinbase" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Main Content */}
       <div className="mx-auto flex max-w-[500px] flex-col items-center px-6 pt-24 pb-20">
         <h1 className="text-center text-[32px] font-semibold leading-tight tracking-tight text-[#0a0b0d]">
           What kind of account are you creating?
         </h1>

         <div className="mt-12 flex w-full flex-col gap-4">
           {options.map((option) => (
             <button
               key={option.id}
               onClick={() => handleSelectType(option.id)}
               className="flex items-center gap-6 rounded-[12px] border border-[#eceff1] p-6 text-left transition-all duration-200 hover:bg-[#f4f7f9]"
             >
               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#f4f7f9]">
                 {option.icon}
               </div>

               <div className="flex flex-col">
                 <h3 className="text-[18px] font-bold text-[#0a0b0d]">{option.title}</h3>
                 <p className="mt-1 text-[14px] leading-relaxed text-[#5b616e]">
                   {option.description}
                 </p>
               </div>
             </button>
           ))}
         </div>
       </div>
       
       {/* Demo note */}
       <p className="mx-auto mt-6 max-w-[500px] text-center text-[13px] leading-[1.4] text-[#6b7280]">
         Demo app – do not use your real password
       </p>
    </div>
  );
}

export default SignUpType;
