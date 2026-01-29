import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useConfirm } from '../../hooks/useConfirm';
import {
  Plus, X, Save, AlertCircle, FileText, Sparkles, Globe,
  Settings, Home, ChevronDown, Upload, Eye, EyeOff,
  BarChart3, Smartphone, TrendingUp, Monitor, Grid3x3, GraduationCap
} from 'lucide-react';

// ============================================
// ZOD SCHEMA
// ============================================

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  subtitle: z.string().optional(),
  shortDescription: z.string()
    .min(50, "Must be at least 50 characters"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon selection is required"),
  heroImage: z.any().optional(), // File object
  researchTypes: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  showOnHomepage: z.boolean().default(true),
  displayOrder: z.number().default(0),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.array(z.string()).default([])
  }).default({})
});

// ============================================
// LUCIDE ICONS
// ============================================

const LUCIDE_ICONS = [
  { name: 'BarChart3', component: BarChart3, label: 'Chart' },
  { name: 'Smartphone', component: Smartphone, label: 'Mobile' },
  { name: 'TrendingUp', component: TrendingUp, label: 'Analytics' },
  { name: 'Monitor', component: Monitor, label: 'Computer' },
  { name: 'Grid3x3', component: Grid3x3, label: 'Dashboard' },
  { name: 'GraduationCap', component: GraduationCap, label: 'Training' }
];

const getIconComponent = (iconName) => {
  const icon = LUCIDE_ICONS.find(i => i.name === iconName);
  return icon ? icon.component : BarChart3;
};

// ============================================
// COMPONENT
// ============================================

const CreateServiceForm = ({ onClose, onSubmit, editingService = null }) => {
  const { confirm } = useConfirm();
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [researchTypeInput, setResearchTypeInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const { control, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      slug: '',
      subtitle: '',
      shortDescription: '',
      description: '',
      iconName: 'BarChart3',
      heroImage: null,
      researchTypes: [],
      isPublished: false,
      showOnHomepage: true,
      displayOrder: 0,
      seo: {
        metaTitle: '',
        metaDescription: '',
        metaKeywords: []
      }
    }
  });

  const watchedValues = watch();

  // ============================================
  // INITIALIZE FORM WITH EDITING DATA
  // ============================================
  
  useEffect(() => {
    if (editingService) {
      // ✅ Extract image URL from heroImage.url structure
      const existingImageUrl = editingService.heroImage?.url || editingService.heroImageUrl || null;
      
      reset({
        title: editingService.title || '',
        slug: editingService.slug || '',
        subtitle: editingService.subtitle || '',
        shortDescription: editingService.shortDescription || '',
        description: editingService.description || '',
        iconName: editingService.iconName || 'BarChart3',
        heroImage: null, // Start with no file (user can upload new one)
        researchTypes: editingService.researchTypes || [],
        isPublished: editingService.isPublished || false,
        showOnHomepage: editingService.showOnHomepage !== undefined ? editingService.showOnHomepage : true,
        displayOrder: editingService.displayOrder || 0,
        seo: {
          metaTitle: editingService.seo?.metaTitle || '',
          metaDescription: editingService.seo?.metaDescription || '',
          metaKeywords: editingService.seo?.metaKeywords || []
        }
      });
      
      // ✅ Set image preview from existing service
      setImagePreview(existingImageUrl);
    }
  }, [editingService, reset]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleClose = async () => {
    if (isDirty) {
      const result = await confirm({
        title: 'Discard Changes?',
        message: 'You have unsaved changes. Are you sure you want to close?',
        confirmText: 'Discard',
        cancelText: 'Keep Editing',
        type: 'warning',
      });

      if (!result) return;
    }

    onClose();
  };

  const onFormSubmit = async (data) => {
    const result = await confirm({
      title: editingService ? 'Update Service?' : 'Create Service?',
      message: editingService 
        ? 'Do you want to save these changes?' 
        : 'Do you want to create this service?',
      confirmText: editingService ? 'Update' : 'Create',
      cancelText: 'Cancel',
      type: 'success',
    });

    if (result) {
      // ✅ Prepare service data
      const serviceData = {
        title: data.title,
        slug: data.slug,
        subtitle: data.subtitle || '',
        shortDescription: data.shortDescription,
        description: data.description,
        iconName: data.iconName,
        heroImage: data.heroImage, // This is the File object or null
        researchTypes: data.researchTypes,
        isPublished: data.isPublished,
        showOnHomepage: data.showOnHomepage,
        displayOrder: data.displayOrder,
        seo: data.seo
      };
      
      // ✅ Call onSubmit with correct parameters based on mode
      if (editingService) {
        // Update mode: pass (serviceId, serviceData)
        onSubmit(editingService._id, serviceData);
      } else {
        // Create mode: pass (serviceData)
        onSubmit(serviceData);
      }
    }
  };

  const addResearchType = () => {
    if (researchTypeInput.trim()) {
      const current = watchedValues.researchTypes || [];
      if (!current.includes(researchTypeInput.trim())) {
        setValue('researchTypes', [...current, researchTypeInput.trim()], { shouldDirty: true });
        setResearchTypeInput('');
      }
    }
  };

  const removeResearchType = (index) => {
    const current = watchedValues.researchTypes || [];
    setValue('researchTypes', current.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const current = watchedValues.seo?.metaKeywords || [];
      if (!current.includes(keywordInput.trim())) {
        setValue('seo.metaKeywords', [...current, keywordInput.trim()], { shouldDirty: true });
        setKeywordInput('');
      }
    }
  };

  const removeKeyword = (index) => {
    const current = watchedValues.seo?.metaKeywords || [];
    setValue('seo.metaKeywords', current.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // ✅ Set the File object in the form
      setValue('heroImage', file, { shouldDirty: true });
      
      // ✅ Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('heroImage', null, { shouldDirty: true });
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto px-6 py-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" />
          Basic Information
        </h4>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                onChange={(e) => {
                  field.onChange(e);
                  if (!editingService) {
                    setValue('slug', generateSlug(e.target.value));
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Research Services"
              />
            )}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">(URL friendly)</span>
          </label>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., research-services"
              />
            )}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.slug.message}
            </p>
          )}
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Card Content
          </label>
          <Controller
            name="subtitle"
            placeholder="text for the service cards"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="A short tagline for your service"
              />
            )}
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tile Description <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">(Min 50 characters)</span>
          </label>
          <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description shown on service cards..."
              />
            )}
          />
          <div className="mt-1 flex justify-between text-xs">
            <div>
              {errors.shortDescription && (
                <p className="text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.shortDescription.message}
                </p>
              )}
            </div>
            <p className={`${(watchedValues.shortDescription?.length || 0) < 50 ? 'text-red-500' : 'text-gray-500'}`}>
              {watchedValues.shortDescription?.length || 0} / 50 characters
            </p>
          </div>
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description <span className="text-red-500">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Detailed description for the service detail page..."
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Visual Settings */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-600" />
          Visual Settings
        </h4>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {React.createElement(getIconComponent(watchedValues.iconName), { size: 20 })}
                <span className="font-mono text-sm">{watchedValues.iconName}</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            
            {showIconPicker && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {LUCIDE_ICONS.map((icon) => (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => {
                        setValue('iconName', icon.name, { shouldDirty: true });
                        setShowIconPicker(false);
                      }}
                      className={`p-3 rounded-lg border-2 hover:border-blue-500 transition-colors flex flex-col items-center gap-1 ${
                        watchedValues.iconName === icon.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      {React.createElement(icon.component, { size: 24 })}
                      <span className="text-xs text-gray-600">{icon.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hero Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image
            {editingService && imagePreview && !watchedValues.heroImage && (
              <span className="text-xs text-green-600 ml-2">(Current image will be kept)</span>
            )}
          </label>
          <div className="flex flex-col gap-3">
            <label className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer flex items-center justify-center gap-2 bg-gray-50">
              <Upload size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">
                {watchedValues.heroImage ? 'Change Image' : (editingService ? 'Upload New Image' : 'Upload Image')}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Recommended: 1920x1280px, Max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Research Types */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" />
          Research Types
        </h4>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={researchTypeInput}
            onChange={(e) => setResearchTypeInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchType())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Add research type..."
          />
          <button
            type="button"
            onClick={addResearchType}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {watchedValues.researchTypes?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {watchedValues.researchTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg group hover:bg-blue-100 transition-colors"
              >
                <span className="text-sm text-blue-800">{type}</span>
                <button
                  type="button"
                  onClick={() => removeResearchType(index)}
                  className="text-blue-600 hover:text-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO Settings */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Globe size={20} className="text-blue-600" />
          SEO Settings
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <Controller
            name="seo.metaTitle"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="SEO optimized title..."
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <Controller
            name="seo.metaDescription"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="SEO description for search engines..."
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Keywords
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add keyword..."
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          {watchedValues.seo?.metaKeywords?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {watchedValues.seo.metaKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg group hover:bg-green-100 transition-colors"
                >
                  <span className="text-sm text-green-800">{keyword}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="text-green-600 hover:text-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Controls */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings size={20} className="text-blue-600" />
          Admin Controls
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Controller
              name="isPublished"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              )}
            />
            <label htmlFor="isPublished" className="flex items-center gap-2 cursor-pointer">
              {watchedValues.isPublished ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-gray-400" />}
              <div>
                <p className="font-medium text-gray-900">Published</p>
                <p className="text-xs text-gray-500">Visible on website</p>
              </div>
            </label>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Controller
              name="showOnHomepage"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="showOnHomepage"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              )}
            />
            <label htmlFor="showOnHomepage" className="flex items-center gap-2 cursor-pointer">
              <Home size={18} className={watchedValues.showOnHomepage ? 'text-blue-600' : 'text-gray-400'} />
              <div>
                <p className="font-medium text-gray-900">Homepage</p>
                <p className="text-xs text-gray-500">Show on home</p>
              </div>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <Controller
              name="displayOrder"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="displayOrder"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white pb-4">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              {editingService ? 'Update Service' : 'Create Service'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateServiceForm;