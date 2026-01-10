import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase,
  Calendar,
  Search,
  Filter,
  ChevronRight,
  Building,
  GraduationCap,
  Target,
  Heart,
  Award,
  Coffee,
  Wifi
} from 'lucide-react';

const CareersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const jobOpenings = [
   /*  {
      id: 1,
      title: "Senior Data Scientist",
      department: "Research & Analytics",
      type: "Full-time",
      location: "Pulchowk, Lalitpur",
      salary: "NPR 80,000 - 120,000",
      experience: "3-5 years",
      posted: "2 days ago",
      description: "Join our research team to develop advanced analytics solutions and lead data science projects for diverse clients.",
      requirements: [
        "Master's degree in Statistics, Data Science, or related field",
        "3+ years of experience in data analysis and machine learning",
        "Proficiency in Python, R, and SQL",
        "Experience with statistical modeling and data visualization"
      ],
      benefits: ["Health Insurance", "Performance Bonus", "Training Budget", "Flexible Hours"]
    },
    {
      id: 2,
      title: "Research Analyst",
      department: "Market Research",
      type: "Full-time",
      location: "Pulchowk, Lalitpur",
      salary: "NPR 45,000 - 65,000",
      experience: "1-3 years",
      posted: "5 days ago",
      description: "Conduct market research, analyze data trends, and prepare comprehensive reports for client decision-making.",
      requirements: [
        "Bachelor's degree in Economics, Statistics, or Business",
        "1+ years of experience in research or analytics",
        "Strong analytical and communication skills",
        "Knowledge of survey design and data collection methods"
      ],
      benefits: ["Health Insurance", "Training Programs", "Career Growth", "Team Events"]
    },
    {
      id: 3,
      title: "Training Coordinator",
      department: "Education",
      type: "Part-time",
      location: "Pulchowk, Lalitpur",
      salary: "NPR 35,000 - 50,000",
      experience: "2-4 years",
      posted: "1 week ago",
      description: "Design and coordinate training programs, manage educational content, and support student learning experiences.",
      requirements: [
        "Bachelor's degree in Education or related field",
        "2+ years of experience in training or education",
        "Excellent presentation and communication skills",
        "Experience with curriculum development"
      ],
      benefits: ["Flexible Schedule", "Training Budget", "Health Insurance", "Professional Development"]
    },
    {
      id: 4,
      title: "Junior Developer",
      department: "Technology",
      type: "Full-time",
      location: "Pulchowk, Lalitpur",
      salary: "NPR 40,000 - 60,000",
      experience: "0-2 years",
      posted: "3 days ago",
      description: "Develop and maintain web applications, work with data visualization tools, and support technical infrastructure.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "Knowledge of React, Node.js, and database systems",
        "Understanding of data visualization libraries",
        "Strong problem-solving skills"
      ],
      benefits: ["Mentorship Program", "Health Insurance", "Learning Budget", "Modern Equipment"]
    } */
  ];

  const departments = ['All', 'Research & Analytics', 'Market Research', 'Education', 'Technology'];
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract'];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesType = selectedType === 'All' || job.type === selectedType;

    return matchesSearch && matchesDepartment && matchesType;
  });

  const benefits = [
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive health insurance and wellness programs" },
    { icon: GraduationCap, title: "Learning & Development", description: "Continuous learning opportunities and skill development" },
    { icon: Coffee, title: "Work-Life Balance", description: "Flexible working hours and supportive environment" },
    { icon: Award, title: "Recognition", description: "Performance-based rewards and career advancement" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    

        {/* Job Listings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>
          
          {filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-8 group hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {job.title}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {job.department}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          job.type === 'Full-time' 
                            ? 'bg-green-100 text-green-800' 
                            : job.type === 'Part-time'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {job.type}
                        </span>
                      </div>

                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Job Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2 text-blue-500" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign size={16} className="mr-2 text-green-500" />
                          <span className="text-sm">{job.salary}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Briefcase size={16} className="mr-2 text-purple-500" />
                          <span className="text-sm">{job.experience}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2 text-orange-500" />
                          <span className="text-sm">Posted {job.posted}</span>
                        </div>
                      </div>

                      {/* Requirements Preview */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Requirements:</h4>
                        <ul className="text-gray-600 text-sm space-y-1">
                          {job.requirements.slice(0, 2).map((req, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                          {job.requirements.length > 2 && (
                            <li className="text-blue-600 font-medium text-sm">
                              +{job.requirements.length - 2} more requirements
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex flex-col gap-3 lg:ml-6">
                      <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                        Apply Now
                        <ChevronRight size={16} className="ml-2" />
                      </button>
                      <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-300 mb-6">
                <Search size={80} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                No positions found
              </h3>
              <p className="text-gray-500 text-lg mb-8">
                please check back later for new opportunities.❤️
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareersPage;