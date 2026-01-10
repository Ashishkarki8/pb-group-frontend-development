import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';

// Zod Schema - Real-world optimized validation
const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  
  role: z.enum(['developer', 'designer', 'manager', 'other'], {
    errorMap: () => ({ message: 'Please select a role' })
  }),
  
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  
  terms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export default function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    reset
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur', // Performance: validate on blur instead of onChange
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
      phoneNumber: '',
      terms: false
    }
  });

  // Watch password for real-time validation feedback
  const password = watch('password');

  // Console logs for learning
  console.log('🔍 Form Errors:', errors);
  console.log('📊 Form State:', { isDirty, isValid, isSubmitting });
  console.log('👀 Watched Password:', password);

  // Submit handler
  const onSubmit = async (data) => {
    console.log('✅ Form Submitted Successfully!');
    console.log('📝 Form Data:', data);
    console.log('🔐 Password removed from data:', { ...data, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('🚀 API Response: User registered successfully');
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
      }, 3000);
      
    } catch (error) {
      console.error('❌ Registration Error:', error);
    }
  };

  // Console log on validation errors
  const onError = (errors) => {
    console.log('❌ Validation Errors:', errors);
  };

  const handleFormSubmit = (e) => {
    console.log('📤 Form submission triggered');
    handleSubmit(onSubmit, onError)(e);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600">Your account has been created successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us today and get started</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              {...register('fullName')}
              id="fullName"
              type="text"
              placeholder="John Doe"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              onBlur={() => console.log('🎯 Full Name blur event')}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="john@example.com"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              onBlur={() => console.log('🎯 Email blur event')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              {...register('role')}
              id="role"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={(e) => console.log('📋 Role selected:', e.target.value)}
            >
              <option value="">Select a role</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="other">Other</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <input
              {...register('phoneNumber')}
              id="phoneNumber"
              type="tel"
              placeholder="+1234567890"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-10 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  console.log('👁️ Password visibility toggled:', !showPassword);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-10 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                  console.log('👁️ Confirm password visibility toggled:', !showConfirmPassword);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                onChange={(e) => console.log('✔️ Terms accepted:', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}