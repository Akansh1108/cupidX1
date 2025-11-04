
import React, { useState } from 'react';
import { ScreeningData } from '../types';

interface ScreeningFormProps {
  onSubmit: (data: ScreeningData) => void;
}

const ScreeningForm: React.FC<ScreeningFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ScreeningData>({
    name: '',
    gender: '',
    partnerPreference: '',
    relationshipStatus: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.name && formData.gender && formData.partnerPreference && formData.relationshipStatus;

  const inputClasses = "w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all";
  const selectClasses = `${inputClasses} appearance-none`;
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-white">First, a few basics</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClasses}>What's your first name?</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="e.g., Alex" />
        </div>
        <div>
          <label htmlFor="gender" className={labelClasses}>How do you identify?</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={selectClasses}>
            <option value="" disabled>Select...</option>
            <option>Woman</option>
            <option>Man</option>
            <option>Non-binary</option>
            <option>Prefer to self-describe</option>
            <option>Prefer not to say</option>
          </select>
        </div>
        <div>
          <label htmlFor="partnerPreference" className={labelClasses}>Who are you interested in?</label>
          <select name="partnerPreference" id="partnerPreference" value={formData.partnerPreference} onChange={handleChange} className={selectClasses}>
            <option value="" disabled>Select...</option>
            <option>Women</option>
            <option>Men</option>
            <option>Everyone</option>
            <option>Open to connection</option>
          </select>
        </div>
        <div>
          <label htmlFor="relationshipStatus" className={labelClasses}>What's your current status?</label>
          <select name="relationshipStatus" id="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange} className={selectClasses}>
            <option value="" disabled>Select...</option>
            <option>Single</option>
            <option>Casually dating</option>
            <option>It's complicated</option>
            <option>Exploring</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full px-6 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default ScreeningForm;
