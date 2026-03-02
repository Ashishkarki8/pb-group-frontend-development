import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import { useConfirm } from '../../../hooks/useConfirm.js';
import TailwindRichTextEditor from '../../../utils/Tailwindrichtexteditor';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Called before reset() in edit mode.
 * Recursively converts null → "" so Zod string fields never receive null.
 */
const sanitizeCourseData = (data) => {
  if (data === null || data === undefined) return undefined;
  if (typeof data === 'string')  return data;
  if (typeof data === 'number')  return data;
  if (typeof data === 'boolean') return data;
  if (Array.isArray(data))       return data.map(i => (i === null ? '' : i));
  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => {
        if (v === null)            return [k, ''];
        if (Array.isArray(v))      return [k, v.map(i => (i === null ? '' : i))];
        if (typeof v === 'object') return [k, sanitizeCourseData(v)];
        return [k, v];
      })
    );
  }
  return data;
};

/**
 * Unified array-error display.
 * setValue arrays  → error.message
 * useFieldArray    → error.root.message
 */
const ArrayError = ({ error }) => {
  const msg = error?.message || error?.root?.message;
  if (!msg) return null;
  return <p className="text-red-500 text-sm mt-1">{msg}</p>;
};

// ─────────────────────────────────────────────────────────────────────────────
// ZOD SCHEMA HELPERS
// z.preprocess is used for all number fields so "" / null / undefined all
// become `undefined` before hitting the Zod validator.  No `setValueAs` needed
// anywhere in the JSX.
// ─────────────────────────────────────────────────────────────────────────────

/** "" | null | undefined → undefined, otherwise Number(val) */
const toNum = (val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
};

/** Optional non-negative number */
const optPosNum = (errMsg) =>
  z.preprocess(toNum, z.number().min(0, errMsg).optional());

/** Optional positive integer (>0) */


const nullStr = z.string().nullish().transform(v => v ?? '');
const optDate = z.string().nullish().transform(v => v ?? '');

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
const courseSchema = z.object({

  // ── Basic Info ────────────────────────────────────────────────────────────
  title:        z.string().min(5,  'Title must be at least 5 characters'),
  subtitle:     z.string().min(10, 'Subtitle must be at least 10 characters'),
  description:  z.string().min(50, 'Description must be at least 50 characters'),
  heroImage:    z.any().nullable(),

  // Rating: 0–5 inclusive, 1 decimal place enforced by the input
  rating: z.preprocess(
    toNum,
    z.number().min(0, 'Rating must be at least 0').max(5, 'Rating cannot exceed 5').optional()
  ),

  // Display order for sorting on the frontend (positive integer)
  displayOrder: z.preprocess(toNum, z.number().int('Must be a whole number').min(1, 'Must be at least 1').optional()),

  // ── Categorization ────────────────────────────────────────────────────────
  category: z.array(z.string()).min(1, 'Select at least one category'),
  tags:     z.array(z.string()).min(1, 'Add at least one tag'),
 level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'], {
  errorMap: () => ({ message: 'Please select a level' }),
}),


  // ── Pricing (all optional) ────────────────────────────────────────────────
  pricing: z.object({
    currency:           z.string().default('NPR'),
    originalPrice:      optPosNum('Price cannot be negative'),
    regularPrice:       optPosNum('Price cannot be negative'),
    currentPrice:       optPosNum('Price cannot be negative'),
    discountType:       nullStr,
    discountPercentage: z.preprocess(
      toNum,
      z.number().min(0, 'Min 0%').max(100, 'Max 100%').optional()
    ),
    discountValidUntil: optDate,
  }),

  // ── Schedule (all optional) ───────────────────────────────────────────────
  schedule: z.object({
    startDate:          optDate,
    endDate:            optDate,
    enrollmentDeadline: optDate,
    classTimings:       nullStr,
    mode:               z.enum(['Online', 'Offline', 'Hybrid']).optional(),
  }),

  duration:   nullStr,
  totalHours: z.preprocess(
    toNum,
    z.number().min(0.5, 'Must be at least 0.5 hours').optional()
  ),
  location: nullStr,

  // ── Status & Seats ────────────────────────────────────────────────────────
  status: z.enum(['Coming Soon', 'Enrolling Now', 'Full', 'Completed'], {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
  seatsTotal:     optPosNum('Cannot be negative'),
  seatsAvailable: optPosNum('Cannot be negative'),

  // ── Hidden fields (Preserve state on update) ──────────────────────────────
  isPublished:    z.boolean().optional(),
  isTrending:     z.boolean().optional(),
  showOnHomepage: z.boolean().optional(),

  // ── SEO ───────────────────────────────────────────────────────────────────
  seo: z.object({
    metaTitle:       z.string().min(30, 'At least 30 characters').max(60, 'Max 60 characters'),
    metaDescription: z.string().min(120, 'At least 120 characters').max(160, 'Max 160 characters'),
    keywords:        z.array(z.string()).min(3, 'Add at least 3 keywords'),
    canonicalUrl:    z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal(''))
      .nullish()
      .transform(v => v ?? ''),
  }),

  // ── Content arrays ────────────────────────────────────────────────────────
  highlights:       z.array(z.string().min(1)).min(3, 'Add at least 3 highlights'),
  targetAudience:   z.array(z.string().min(1)).min(2, 'Add at least 2 entries'),
  learningOutcomes: z.array(z.string().min(1)).min(4, 'Add at least 4 outcomes'),
  prerequisites:    z.array(z.string().min(1)).min(1, 'Add at least 1 prerequisite'),

  // ── Syllabus ──────────────────────────────────────────────────────────────
  courseSyllabus: z.array(z.object({
    week:     z.preprocess(toNum, z.number()),
    title:    z.string().min(1, 'Week title is required'),
    duration: z.string().min(1, 'Duration is required'),
    topics:   z.array(z.string().min(1)).min(1, 'Add at least one topic'),
  })).min(1, 'Add at least one week to the syllabus'),
});

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULTS — number fields default to '' so inputs render empty, not "undefined"
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_DEFAULTS = {
  title: '', subtitle: '', description: '', heroImage: null,
  rating: '', displayOrder: '',
  category: [], tags: [], level: 'Beginner',
  pricing: {
    currency: 'NPR',
    originalPrice: '', regularPrice: '', currentPrice: '',
    discountType: '', discountPercentage: '', discountValidUntil: '',
  },
  schedule: { startDate: '', endDate: '', enrollmentDeadline: '', classTimings: '', mode: 'Offline' },
  duration: '', totalHours: '', location: '',
  status: 'Coming Soon', seatsTotal: '', seatsAvailable: '',
  highlights: [''], targetAudience: [''], learningOutcomes: [''], prerequisites: [''],
  courseSyllabus: [],
  seo: { metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: '' },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION ACCORDION
// ─────────────────────────────────────────────────────────────────────────────
const Section = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition rounded-lg"
    >
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
    </button>
    {isOpen && <div className="px-6 pb-6 border-t border-gray-100 pt-4">{children}</div>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SHARED INPUT CLASSES
// ─────────────────────────────────────────────────────────────────────────────
const inputCls = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

// ─────────────────────────────────────────────────────────────────────────────
// FORM COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CreateCourseForm = ({
  editingCourse  = null,
  existingCourse = null,
  onClose,
  onSubmit,
}) => {
  const existingCourseData = editingCourse || existingCourse;
  const { confirm } = useConfirm();

  const [openSections, setOpenSections] = useState({
    basic: true, categorization: false, pricing: false, schedule: false,
    seo: false, media: false, content: false, syllabus: false,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register, control, handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch, setValue, reset,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: INITIAL_DEFAULTS,
  });

  // ── Populate form in edit mode ───────────────────────────────────────────
  useEffect(() => {
    if (!existingCourseData) return;
    const clean = sanitizeCourseData(existingCourseData);
    reset({
      ...INITIAL_DEFAULTS,
      ...clean,
      heroImage: null,
      pricing:  { ...INITIAL_DEFAULTS.pricing,  ...(clean.pricing  ?? {}) },
      schedule: { ...INITIAL_DEFAULTS.schedule, ...(clean.schedule ?? {}) },
      seo:      { ...INITIAL_DEFAULTS.seo,      ...(clean.seo      ?? {}) },
    });
    setImagePreview(existingCourseData.heroImage?.url || existingCourseData.heroImageUrl || null);
  }, [existingCourseData, reset]);

  // ── Warn on close if dirty ───────────────────────────────────────────────
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
    onClose?.();
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleFormSubmit = async (data) => {
    // In edit mode, if no fields have been changed, just close the modal without any action.
    if (existingCourseData && !isDirty) {
      console.log("No changes detected. Closing form.");
      onClose?.();
      return;
    }

    const result = await confirm({
      title: existingCourseData ? 'Update Course?' : 'Create New Course?',
      message: existingCourseData 
        ? 'You have made changes. Do you want to save them?' 
        : 'Are you sure you want to create this new course?',
      confirmText: existingCourseData ? 'Update' : 'Create',
      cancelText: 'Cancel',
      type: 'success',
    });

    if (result) {
      if (existingCourseData) {
        onSubmit?.(existingCourseData._id, data);
      } else {
        onSubmit?.(data);
      }
    }
  };
  // ── Field arrays ─────────────────────────────────────────────────────────
  const { fields: highlightFields,    append: addHighlight,    remove: removeHighlight    } = useFieldArray({ control, name: 'highlights' });
  const { fields: audienceFields,     append: addAudience,     remove: removeAudience     } = useFieldArray({ control, name: 'targetAudience' });
  const { fields: outcomeFields,      append: addOutcome,      remove: removeOutcome      } = useFieldArray({ control, name: 'learningOutcomes' });
  const { fields: prerequisiteFields, append: addPrerequisite, remove: removePrerequisite } = useFieldArray({ control, name: 'prerequisites' });
  const { fields: syllabusFields,     append: addSyllabusWeek, remove: removeSyllabusWeek } = useFieldArray({ control, name: 'courseSyllabus' });
  const { fields: keywordFields,      append: addKeyword,      remove: removeKeyword      } = useFieldArray({ control, name: 'seo.keywords' });

  const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const CATEGORIES = ['Analysis', 'Coding', 'AI', 'Collection', 'Writing', 'Management and Modeling'];

  // ── Image upload ─────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024)    { alert('Image must be under 5 MB'); return; }
    setValue('heroImage', file, { shouldDirty: true });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    setValue('heroImage', null, { shouldDirty: true });
  };

  // ── Tags ─────────────────────────────────────────────────────────────────
  const tags = watch('tags') || [];
  const addTag    = (val) => {
    const t = val.trim();
    if (t && !tags.includes(t)) setValue('tags', [...tags, t], { shouldValidate: true, shouldDirty: true });
  };
  const removeTag = (i) =>
    setValue('tags', tags.filter((_, idx) => idx !== i), { shouldValidate: true, shouldDirty: true });

  // ── Rating: enforce max 5 in the input itself ─────────────────────────────
  const handleRatingInput = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 5) e.target.value = '5';
    if (!isNaN(val) && val < 0) e.target.value = '0';
  };

  // ── Auto-open sections that contain errors ───────────────────────────────
  const openSectionsWithErrors = (errs) => {
    setOpenSections(prev => ({
      ...prev,
      basic:          prev.basic          || !!(errs.title || errs.subtitle || errs.description || errs.rating || errs.displayOrder),
      categorization: prev.categorization || !!(errs.category || errs.tags || errs.level),
      pricing:        prev.pricing        || !!(errs.pricing),
      schedule:       prev.schedule       || !!(errs.schedule || errs.duration || errs.totalHours || errs.location || errs.status || errs.seatsTotal || errs.seatsAvailable),
      seo:            prev.seo            || !!(errs.seo),
      content:        prev.content        || !!(errs.highlights || errs.targetAudience || errs.learningOutcomes || errs.prerequisites),
      syllabus:       prev.syllabus       || !!(errs.courseSyllabus),
    }));
  };

  // ── Watched values ────────────────────────────────────────────────────────
  const ratingVal      = Number(watch('rating')) || 0;
  const metaTitleLen   = watch('seo.metaTitle')?.length   || 0;
  const metaDescLen    = watch('seo.metaDescription')?.length || 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {existingCourseData ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {existingCourseData ? 'Update the course details below.' : 'Fill in the details below to publish a new course.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit, (errs) => {
          console.warn('Validation errors:', errs);
          openSectionsWithErrors(errs);
        })}
        className="space-y-4"
        noValidate
      >

        {/* ══════════════════════════════════════════════════════════════
            BASIC INFORMATION
        ══════════════════════════════════════════════════════════════ */}
        <Section title="📋 Basic Information" isOpen={openSections.basic} onToggle={() => toggleSection('basic')}>
          <div className="space-y-5">

            <div>
              <label className={labelCls}>Course Title *</label>
              <input
                {...register('title')}
                placeholder="e.g., Data Analytics using R Programming"
                className={inputCls}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Subtitle *</label>
              <input
                {...register('subtitle')}
                placeholder="e.g., Master Statistical Analysis and Data Visualization with R"
                className={inputCls}
              />
              {errors.subtitle && <p className="text-red-500 text-xs mt-1">{errors.subtitle.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Full Description *</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TailwindRichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write a detailed course description…"
                  />
                )}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Display Order */}
            <div>
              <label className={labelCls}>
                Display Order <span className="text-gray-400 font-normal text-xs">(1 = shown first)</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                {...register('displayOrder')}
                placeholder="e.g., 1"
                className={inputCls}
              />
              {errors.displayOrder && <p className="text-red-500 text-xs mt-1">{errors.displayOrder.message}</p>}
            </div>

            {/* Rating */}
            <div>
              <label className={labelCls}>
                Rating <span className="text-gray-400 font-normal text-xs">(0.0 – 5.0)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register('rating')}
                onInput={handleRatingInput}
                placeholder="e.g., 4.7"
                className={inputCls}
              />
              {/* Star preview */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span
                      key={s}
                      className={`text-xl leading-none ${s <= Math.round(ratingVal) ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {ratingVal > 0 ? `${ratingVal.toFixed(1)} / 5.0` : 'Not set'}
                </span>
              </div>
              {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
            </div>

          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            CATEGORIZATION
        ══════════════════════════════════════════════════════════════ */}
        <Section title="🏷️ Categorization" isOpen={openSections.categorization} onToggle={() => toggleSection('categorization')}>
          <div className="space-y-5">

            <div>
              <label className={labelCls}>Categories *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" value={cat} {...register('category')} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category.message || errors.category.root?.message}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Level *</label>
              <select {...register('level')} className={inputCls}>
  <option value="">Select a level…</option>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
  <option value="Beginner to Advanced">Beginner to Advanced</option>
</select>

              {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Tags * <span className="text-gray-400 font-normal text-xs">(press Enter to add)</span></label>
              <input
                type="text"
                placeholder="e.g., R Programming"
                className={inputCls}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(e.target.value); e.target.value = ''; } }}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(idx)} className="ml-1 text-blue-500 hover:text-blue-700 font-bold leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
              {errors.tags && (
                <p className="text-red-500 text-xs mt-1">{errors.tags.message || errors.tags.root?.message}</p>
              )}
            </div>

          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════════════════════ */}
        <Section title="💰 Pricing (Optional)" isOpen={openSections.pricing} onToggle={() => toggleSection('pricing')}>
          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className={labelCls}>Original Price <span className="text-gray-400 text-xs">(crossed out)</span></label>
              <input type="number" min="0" {...register('pricing.originalPrice')} placeholder="e.g., 25000" className={inputCls} />
              {errors.pricing?.originalPrice && <p className="text-red-500 text-xs mt-1">{errors.pricing.originalPrice.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Regular Price</label>
              <input type="number" min="0" {...register('pricing.regularPrice')} placeholder="e.g., 20000" className={inputCls} />
              {errors.pricing?.regularPrice && <p className="text-red-500 text-xs mt-1">{errors.pricing.regularPrice.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Current Price <span className="text-gray-400 text-xs">(after discount)</span></label>
              <input type="number" min="0" {...register('pricing.currentPrice')} placeholder="e.g., 15000" className={inputCls} />
              {errors.pricing?.currentPrice && <p className="text-red-500 text-xs mt-1">{errors.pricing.currentPrice.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Discount Type</label>
              <input {...register('pricing.discountType')} placeholder="e.g., Festive Offer, Summer Sale" className={inputCls} />
              {errors.pricing?.discountType && <p className="text-red-500 text-xs mt-1">{errors.pricing.discountType.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Discount % <span className="text-gray-400 text-xs">(0–100)</span></label>
              <input type="number" min="0" max="100" {...register('pricing.discountPercentage')} placeholder="e.g., 25" className={inputCls} />
              {errors.pricing?.discountPercentage && <p className="text-red-500 text-xs mt-1">{errors.pricing.discountPercentage.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Discount Valid Until</label>
              <input type="date" {...register('pricing.discountValidUntil')} className={inputCls} />
              {errors.pricing?.discountValidUntil && <p className="text-red-500 text-xs mt-1">{errors.pricing.discountValidUntil.message}</p>}
            </div>

          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            SCHEDULE & LOGISTICS
        ══════════════════════════════════════════════════════════════ */}
        <Section title="📅 Schedule & Logistics (Optional)" isOpen={openSections.schedule} onToggle={() => toggleSection('schedule')}>
          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className={labelCls}>Start Date</label>
              <input type="date" {...register('schedule.startDate')} className={inputCls} />
              {errors.schedule?.startDate && <p className="text-red-500 text-xs mt-1">{errors.schedule.startDate.message}</p>}
            </div>

            <div>
              <label className={labelCls}>End Date</label>
              <input type="date" {...register('schedule.endDate')} className={inputCls} />
              {errors.schedule?.endDate && <p className="text-red-500 text-xs mt-1">{errors.schedule.endDate.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Enrollment Deadline</label>
              <input type="date" {...register('schedule.enrollmentDeadline')} className={inputCls} />
              {errors.schedule?.enrollmentDeadline && <p className="text-red-500 text-xs mt-1">{errors.schedule.enrollmentDeadline.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Class Timings</label>
              <input {...register('schedule.classTimings')} placeholder="e.g., 6:00 PM – 8:00 PM (Weekdays)" className={inputCls} />
              {errors.schedule?.classTimings && <p className="text-red-500 text-xs mt-1">{errors.schedule.classTimings.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Mode</label>
              <select {...register('schedule.mode')} className={inputCls}>
                <option value="">Select mode…</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {errors.schedule?.mode && <p className="text-red-500 text-xs mt-1">{errors.schedule.mode.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Duration</label>
              <input {...register('duration')} placeholder="e.g., 4 Weeks (24 days)" className={inputCls} />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Total Hours</label>
              <input type="number" min="0.5" step="0.5" {...register('totalHours')} placeholder="e.g., 48" className={inputCls} />
              {errors.totalHours && <p className="text-red-500 text-xs mt-1">{errors.totalHours.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Location</label>
              <input {...register('location')} placeholder="e.g., Pulchowk, Lalitpur" className={inputCls} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Status *</label>
              <select {...register('status')} className={inputCls}>
                <option value="">Select status…</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Enrolling Now">Enrolling Now</option>
                <option value="Full">Full</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Total Seats</label>
              <input type="number" min="0" step="1" {...register('seatsTotal')} placeholder="e.g., 30" className={inputCls} />
              {errors.seatsTotal && <p className="text-red-500 text-xs mt-1">{errors.seatsTotal.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Available Seats</label>
              <input type="number" min="0" step="1" {...register('seatsAvailable')} placeholder="e.g., 12" className={inputCls} />
              {errors.seatsAvailable && <p className="text-red-500 text-xs mt-1">{errors.seatsAvailable.message}</p>}
            </div>

          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            SEO
        ══════════════════════════════════════════════════════════════ */}
        <Section title="🔍 SEO Settings" isOpen={openSections.seo} onToggle={() => toggleSection('seo')}>
          <div className="space-y-5">

            <div>
              <label className={labelCls}>
                Meta Title * <span className="text-gray-400 font-normal text-xs">(30–60 chars)</span>
              </label>
              <input {...register('seo.metaTitle')} placeholder="Data Analytics with R Programming Course in Nepal" className={inputCls} />
              <p className={`text-xs mt-1 ${metaTitleLen < 30 || metaTitleLen > 60 ? 'text-red-400' : 'text-gray-400'}`}>
                {metaTitleLen} / 60
              </p>
              {errors.seo?.metaTitle && <p className="text-red-500 text-xs mt-1">{errors.seo.metaTitle.message}</p>}
            </div>

            <div>
              <label className={labelCls}>
                Meta Description * <span className="text-gray-400 font-normal text-xs">(120–160 chars)</span>
              </label>
              <textarea
                {...register('seo.metaDescription')}
                rows={3}
                placeholder="Learn R programming for data analysis in Kathmandu. Hands-on training with real projects…"
                className={inputCls}
              />
              <p className={`text-xs mt-1 ${metaDescLen < 120 || metaDescLen > 160 ? 'text-red-400' : 'text-gray-400'}`}>
                {metaDescLen} / 160
              </p>
              {errors.seo?.metaDescription && <p className="text-red-500 text-xs mt-1">{errors.seo.metaDescription.message}</p>}
            </div>

            <div>
              <label className={labelCls}>
                Keywords * <span className="text-gray-400 font-normal text-xs">(press Enter to add, min 3)</span>
              </label>
              <input
                type="text"
                placeholder="Type a keyword and press Enter"
                className={inputCls}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const v = e.target.value.trim();
                    if (v) { addKeyword(v); e.target.value = ''; }
                  }
                }}
              />
              {keywordFields.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywordFields.map((field, index) => (
                    <span key={field.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                      {watch(`seo.keywords.${index}`)}
                      <button type="button" onClick={() => removeKeyword(index)} className="ml-1 text-green-600 hover:text-green-800 font-bold leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
              <ArrayError error={errors.seo?.keywords} />
            </div>

            <div>
              <label className={labelCls}>Canonical URL <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
              <input {...register('seo.canonicalUrl')} placeholder="https://yoursite.com/courses/data-analytics-r" className={inputCls} />
              {errors.seo?.canonicalUrl && <p className="text-red-500 text-xs mt-1">{errors.seo.canonicalUrl.message}</p>}
            </div>

          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            MEDIA
        ══════════════════════════════════════════════════════════════ */}
        <Section title="🖼️ Media" isOpen={openSections.media} onToggle={() => toggleSection('media')}>
          <div className="space-y-4">
            <label className="block w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 text-center">
              <Upload size={22} className="text-gray-400 mx-auto mb-1" />
              <span className="text-sm text-gray-500">
                {watch('heroImage') ? 'Click to change image' : existingCourseData ? 'Click to upload a new image' : 'Click to upload hero image'}
              </span>
              <span className="block text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Max 5 MB · Recommended 1920×1280 px</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {imagePreview && (
              <div className="relative inline-block w-full">
                <img src={imagePreview} alt="Hero preview" className="w-full h-52 object-cover rounded-lg border border-gray-200" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            COURSE CONTENT
        ══════════════════════════════════════════════════════════════ */}
        <Section title="📝 Course Content" isOpen={openSections.content} onToggle={() => toggleSection('content')}>
          <div className="space-y-8">

            {/* Highlights */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls + ' mb-0'}>Course Highlights * <span className="text-gray-400 font-normal text-xs">(min 3)</span></label>
                <button type="button" onClick={() => addHighlight('')}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium">
                  <Plus size={14} /> Add
                </button>
              </div>
              {highlightFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input {...register(`highlights.${index}`)} placeholder="e.g., Hands-on projects with real datasets" className={inputCls} />
                  <button type="button" onClick={() => removeHighlight(index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
              <ArrayError error={errors.highlights} />
            </div>

            {/* Target Audience */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls + ' mb-0'}>Target Audience * <span className="text-gray-400 font-normal text-xs">(min 2)</span></label>
                <button type="button" onClick={() => addAudience('')}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium">
                  <Plus size={14} /> Add
                </button>
              </div>
              {audienceFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input {...register(`targetAudience.${index}`)} placeholder="e.g., University students & researchers" className={inputCls} />
                  <button type="button" onClick={() => removeAudience(index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
              <ArrayError error={errors.targetAudience} />
            </div>

            {/* Learning Outcomes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls + ' mb-0'}>Learning Outcomes * <span className="text-gray-400 font-normal text-xs">(min 4)</span></label>
                <button type="button" onClick={() => addOutcome('')}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium">
                  <Plus size={14} /> Add
                </button>
              </div>
              {outcomeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input {...register(`learningOutcomes.${index}`)} placeholder="e.g., Apply t-tests and ANOVA in real scenarios" className={inputCls} />
                  <button type="button" onClick={() => removeOutcome(index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
              <ArrayError error={errors.learningOutcomes} />
            </div>

            {/* Prerequisites */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls + ' mb-0'}>Prerequisites * <span className="text-gray-400 font-normal text-xs">(min 1)</span></label>
                <button type="button" onClick={() => addPrerequisite('')}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium">
                  <Plus size={14} /> Add
                </button>
              </div>
              {prerequisiteFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input {...register(`prerequisites.${index}`)} placeholder="e.g., Basic computer literacy" className={inputCls} />
                  <button type="button" onClick={() => removePrerequisite(index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
              <ArrayError error={errors.prerequisites} />
            </div>

          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            SYLLABUS
        ══════════════════════════════════════════════════════════════ */}
        <Section title="📚 Course Syllabus" isOpen={openSections.syllabus} onToggle={() => toggleSection('syllabus')}>
          <div className="space-y-4">

            <button
              type="button"
              onClick={() => addSyllabusWeek({ week: syllabusFields.length + 1, title: '', duration: '', topics: [''] })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Add Week
            </button>

            {syllabusFields.map((field, weekIndex) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Week {weekIndex + 1}</h3>
                  <button type="button" onClick={() => removeSyllabusWeek(weekIndex)}
                    className="p-1.5 text-red-400 hover:bg-red-100 rounded transition">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelCls}>Week Title *</label>
                    <input
                      {...register(`courseSyllabus.${weekIndex}.title`)}
                      placeholder="e.g., Installation & Getting Started"
                      className={inputCls}
                    />
                    {errors.courseSyllabus?.[weekIndex]?.title && (
                      <p className="text-red-500 text-xs mt-1">{errors.courseSyllabus[weekIndex].title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Duration *</label>
                    <input
                      {...register(`courseSyllabus.${weekIndex}.duration`)}
                      placeholder="e.g., 3 hours"
                      className={inputCls}
                    />
                    {errors.courseSyllabus?.[weekIndex]?.duration && (
                      <p className="text-red-500 text-xs mt-1">{errors.courseSyllabus[weekIndex].duration.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Topics * <span className="text-gray-400 font-normal text-xs">(one per line)</span></label>
                  <Controller
                    name={`courseSyllabus.${weekIndex}.topics`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        value={field.value?.join('\n') || ''}
                        onChange={(e) => field.onChange(e.target.value.split('\n').filter(t => t.trim()))}
                        rows={4}
                        className={inputCls + ' font-mono text-sm resize-y'}
                        placeholder={'Installing R and RStudio\nIntroduction to R environment\nBasic navigation in RStudio'}
                      />
                    )}
                  />
                  {errors.courseSyllabus?.[weekIndex]?.topics && (
                    <p className="text-red-500 text-xs mt-1">{errors.courseSyllabus[weekIndex].topics.message || errors.courseSyllabus[weekIndex].topics?.root?.message}</p>
                  )}
                </div>
              </div>
            ))}

            <ArrayError error={errors.courseSyllabus} />
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            STICKY FOOTER
        ══════════════════════════════════════════════════════════════ */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 py-4 flex gap-3 justify-end shadow-md">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (existingCourseData && !isDirty)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Saving…' : existingCourseData ? 'Update Course' : 'Create Course'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateCourseForm;



// import { useState, useEffect } from 'react';
// import { useForm, Controller, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Plus, Trash2, ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
// import TailwindRichTextEditor from '../../../utils/Tailwindrichtexteditor';

// // ============================================
// // ZOD VALIDATION SCHEMA - UPDATED WITH OPTIONAL FIELDS
// // ============================================
// const courseSchema = z.object({
//   // Basic Info
//   title: z.string().min(5, "Title must be at least 5 characters"),
//   subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
//   description: z.string().min(50, "Description must be at least 50 characters"),
//   heroImage: z.any().nullable(),
  
//   // Categorization
//   category: z.array(z.string()).min(1, "Select at least one category"),
//   tags: z.array(z.string()).min(1, "Add at least one tag"),
//   level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  
//   // Pricing - ALL OPTIONAL
//   pricing: z.object({             
//     currency: z.string().default("NPR"),
//     originalPrice: z.number().min(0).optional(),
//     regularPrice: z.number().min(0).optional(),
//     currentPrice: z.number().min(0).optional(),
//     discountType: z.string().optional(),
//     discountPercentage: z.number().min(0).max(100).optional(),
//     discountValidUntil: z.string().optional(),
//   }),
  
//   // Schedule - ALL OPTIONAL
//   schedule: z.object({
//     startDate: z.string().optional(),
//     endDate: z.string().optional(),
//     enrollmentDeadline: z.string().optional(),
//     classTimings: z.string().optional(),
//     mode: z.enum(["Online", "Offline", "Hybrid"]).optional(),
//   }),
  
//   duration: z.string().optional(),
//   totalHours: z.number().min(1).optional(),
//   location: z.string().optional(),
  
//   // Status
//   status: z.enum(["Coming Soon", "Enrolling Now", "Full", "Completed"]),
//   seatsTotal: z.number().min(0).optional(),
//   seatsAvailable: z.number().min(0).optional(),
  
//   // SEO
//   seo: z.object({
//     metaTitle: z.string().min(30).max(60, "Meta title should be 30-60 chars"),
//     metaDescription: z.string().min(120).max(160, "Meta description should be 120-160 chars"),
//     keywords: z.array(z.string()).min(3, "Add at least 3 keywords"),
//     canonicalUrl: z.string().url().optional().or(z.literal('')),
//   }),
  
//   // Arrays
//   highlights: z.array(z.string()).min(3, "Add at least 3 highlights"),
//   targetAudience: z.array(z.string()).min(2),
//   learningOutcomes: z.array(z.string()).min(4),
//   prerequisites: z.array(z.string()).min(1),
  
//   // Syllabus
//   courseSyllabus: z.array(z.object({
//     week: z.number(),
//     title: z.string(),
//     duration: z.string(),
//     topics: z.array(z.string()).min(1),
//   })).min(1),
// });

// // ============================================
// // INITIAL DEFAULT VALUES
// // ============================================
// const INITIAL_DEFAULTS = {
//   title: "",
//   subtitle: "",
//   description: "",
//   heroImage: null,
//   category: [],
//   tags: [],
//   level: "Beginner",
//   pricing: {
//     currency: "NPR",
//     originalPrice: undefined,
//     regularPrice: undefined,
//     currentPrice: undefined,
//     discountType: "",
//     discountPercentage: undefined,
//     discountValidUntil: "",
//   },
//   schedule: {
//     startDate: "",
//     endDate: "",
//     enrollmentDeadline: "",
//     classTimings: "",
//     mode: "Offline",
//   },
//   duration: "",
//   totalHours: undefined,
//   location: "",
//   status: "Coming Soon",
//   seatsTotal: undefined,
//   seatsAvailable: undefined,
//   highlights: [""],
//   targetAudience: [""],
//   learningOutcomes: [""],
//   prerequisites: [""],
//   courseSyllabus: [],
//   seo: {
//     metaTitle: "",
//     metaDescription: "",
//     keywords: [],
//     canonicalUrl: "",
//   },
// };

// // ============================================
// // SECTION COMPONENT
// // ============================================
// const Section = ({ title, isOpen, onToggle, children }) => (
//   <div className="border border-gray-200 rounded-lg mb-4 bg-white">
//     <button
//       type="button"
//       onClick={onToggle}
//       className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
//     >
//       <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//       {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//     </button>
//     {isOpen && <div className="px-6 pb-6">{children}</div>}
//   </div>
// );

// // ============================================
// // MAIN FORM COMPONENT
// // ============================================
// const CreateCourseForm = ({ existingCourse = null, onSubmit }) => {
//   const [openSections, setOpenSections] = useState({
//     basic: true,
//     categorization: false,
//     pricing: false,
//     schedule: false,
//     seo: false,
//     media: false,
//     content: false,
//     syllabus: false,
//   });
  
//   const [imagePreview, setImagePreview] = useState(null);
  
//   const { 
//     register, 
//     control, 
//     handleSubmit, 
//     formState: { errors, isSubmitting, isDirty },
//     watch,
//     setValue,
//     reset,
//   } = useForm({
//     resolver: zodResolver(courseSchema),
//     defaultValues: INITIAL_DEFAULTS,
//   });
  
//   // ============================================
//   // EDIT MODE: Reset form when existingCourse changes
//   // ============================================
//   useEffect(() => {
//     if (existingCourse) {
//       reset({ ...INITIAL_DEFAULTS, ...existingCourse, heroImage: null });
//       setImagePreview(
//         existingCourse.heroImage?.url || existingCourse.heroImageUrl || null
//       );
//     }
//   }, [existingCourse, reset]);
  
//   const handleFormSubmit = (data) => {
//     console.log("FINAL SUBMITTED COURSE DATA:", data);
//     onSubmit?.(data);
//   };

//   // ============================================
//   // FIELD ARRAYS
//   // ============================================
//   const { fields: highlightFields, append: addHighlight, remove: removeHighlight } = 
//     useFieldArray({ control, name: "highlights" });
  
//   const { fields: audienceFields, append: addAudience, remove: removeAudience } = 
//     useFieldArray({ control, name: "targetAudience" });
  
//   const { fields: outcomeFields, append: addOutcome, remove: removeOutcome } = 
//     useFieldArray({ control, name: "learningOutcomes" });
  
//   const { fields: prerequisiteFields, append: addPrerequisite, remove: removePrerequisite } = 
//     useFieldArray({ control, name: "prerequisites" });
  
//   const { fields: syllabusFields, append: addSyllabusWeek, remove: removeSyllabusWeek } = 
//     useFieldArray({ control, name: "courseSyllabus" });
  
//   const { fields: keywordFields, append: addKeyword, remove: removeKeyword } = 
//     useFieldArray({ control, name: "seo.keywords" });

//   const toggleSection = (section) => {
//     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   const categories = ["Analysis", "Coding", "AI", "Collection", "Writing", "Management and Modeling"];

//   // ============================================
//   // IMAGE HANDLERS
//   // ============================================
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
    
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file');
//       return;
//     }
    
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Image size should be less than 5MB');
//       return;
//     }
    
//     setValue('heroImage', file, { shouldDirty: true });
    
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImagePreview(null);
//     setValue('heroImage', null, { shouldDirty: true });
//   };

//   // ============================================
//   // TAGS HANDLERS
//   // ============================================
//   const tags = watch("tags") || [];
  
//   const addTag = (value) => {
//     const trimmedValue = value.trim();
//     if (trimmedValue && !tags.includes(trimmedValue)) {
//       setValue("tags", [...tags, trimmedValue], { shouldDirty: true });
//     }
//   };
  
//   const removeTag = (index) => {
//     setValue("tags", tags.filter((_, i) => i !== index), { shouldDirty: true });
//   };

//   // ============================================
//   // OPEN SECTIONS WITH ERRORS
//   // ============================================
//   const openSectionsWithErrors = (errors) => {
//     const newOpenSections = { ...openSections };
   
//     if (errors.title || errors.subtitle || errors.description) {
//       newOpenSections.basic = true;
//     }

//     if (errors.category || errors.tags || errors.level) {
//       newOpenSections.categorization = true;
//     }

//     if (errors.pricing) {
//       newOpenSections.pricing = true;
//     }

//     if (errors.schedule || errors.duration || errors.totalHours || errors.location) {
//       newOpenSections.schedule = true;
//     }

//     if (errors.seo) {
//       newOpenSections.seo = true;
//     }

//     if (errors.highlights || errors.targetAudience || errors.learningOutcomes || errors.prerequisites) {
//       newOpenSections.content = true;
//     }

//     if (errors.courseSyllabus) {
//       newOpenSections.syllabus = true;
//     }

//     setOpenSections(newOpenSections);
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           {existingCourse ? 'Edit Course' : 'Create New Course'}
//         </h1>
//         <p className="text-gray-600 mt-2">Fill in the details below to add a course</p>
//       </div>

//       <form onSubmit={handleSubmit(handleFormSubmit, (errors) => {
//         console.log("FORM ERRORS:", errors);
//         openSectionsWithErrors(errors);
//       })} className="space-y-4">
        
//         {/* BASIC INFO SECTION */}
//         <Section 
//           title="📋 Basic Information" 
//           isOpen={openSections.basic}
//           onToggle={() => toggleSection('basic')}
//         >
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Course Title *
//               </label>
//               <input
//                 {...register("title")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="e.g., Data Analytics using R Programming"
//               />
//               {errors.title && (
//                 <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Subtitle *
//               </label>
//               <input
//                 {...register("subtitle")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., Master Statistical Analysis and Data Visualization with R"
//               />
//               {errors.subtitle && (
//                 <p className="text-red-500 text-sm mt-1">{errors.subtitle.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Description (Rich Text) *
//               </label>
//               <Controller
//                 name="description"
//                 control={control}
//                 render={({ field }) => (
//                   <TailwindRichTextEditor
//                     value={field.value}
//                     onChange={field.onChange}
//                     placeholder="Write detailed course description with formatting, links, etc."
//                   />
//                 )}
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
//               )}
//             </div>
//           </div>
//         </Section>

//         {/* CATEGORIZATION SECTION */}
//         <Section 
//           title="🏷️ Categorization" 
//           isOpen={openSections.categorization}
//           onToggle={() => toggleSection('categorization')}
//         >
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Categories (select multiple) *
//               </label>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {categories.map(cat => (
//                   <label key={cat} className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       value={cat}
//                       {...register("category")}
//                       className="w-4 h-4 text-blue-600"
//                     />
//                     <span className="text-sm">{cat}</span>
//                   </label>
//                 ))}
//               </div>
//               {errors.category && (
//                 <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Level *
//               </label>
//               <select
//                 {...register("level")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="Beginner">Beginner</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Advanced">Advanced</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags (Press Enter to add) *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g., R Programming, Data Science"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     e.preventDefault();
//                     addTag(e.target.value);
//                     e.target.value = '';
//                   }
//                 }}
//               />
//               <div className="flex flex-wrap gap-2">
//                 {tags.map((tag, idx) => (
//                   <span 
//                     key={idx}
//                     className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={() => removeTag(idx)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               {errors.tags && (
//                 <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
//               )}
//             </div>
//           </div>
//         </Section>

//         {/* PRICING SECTION - ALL OPTIONAL */}
//         <Section 
//           title="💰 Pricing (Optional)" 
//           isOpen={openSections.pricing}
//           onToggle={() => toggleSection('pricing')}
//         >
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Original Price (crossed out)
//               </label>
//               <input
//                 type="number"
//                 {...register("pricing.originalPrice", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 25000"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Regular Price
//               </label>
//               <input
//                 type="number"
//                 {...register("pricing.regularPrice", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 20000"
//               />
//               {errors.pricing?.regularPrice && (
//                 <p className="text-red-500 text-sm mt-1">{errors.pricing.regularPrice.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Current Price (after discount)
//               </label>
//               <input
//                 type="number"
//                 {...register("pricing.currentPrice", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 15000"
//               />
//               {errors.pricing?.currentPrice && (
//                 <p className="text-red-500 text-sm mt-1">{errors.pricing.currentPrice.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Discount Type
//               </label>
//               <input
//                 {...register("pricing.discountType")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., Festive Offer, Summer Sale"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Discount Percentage
//               </label>
//               <input
//                 type="number"
//                 {...register("pricing.discountPercentage", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 25"
//                 max="100"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Discount Valid Until
//               </label>
//               <input
//                 type="date"
//                 {...register("pricing.discountValidUntil")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//           </div>
//         </Section>

//         {/* SCHEDULE SECTION - ALL OPTIONAL */}
//         <Section 
//           title="📅 Schedule & Logistics (Optional)" 
//           isOpen={openSections.schedule}
//           onToggle={() => toggleSection('schedule')}
//         >
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 {...register("schedule.startDate")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 {...register("schedule.endDate")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Enrollment Deadline
//               </label>
//               <input
//                 type="date"
//                 {...register("schedule.enrollmentDeadline")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Class Timings
//               </label>
//               <input
//                 {...register("schedule.classTimings")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 6:00 PM - 8:00 PM (Weekdays)"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mode
//               </label>
//               <select
//                 {...register("schedule.mode")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//               >
//                 <option value="">Select Mode</option>
//                 <option value="Online">Online</option>
//                 <option value="Offline">Offline</option>
//                 <option value="Hybrid">Hybrid</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Duration
//               </label>
//               <input
//                 {...register("duration")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 4 Weeks (24 days)"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Total Hours
//               </label>
//               <input
//                 type="number"
//                 {...register("totalHours", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 48"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Location
//               </label>
//               <input
//                 {...register("location")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., Pulchowk, Lalitpur"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Status *
//               </label>
//               <select
//                 {...register("status")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//               >
//                 <option value="Coming Soon">Coming Soon</option>
//                 <option value="Enrolling Now">Enrolling Now</option>
//                 <option value="Full">Full</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Total Seats
//               </label>
//               <input
//                 type="number"
//                 {...register("seatsTotal", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 30"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Available Seats
//               </label>
//               <input
//                 type="number"
//                 {...register("seatsAvailable", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="e.g., 12"
//               />
//             </div>
//           </div>
//         </Section>

//         {/* SEO SECTION */}
//         <Section 
//           title="🔍 SEO Settings" 
//           isOpen={openSections.seo}
//           onToggle={() => toggleSection('seo')}
//         >
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Meta Title (30-60 characters) *
//               </label>
//               <input
//                 {...register("seo.metaTitle")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="Data Analytics with R Programming Course in Nepal"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 {watch("seo.metaTitle")?.length || 0} / 60 characters
//               </p>
//               {errors.seo?.metaTitle && (
//                 <p className="text-red-500 text-sm mt-1">{errors.seo.metaTitle.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Meta Description (120-160 characters) *
//               </label>
//               <textarea
//                 {...register("seo.metaDescription")}
//                 rows={3}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="Learn R programming for data analysis in Kathmandu. Hands-on training with real projects."
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 {watch("seo.metaDescription")?.length || 0} / 160 characters
//               </p>
//               {errors.seo?.metaDescription && (
//                 <p className="text-red-500 text-sm mt-1">{errors.seo.metaDescription.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Keywords (Press Enter to add) *
//               </label>
//               <input
//                 type="text"
//                 placeholder="Type keyword and press Enter"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     e.preventDefault();
//                     const value = e.target.value.trim();
//                     if (value) {
//                       addKeyword(value);
//                       e.target.value = '';
//                     }
//                   }
//                 }}
//               />
//               <div className="flex flex-wrap gap-2">
//                 {keywordFields.map((field, index) => (
//                   <span 
//                     key={field.id}
//                     className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
//                   >
//                     {watch(`seo.keywords.${index}`)}
//                     <button
//                       type="button"
//                       onClick={() => removeKeyword(index)}
//                       className="text-green-600 hover:text-green-800"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               {errors.seo?.keywords?.root && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.seo.keywords.root.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Canonical URL (optional)
//               </label>
//               <input
//                 {...register("seo.canonicalUrl")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 placeholder="https://yoursite.com/courses/data-analytics-r"
//               />
//               {errors.seo?.canonicalUrl && (
//                 <p className="text-red-500 text-sm mt-1">{errors.seo.canonicalUrl.message}</p>
//               )}
//             </div>
//           </div>
//         </Section>

//         {/* MEDIA SECTION */}
//         <Section 
//           title="🖼️ Media" 
//           isOpen={openSections.media}
//           onToggle={() => toggleSection('media')}
//         >
//           <div className="space-y-6">
//             <label className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer flex items-center justify-center gap-2 bg-gray-50">
//               <Upload size={20} className="text-gray-600" />
//               <span className="text-sm text-gray-600">
//                 {watch("heroImage") ? 'Change Image' : (existingCourse ? 'Upload New Image' : 'Upload Image')}
//               </span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//             {imagePreview && (
//               <div className="relative">
//                 <img 
//                   src={imagePreview} 
//                   alt="Preview" 
//                   className="w-full h-48 object-cover rounded-lg border border-gray-200"
//                 />
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             )}
//             <p className="text-xs text-gray-500">
//               Recommended: 1920x1280px, Max 5MB
//             </p>
//           </div>
//         </Section>

//         {/* CONTENT SECTION */}
//         <Section 
//           title="📝 Course Content" 
//           isOpen={openSections.content}
//           onToggle={() => toggleSection('content')}
//         >
//           <div className="space-y-8">
//             {/* Highlights */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="text-sm font-medium text-gray-700">
//                   Course Highlights *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => addHighlight("")}
//                   className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
//                 >
//                   <Plus size={16} /> Add
//                 </button>
//               </div>
//               {highlightFields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2 mb-2">
//                   <input
//                     {...register(`highlights.${index}`)}
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
//                     placeholder="e.g., Hands-on experience with R and RStudio"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeHighlight(index)}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               ))}
//               {errors.highlights?.root && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.highlights.root.message}
//                 </p>
//               )}
//             </div>

//             {/* Target Audience */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="text-sm font-medium text-gray-700">
//                   Target Audience *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => addAudience("")}
//                   className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
//                 >
//                   <Plus size={16} /> Add
//                 </button>
//               </div>
//               {audienceFields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2 mb-2">
//                   <input
//                     {...register(`targetAudience.${index}`)}
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
//                     placeholder="e.g., University Students & Researchers"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeAudience(index)}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               ))}
//               {errors.targetAudience?.root && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.targetAudience.root.message}
//                 </p>
//               )}
//             </div>

//             {/* Learning Outcomes */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="text-sm font-medium text-gray-700">
//                   Learning Outcomes *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => addOutcome("")}
//                   className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
//                 >
//                   <Plus size={16} /> Add
//                 </button>
//               </div>
//               {outcomeFields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2 mb-2">
//                   <input
//                     {...register(`learningOutcomes.${index}`)}
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
//                     placeholder="e.g., Apply statistical techniques like t-test, ANOVA"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeOutcome(index)}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               ))}
//               {errors.learningOutcomes?.root && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.learningOutcomes.root.message}
//                 </p>
//               )}
//             </div>

//             {/* Prerequisites */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="text-sm font-medium text-gray-700">
//                   Prerequisites *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => addPrerequisite("")}
//                   className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
//                 >
//                   <Plus size={16} /> Add
//                 </button>
//               </div>
//               {prerequisiteFields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2 mb-2">
//                   <input
//                     {...register(`prerequisites.${index}`)}
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
//                     placeholder="e.g., Basic computer literacy"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removePrerequisite(index)}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               ))}
//               {errors.prerequisites?.root && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.prerequisites.root.message}
//                 </p>
//               )}
//             </div>
//           </div>
//         </Section>

//         {/* SYLLABUS SECTION */}
//         <Section 
//           title="📚 Course Syllabus" 
//           isOpen={openSections.syllabus}
//           onToggle={() => toggleSection('syllabus')}
//         >
//           <div className="space-y-4">
//             <button
//               type="button"
//               onClick={() => addSyllabusWeek({ 
//                 week: syllabusFields.length + 1, 
//                 title: "", 
//                 duration: "", 
//                 topics: [""] 
//               })}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//             >
//               <Plus size={18} /> Add Week
//             </button>

//             {syllabusFields.map((field, weekIndex) => (
//               <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold text-gray-800">Week {weekIndex + 1}</h3>
//                   <button
//                     type="button"
//                     onClick={() => removeSyllabusWeek(weekIndex)}
//                     className="text-red-500 hover:bg-red-100 p-2 rounded"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Week Title
//                     </label>
//                     <input
//                       {...register(`courseSyllabus.${weekIndex}.title`)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                       placeholder="e.g., Installation & Getting Started"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Duration
//                     </label>
//                     <input
//                       {...register(`courseSyllabus.${weekIndex}.duration`)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                       placeholder="e.g., Week 1"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Topics (one per line)
//                   </label>
//                   <Controller
//                     name={`courseSyllabus.${weekIndex}.topics`}
//                     control={control}
//                     render={({ field }) => (
//                       <textarea
//                         value={field.value?.join('\n') || ''}
//                         onChange={(e) => field.onChange(e.target.value.split('\n').filter(t => t.trim()))}
//                         rows={5}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
//                         placeholder="Installing R and RStudio&#10;Introduction to R environment&#10;Basic navigation in RStudio"
//                       />
//                     )}
//                   />
//                 </div>
//               </div>
//             ))}
//             {errors.courseSyllabus && (
//               <p className="text-red-500 text-sm mt-1">{errors.courseSyllabus.message}</p>
//             )}
//           </div>
//         </Section>

//         {/* SUBMIT BUTTON */}
//         <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 flex gap-4 justify-end">
//           <button
//             type="button"
//             onClick={() => reset()}
//             className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? 'Saving...' : (existingCourse ? 'Update Course' : 'Create Course')}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateCourseForm;
// //   jaha false cha tei value ans for  &&case tara jaha true true cha allways last
// //   jaha true cha tei value tara jaha false repeat thauma cha tya alwast last


