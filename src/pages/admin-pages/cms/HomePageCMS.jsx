import React, { useState } from 'react';
import { Home, Briefcase, Info, Save, RotateCcw } from 'lucide-react';

const HomePageCMS = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  
  // Combined state for all sections
  const [formData, setFormData] = useState({
    hero: {
      title: 'Welcome to Our Platform',
      subtitle: 'Your success starts here',
      backgroundImage: '',
      ctaText: 'Get Started',
      ctaLink: '/courses'
    },
    services: {
      title: 'Our Services',
      description: 'We provide comprehensive training solutions'
    },
    about: {
      title: 'About Us',
      description: 'We are dedicated to excellence in education',
      teamPhoto: ''
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save all sections at once
      // await axios.put('/api/cms/homepage', formData);
      console.log('Saving:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Homepage updated successfully!');
    } catch (error) {
      alert('Failed to update homepage');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to original values or fetch from API
    if (confirm('Are you sure you want to reset all changes?')) {
      // fetchData();
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'services', label: 'Services Section', icon: Briefcase },
    { id: 'about', label: 'About Section', icon: Info }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold">Homepage Content Management</h2>
        <p className="text-gray-600 text-sm mt-1">Edit all homepage sections from one place</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex px-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => handleChange('hero', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter hero title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
              <input
                type="text"
                value={formData.hero.subtitle}
                onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Image URL</label>
              <input
                type="text"
                value={formData.hero.backgroundImage}
                onChange={(e) => handleChange('hero', 'backgroundImage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={formData.hero.ctaText}
                  onChange={(e) => handleChange('hero', 'ctaText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Get Started"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CTA Link</label>
                <input
                  type="text"
                  value={formData.hero.ctaLink}
                  onChange={(e) => handleChange('hero', 'ctaLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/courses"
                />
              </div>
            </div>
          </div>
        )}

        {/* Services Section Tab */}
        {activeTab === 'services' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <input
                type="text"
                value={formData.services.title}
                onChange={(e) => handleChange('services', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Our Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Section Description</label>
              <textarea
                value={formData.services.description}
                onChange={(e) => handleChange('services', 'description', e.target.value)}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your services..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Individual service items are managed in the "Services" section of the admin panel.
              </p>
            </div>
          </div>
        )}

        {/* About Section Tab */}
        {activeTab === 'about' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <input
                type="text"
                value={formData.about.title}
                onChange={(e) => handleChange('about', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="About Us"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">About Description</label>
              <textarea
                value={formData.about.description}
                onChange={(e) => handleChange('about', 'description', e.target.value)}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell your story..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Team Photo URL</label>
              <input
                type="text"
                value={formData.about.teamPhoto}
                onChange={(e) => handleChange('about', 'teamPhoto', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/team.jpg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RotateCcw size={18} />
          Reset Changes
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Preview Section */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <details className="cursor-pointer">
          <summary className="font-medium text-gray-700">Preview Current Section</summary>
          <div className="mt-4 p-4 bg-white border rounded-lg">
            {activeTab === 'hero' && (
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">{formData.hero.title}</h1>
                <p className="text-xl text-gray-600 mb-4">{formData.hero.subtitle}</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                  {formData.hero.ctaText}
                </button>
              </div>
            )}
            {activeTab === 'services' && (
              <div>
                <h2 className="text-3xl font-bold mb-2">{formData.services.title}</h2>
                <p className="text-gray-600">{formData.services.description}</p>
              </div>
            )}
            {activeTab === 'about' && (
              <div>
                <h2 className="text-3xl font-bold mb-2">{formData.about.title}</h2>
                <p className="text-gray-600">{formData.about.description}</p>
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

export default HomePageCMS;