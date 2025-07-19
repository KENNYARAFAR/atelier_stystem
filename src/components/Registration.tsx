import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scissors, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react';

interface RegistrationProps {
  onBackToLogin: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onBackToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    specialization: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await register(formData);
      if (success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          experience: '',
          specialization: '',
          message: '',
        });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Submitted!</h1>
            <p className="text-gray-600">Your application has been submitted successfully</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-3 text-sm text-gray-600 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-600 font-semibold text-xs">1</span>
                  </div>
                  <p>Our admin team will review your application</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-600 font-semibold text-xs">2</span>
                  </div>
                  <p>You'll receive an email notification about the status</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-600 font-semibold text-xs">3</span>
                  </div>
                  <p>If approved, you'll receive login credentials</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={onBackToLogin}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Team</h1>
          <p className="text-gray-600">Apply to become a tailor at Elite Tailoring Co.</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <UserPlus className="h-6 w-6 mr-2" />
              Registration Form
            </h2>
            <button
              onClick={onBackToLogin}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Login</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years (Beginner)</option>
                    <option value="2-5">2-5 years (Intermediate)</option>
                    <option value="6-10">6-10 years (Experienced)</option>
                    <option value="10+">10+ years (Expert)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization *
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="">Select your specialization</option>
                  <option value="mens-formal">Men's Formal Wear</option>
                  <option value="womens-formal">Women's Formal Wear</option>
                  <option value="wedding-dresses">Wedding Dresses</option>
                  <option value="casual-wear">Casual Wear</option>
                  <option value="alterations">Alterations & Repairs</option>
                  <option value="suits">Business Suits</option>
                  <option value="evening-wear">Evening Wear</option>
                  <option value="general">General Tailoring</option>
                </select>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about yourself
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Tell us about your experience, skills, and why you want to join our team..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>

          {/* Requirements */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Minimum 2 years of tailoring experience</li>
              <li>• Proficiency in garment construction and alterations</li>
              <li>• Attention to detail and quality craftsmanship</li>
              <li>• Ability to work with various fabric types</li>
              <li>• Good communication skills</li>
              <li>• Reliable and punctual</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;