import React, { useState, useRef, useEffect } from 'react';
import { CarIcon } from '../components/icons/CarIcon';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1); // 1: phone, 2: OTP, 3: Details
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep(2);
    }
  };
  
  useEffect(() => {
    if (step === 2) {
      otpInputs.current[0]?.focus();
    }
  }, [step]);
  
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    // Mock OTP verification
    if (enteredOtp === '123456') {
      setStep(3);
    } else {
      alert('Invalid OTP. Please use 123456');
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
    }
  };
  
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob) {
      onLogin({ name, dob, phone });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFBEB] dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto bg-yellow-400 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-6 shadow-lg">
          <CarIcon className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">RideLink</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Your Community Commute Partner</p>
        
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Login or Sign Up</h2>
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Enter Verification Code</h2>
            <p className="text-gray-600 dark:text-gray-400">We've sent a 6-digit code to your phone. (Hint: it's 123456)</p>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpInputs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              ))}
            </div>
             <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            >
              Verify
            </button>
            <button
              onClick={() => setStep(1)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Change number
            </button>
          </form>
        )}

        {step === 3 && (
            <form onSubmit={handleCreateProfile} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Create Your Profile</h2>
              <p className="text-gray-600 dark:text-gray-400">Just a few more details to get you started.</p>
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                 <input
                  type="text"
                  onFocus={(e) => e.target.type='date'}
                  onBlur={(e) => e.target.type='text'}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="Date of Birth"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md"
              >
                Complete Profile & Enter
              </button>
            </form>
          )}

        <div className="mt-8 text-gray-500 dark:text-gray-500 text-sm">
          By continuing, you agree to our Terms of Service.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;