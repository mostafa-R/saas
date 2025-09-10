import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

// Joi-style validation
const validate = {
  email: (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    return '';
  },
  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  }
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (touched[name]) {
      setErrors({ ...errors, [name]: validate[name](value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validate[name](value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailError = validate.email(form.email);
    const passwordError = validate.password(form.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }

    login({ email: form.email, role: "shipper" });
    navigate("/dashboard");
  };

  const getFieldClass = (field) => {
    const hasError = errors[field] && touched[field];
    const isValid = touched[field] && !errors[field] && form[field];
    return `w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none transition ${
      hasError ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500' :
      isValid ? 'border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500' :
      'border-gray-300 focus:ring-2 focus:ring-blue-500'
    }`;
  };

  const getIconColor = (field) => {
    const hasError = errors[field] && touched[field];
    const isValid = touched[field] && !errors[field] && form[field];
    return hasError ? 'text-red-400' : isValid ? 'text-green-500' : 'text-gray-400';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-gray-900 to-black text-white items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Logistics Dashboard</h1>
          <p className="text-gray-300 text-lg">Manage your operations efficiently</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail size={20} className={`absolute left-3 top-3 ${getIconColor('email')}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClass('email')}
                />
                {touched.email && (
                  <div className="absolute right-3 top-3">
                    {errors.email ? 
                      <AlertCircle size={20} className="text-red-500" /> :
                      form.email && <CheckCircle size={20} className="text-green-500" />
                    }
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle size={16} className="mr-1" />{errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock size={20} className={`absolute left-3 top-3 ${getIconColor('password')}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClass('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle size={16} className="mr-1" />{errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all shadow-lg"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}