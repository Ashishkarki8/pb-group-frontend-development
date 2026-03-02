
import React, { useState, useEffect } from 'react';
import { useModal } from '../../hooks/useModal.js';
import { useConfirm } from '../../hooks/useConfirm.js';
import {
  useAllServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useDebounce, // ✅ Import debounce hook
} from '../../hooks/useService.js';
import {
  LayoutGrid, Plus, Search, Edit2, Trash2, Eye, EyeOff,
  Loader2,
  BarChart3,
  Smartphone,
  TrendingUp,
  Monitor,
  Grid3x3,
  GraduationCap
} from 'lucide-react';
import CreateServiceForm from '../../components/forms/CreateServiceForm.jsx';

// Icon mapping helper
const getIconComponent = (iconName) => {
  const icons = {
    BarChart3: BarChart3,
    Smartphone: Smartphone,
    TrendingUp: TrendingUp,
    Monitor: Monitor,
    Grid3x3: Grid3x3,
    GraduationCap: GraduationCap
  };
  return icons[iconName] || BarChart3;
};

const ServiceManagement = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [searchInput, setSearchInput] = useState(''); // ✅ Raw input state
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;
  
  // ✅ Debounced search value (500ms delay)
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const { openModal, closeModal } = useModal();
  const { confirm } = useConfirm();

  // ============================================
  // REACT QUERY HOOKS
  // ============================================
  
  // Fetch all services with debounced search
  const { data: servicesData, isLoading, isError, error } = useAllServices({ 
    page, 
    limit, 
    status: statusFilter, 
    search: debouncedSearch // ✅ Use debounced value
  });

  // Mutations
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // Extract data
  const services = servicesData?.services || [];
  const pagination = servicesData?.pagination || {};

  // ============================================
  // EFFECTS - Auto reset page when filters change
  // ============================================
  
  // ✅ Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleCreateService = () => {
    openModal(
      <CreateServiceForm 
        onClose={closeModal}
        onSubmit={handleServiceCreate}
      />,
      'Create New Service',
      'lg'
    );
  };

  const handleEditService = (service) => {
    openModal(
      <CreateServiceForm 
        onClose={closeModal}
        onSubmit={handleServiceUpdate}
        editingService={service}
      />,
      'Edit Service',
      'lg'
    );
  };

  /**
   * ✅ Create handler - receives service data
   */
  const handleServiceCreate = async (serviceData) => {
    try {
      await createMutation.mutateAsync(serviceData);
      closeModal();
    } catch (error) {
      // Error already handled by mutation
      console.error('Create service error:', error);
    }
  };

  /**
   * ✅ Update handler - receives service ID and data
   */
  const handleServiceUpdate = async (serviceId, serviceData) => {
    try {
      await updateMutation.mutateAsync({ serviceId, serviceData });
      closeModal();
    } catch (error) {
      // Error already handled by mutation
      console.error('Update service error:', error);
    }
  };

  /**
   * Delete handler with confirmation
   */
  const handleDeleteService = async (serviceId) => {
    const result = await confirm({
      title: 'Delete Service?',
      message: 'This action cannot be undone. The service will be permanently deleted.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (result) {
      try {
        await deleteMutation.mutateAsync(serviceId);
      } catch (error) {
        // Error already handled by mutation
        console.error('Delete service error:', error);
      }
    }
  };

  /**
   * Pagination handler
   */
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (isLoading && page === 1) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <LayoutGrid size={28} />
            <div>
              <h2 className="text-2xl font-bold">Service Management</h2>
              <p className="text-blue-100">Loading services...</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <LayoutGrid size={28} />
            <div>
              <h2 className="text-2xl font-bold">Service Management</h2>
              <p className="text-blue-100">Error loading services</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 font-medium">Failed to load services</p>
          <p className="text-red-600 text-sm mt-2">{error?.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LayoutGrid size={28} />
            <div>
              <h2 className="text-2xl font-bold">Service Management</h2>
              <p className="text-blue-100">
                Manage services and offerings for your website
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateService}
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            Create Service
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchInput} // ✅ Use raw input state
                onChange={(e) => setSearchInput(e.target.value)} // ✅ Update immediately for UX
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* ✅ Show loading indicator when debouncing */}
              {searchInput !== debouncedSearch && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 size={16} className="text-gray-400 animate-spin" />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Grid */}
      {isLoading && page > 1 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => {
            const IconComponent = getIconComponent(service.iconName);
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === service._id;
            
            return (
              <div 
                key={service._id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                  isDeleting ? 'opacity-50' : ''
                } ${service.__optimistic ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
                  {service.heroImage?.url ? (
                    <img 
                      src={service.heroImage.url} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <IconComponent size={40} className="text-white" />
                    </div>
                  )}
                  {service.__optimistic && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Uploading...
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <div className="flex items-center gap-1">
                      {service.isPublished ? (
                        <Eye size={18} className="text-green-600" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.shortDescription}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditService(service)}
                      disabled={isDeleting || service.__optimistic}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      disabled={isDeleting || service.__optimistic}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {services.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <LayoutGrid size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No services found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchInput || statusFilter ? 'Try adjusting your filters' : 'Create your first service to get started'}
          </p>
          {!searchInput && !statusFilter && (
            <button
              onClick={handleCreateService}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Service
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {services.length} of {pagination.totalServices} services
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {[...Array(pagination.totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                // Show first, last, current, and adjacent pages
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return <span key={pageNum} className="px-2 py-2">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;


"services": [
            {
                "title": "Research Services",
                "slug": "research-services",
                "subtitle": "Expert research services using qualitative and quantitative approaches. Drive growth with data-driven insights and expert analysis.",
                "cardDescription": "Expert research services using qualitative and quantitative approaches to uncover actionable insights and market trends, helping businesses make informed decisions and stay ahead in a competitive landscape.\r\n\r\nnew text from another page",
                "description": "Our research services combine advanced methodologies and deep industry expertise to deliver actionable insights that drive business growth. We specialize in both qualitative and quantitative research, offering robust data collection, analysis, and tailored solutions that address each client's unique goals. From market and consumer studies to impact assessments, our experienced team ensures precision, transparency, and measurable results at every stage. With a commitment to excellence and industry best practices, we empower organizations to make informed decisions, enhance performance, and gain a competitive edge in their markets.",
                "iconName": "BarChart3",
                "heroImage": {
                    "url": "https://res.cloudinary.com/dakiagw0h/image/upload/v1769708129/pbgroup/services/active/research-services.webp",
                    "publicId": "pbgroup/services/active/research-services",
                    "width": 1920,
                    "height": 1280,
                    "format": "webp",
                    "size": 117990
                },
                "researchTypes": [
                    "Market Research and Assessment Survey",
                    "Consumer Behavior and Satisfaction Survey",
                    "Brand Equity and Performance Survey"
                ],
                "isPublished": true,
                "showOnHomepage": true,
                "displayOrder": 1,
                "seo": {
                    "metaTitle": "research service",
                    "metaDescription": "research service",
                    "metaKeywords": [
                        "analysis",
                        "research",
                        "services",
                        "pbgroup"
                    ]
                },
                
            }
        ]



        [
  {
    "title": "Research Services",
    "slug": "research-services",
    "subtitle": "Expert research services using qualitative and quantitative approaches. Drive growth with data-driven insights and expert analysis.",
    "cardDescription": "Expert research services using qualitative and quantitative approaches to uncover actionable insights and market trends, helping businesses make informed decisions and stay ahead in a competitive landscape.",
    "description": "Our research services combine advanced methodologies and deep industry expertise to deliver actionable insights that drive business growth. We specialize in both qualitative and quantitative research, offering robust data collection, analysis, and tailored solutions that address each client's unique goals. From market and consumer studies to impact assessments, our experienced team ensures precision, transparency, and measurable results at every stage.",
    "iconName": "BarChart3",
    "heroImage": {
      "url": "https://res.cloudinary.com/dakiagw0h/image/upload/v1769708129/pbgroup/services/active/research-services.webp",
      "publicId": "pbgroup/services/active/research-services",
      "width": 1920,
      "height": 1280,
      "format": "webp",
      "size": 117990
    },
    "researchTypes": [
      "Market Research and Assessment Survey",
      "Consumer Behavior and Satisfaction Survey",
      "Brand Equity and Performance Survey",
      "Pricing Analysis and Assessment Survey",
      "Market Segmentation and Consumer Profiling Survey",
      "Feasibility Study Survey",
      "Baseline, Midline, and Endline Survey",
      "Political and Opinion Survey",
      "Monitoring and Evaluation (M&E) Survey",
      "Impact Assessment Survey",
      "Online Survey",
      "Project Development and Design Survey"
    ],
    "isPublished": true,
    "showOnHomepage": true,
    "displayOrder": 1,
    "seo": {
      "metaTitle": "Research Services | Data-Driven Insights",
      "metaDescription": "Professional research services delivering reliable qualitative and quantitative insights to support strategic decision-making and sustainable growth.",
      "metaKeywords": ["research", "market research", "survey", "data analysis", "pbgroup"]
    }
  },

  {
    "title": "Survey Software & Apps",
    "slug": "survey-software-apps",
    "subtitle": "Smart survey solutions for real-time data collection and interactive insights.",
    "cardDescription": "Advanced survey software and mobile app solutions for real-time data collection, easy download, and interactive dashboards.",
    "description": "Our survey software and mobile applications enable seamless, secure, and real-time data collection across devices. With offline functionality, GPS tracking, smart validation, and powerful dashboards, organizations can manage surveys efficiently and transform raw responses into actionable insights.",
    "iconName": "Smartphone",
    "heroImage": {
      "url": "",
      "publicId": "",
      "width": 0,
      "height": 0,
      "format": "",
      "size": 0
    },
    "researchTypes": [
      "Multi-language Support",
      "Smart Validation & Skip Logic",
      "GPS & Map Tracking",
      "Offline & Online Data Collection",
      "Easy Export to SPSS, Stata, Excel",
      "Secure Cloud Storage",
      "CAPI, CATI, CAWI, FGD & KII Support"
    ],
    "isPublished": true,
    "showOnHomepage": true,
    "displayOrder": 2,
    "seo": {
      "metaTitle": "Survey Software & Data Collection Apps",
      "metaDescription": "Robust survey software and mobile apps for accurate, secure, and scalable data collection with real-time reporting.",
      "metaKeywords": ["survey software", "data collection", "mobile survey", "CAPI", "CAWI"]
    }
  },

  {
    "title": "Data Analytics Service",
    "slug": "data-analytics-service",
    "subtitle": "Turn raw data into actionable insights with advanced analytics and visualization.",
    "cardDescription": "Data analytics services designed to transform raw data into meaningful insights through advanced visualization and modeling.",
    "description": "Our data analytics services help organizations unlock value from complex datasets using modern statistical, machine learning, and visualization techniques. We deliver dashboards, predictive models, and evidence-based insights that support smarter, faster decision-making.",
    "iconName": "LineChart",
    "heroImage": {
      "url": "",
      "publicId": "",
      "width": 0,
      "height": 0,
      "format": "",
      "size": 0
    },
    "researchTypes": [
      "Descriptive & Inferential Statistics",
      "Machine Learning & AI Models",
      "Data Cleaning & Validation",
      "Dashboard & Visualization",
      "GIS & Spatial Analysis",
      "Survey & Research Data Analysis"
    ],
    "isPublished": true,
    "showOnHomepage": true,
    "displayOrder": 3,
    "seo": {
      "metaTitle": "Data Analytics & Visualization Services",
      "metaDescription": "Advanced data analytics services delivering predictive insights, dashboards, and AI-driven analysis for business growth.",
      "metaKeywords": ["data analytics", "machine learning", "dashboard", "business intelligence"]
    }
  },

  {
    "title": "ICT Solutions",
    "slug": "ict-solutions",
    "subtitle": "Innovative ICT solutions that streamline operations and enable digital transformation.",
    "cardDescription": "Comprehensive ICT solutions empowering businesses with smart, scalable, and secure technology systems.",
    "description": "We provide end-to-end ICT solutions including software development, cloud services, cybersecurity, and system integration to modernize operations and drive digital transformation.",
    "iconName": "MonitorSmartphone",
    "heroImage": {
      "url": "",
      "publicId": "",
      "width": 0,
      "height": 0,
      "format": "",
      "size": 0
    },
    "researchTypes": [
      "Web & Software Development",
      "Cloud Services & IT Infrastructure",
      "System Integration",
      "Cybersecurity Solutions",
      "IT Support & Maintenance"
    ],
    "isPublished": true,
    "showOnHomepage": true,
    "displayOrder": 4,
    "seo": {
      "metaTitle": "ICT Solutions & Digital Transformation",
      "metaDescription": "Reliable ICT solutions including software, cloud, and cybersecurity services to support modern business operations.",
      "metaKeywords": ["ICT solutions", "software development", "cloud services", "cybersecurity"]
    }
  },

  {
    "title": "Business Dashboard",
    "slug": "business-dashboard",
    "subtitle": "Interactive dashboards for real-time performance monitoring and KPI tracking.",
    "cardDescription": "Business dashboards with real-time KPIs, analytics, and automated reporting for smarter decisions.",
    "description": "Our business dashboards provide real-time visibility into organizational performance through intuitive visuals, KPI tracking, and automated reports, enabling leaders to make informed strategic decisions.",
    "iconName": "LayoutDashboard",
    "heroImage": {
      "url": "",
      "publicId": "",
      "width": 0,
      "height": 0,
      "format": "",
      "size": 0
    },
    "researchTypes": [
      "KPI Monitoring",
      "Automated Reporting",
      "Financial & Operational Dashboards",
      "Role-Based Access Control"
    ],
    "isPublished": true,
    "showOnHomepage": true,
    "displayOrder": 5,
    "seo": {
      "metaTitle": "Business Intelligence Dashboards",
      "metaDescription": "Interactive business dashboards for KPI tracking, performance monitoring, and real-time analytics.",
      "metaKeywords": ["business dashboard", "KPI", "business intelligence", "analytics"]
    }
  },

  {
    "title": "Capacity Building Training",
    "slug": "capacity-building-training",
    "subtitle": "Tailored training programs that enhance technical, analytical, and leadership skills.",
    "cardDescription": "Expert-led capacity building training programs designed to strengthen skills and organizational performance.",
    "description": "Our capacity-building training programs empower professionals and organizations with practical skills in data analytics, ICT, leadership, and digital tools through hands-on, expert-led learning.",
    "iconName": "GraduationCap",
    "heroImage": {
      "url": "",
      "publicId": "",
      "width": 0,
      "height": 0,
      "format": "",
      "size": 0
    },
    "researchTypes": [
      "Data Analytics Training",
      "ICT & IT Skills Development",
      "Leadership & HR Training",
      "GIS & Digital Tools Training",
      "Corporate & Individual Programs"
    ],
    "isPublished": true,
    "showOnHomepage": true,
    "displayOrder": 6,
    "seo": {
      "metaTitle": "Capacity Building & Professional Training",
      "metaDescription": "Professional capacity-building training programs focused on analytics, ICT, leadership, and workforce development.",
      "metaKeywords": ["capacity building", "training", "data analytics training", "ICT training"]
    }
  }
]
