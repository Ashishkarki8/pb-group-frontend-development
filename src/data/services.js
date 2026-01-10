import {
  Award,
  BarChart3,
  Brain,
  BrainCircuit,
  Clock,
  Cpu,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  MapPin,
  MonitorSmartphone,
  Shield,
  Smartphone,
  TrendingUp,
  Users
} from "lucide-react";

export const services = [
  {
    id: 1,
    title: "Research Services",
    slug: "research-services",
    shortDescription:
      "Expert research services using qualitative and quantitative approaches to uncover actionable insights and market trends, helping businesses make informed decisions and stay ahead in a competitive landscape.",
    subtitle:
      "Expert research services using qualitative and quantitative approaches. Drive growth with data-driven insights and expert analysis.",
    description:
      "Our research services combine advanced methodologies and deep industry expertise to deliver actionable insights that drive business growth. We specialize in both qualitative and quantitative research, offering robust data collection, analysis, and tailored solutions that address each client's unique goals. From market and consumer studies to impact assessments, our experienced team ensures precision, transparency, and measurable results at every stage. With a commitment to excellence and industry best practices, we empower organizations to make informed decisions, enhance performance, and gain a competitive edge in their markets.",
    
    // Bullet points for different research survey types
    researchTypes: [
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
      
    icon: BarChart3,
    color: "from-blue-600 to-blue-800",
    heroImage: "/service/research-service.webp",
    width: 1920,
    height: 1280,
  serviceFeatures: [
  {
    icon: Users,
    title: "Qualitative & Quantitative Approach",
    desc: "Blend of interviews, focus groups, and surveys for complete market insights.",
  },
  {
    icon: MapPin,
    title: "Digital Tools & GIS Based Field Panning",
    desc: "Use of mapping tools and digital systems for accurate data collection.",
  },
  {
    icon: LineChart,
    title: "Statistical Analytics & Detailed Reporting",
    desc: "Detailed analysis with clear visuals and actionable recommendations.",
  },
  {
    icon: Clock,
    title: "Affordable Pricing & Timely Services",
    desc: "High-quality research solutions delivered on time and within budget.",
  },
]

  },
 {
  id: 2,
  title: "Survey Software & Apps",
  slug: "survey-software-apps",
  shortDescription:
    "Advanced survey software and mobile app solutions for real-time data collection, easy download, and interactive dashboards, turning information into actionable insights for smarter business decisions.",
  subtitle:
    "Smart survey solutions for real-time data collection and interactive insights.",
  
  description:
    "Our survey software and mobile applications are built for seamless, real-time data collection across any device or environment. With offline capabilities, GPS tracking, and multi-language support, our tools simplify large-scale surveys while ensuring accuracy and reliability. Featuring advanced validation, secure data storage, and flexible data export options, we empower organizations to gather and analyze responses efficiently. From setup to reporting, our expert team provides end-to-end support, ensuring every project is executed smoothly and delivers meaningful, data-driven insights.",

  // Key functional highlights of the survey tools
  researchTypes: [
    "Multi-language Support – Works in Nepali, English, and other local languages.",
    "Smart Validation & Skip Options – Shows only relevant questions for faster and cleaner data collection.",
    "GPS & Map Tracking – Records exact survey locations on the map.",
    "Easy Data Export – Export results directly to SPSS, Stata, or Excel.",
    "Secure & Reliable (24×7) – Safe data storage with round-the-clock access.",
    "User Roles & Hierarchy – Separate access levels for Head Office, Supervisors, and Enumerators.",
    "Mobile App & Web Access – Collect data online or offline using a phone or computer.",
    "Training & Integration Support – Full assistance for setup and operation.",
    "Text, GPS, Audio, Image, and Flexible Data Types.",
    "Suitable for CAPI, CATI, CAWI, FGD, and KII surveys."
  ],

  icon: Smartphone,
  color: "from-sky-400 to-sky-800",
  heroImage: "/service/Survey-Software.webp",
  width: 1920,
  height: 1280,

  serviceFeatures: [
    {
      icon: Shield,
      title: "24×7 Reliable & Secure Service",
      desc: "Round-the-clock data protection and secure cloud storage for all survey activities.",
    },
    {
      icon: FileText,
      title: "Project-Based Subscription",
      desc: "Flexible pricing plans tailored to specific research projects and timelines.",
    },
    {
      icon: BarChart3,
      title: "Monthly & Annual Subscription",
      desc: "Cost-effective subscription models to match your organization’s needs.",
    },
    {
      icon: LayoutDashboard,
      title: "Reporting Dashboard",
      desc: "Interactive dashboard for real-time monitoring, analytics, and data visualization.",
    },
  ],
},

  {
  id: 3,
  title: "Data Analytics Service",
  slug: "data-analytics-service",
  shortDescription:
    "Data analytics services designed to transform raw data into meaningful insights through advanced visualization, machine learning, and expert-driven reporting.",
  subtitle:
    "Turn raw data into actionable insights with advanced analytics and visualization.",

  description:
    "Our data analytics services help organizations unlock the true potential of their data. From data cleaning to predictive modeling, we transform complex information into clear, actionable insights. Using modern analytical tools and AI-driven techniques, we design intuitive dashboards, build custom models, and provide evidence-based recommendations that support informed decision-making. Our experienced team ensures every project is executed with precision, transparency, and measurable impact — empowering businesses to grow, innovate, and stay ahead in a data-driven world.",

  // Core analytics capabilities
  researchTypes: [
    "All Types of Data – We analyze research, academic, social, business, and corporate data — both primary and secondary.",
    "Advanced Tools – Use of SPSS, Python, R, Power BI, Stata, Tableau, NVivo, Qualtrics, and other analytical platforms.",
    "Descriptive & Inferential Statistics – Summarize, compare, and interpret data with strong statistical accuracy.",
    "Machine Learning & AI Integration – Use predictive models and AI tools for trend detection and smart decision-making.",
    "Data Cleaning & Preparation – Ensure accuracy and consistency through proper collection, cleaning, and validation.",
    "Survey & Research Analysis – Perform quantitative and qualitative data analysis with clear, evidence-based findings.",
    "Visualization & Dashboards – Present insights through interactive charts, graphs, and dashboards using Power BI and Tableau.",
    "Market & Business Insights – Convert complex data into simple insights for growth and performance improvement.",
    "GIS & Spatial Analysis – Combine data with maps for regional and location-based insights.",
    "Training & Consultation – Provide expert training, integration, and ongoing data support.",
  ],

  icon: LineChart,
  color: "from-blue-400 to-blue-800",
  heroImage: "/service/Data-Analytics.webp",
  width: 1920,
  height: 1097,

  serviceFeatures: [
    {
      icon: Cpu,
      title: "Modern Data Analytics Tools",
      desc: "Advanced platforms like Power BI, Python, R, and Tableau for precise and efficient analytics.",
    },
    {
      icon: BrainCircuit,
      title: "Statistical, Machine Learning & AI Approach",
      desc: "Integrating advanced statistical techniques and AI-driven methods for accurate forecasting and trend analysis.",
    },
    {
      icon: Users,
      title: "Experienced Expert Team",
      desc: "A decade-long track record of delivering insightful analytics through domain expertise and best practices.",
    },
    {
      icon: Clock,
      title: "Affordable, Reliable & Timely Service",
      desc: "High-quality analytics delivered on schedule with transparent communication and competitive pricing.",
    },
  ],
},

  {
    id: 4,
    title: "ICT Solutions",
    slug: "ict-solutions",
    shortDescription:
      "Comprehensive ICT Solutions that empower businesses with smart technology, streamlined operations, and innovative tools for growth, efficiency, and success.",
    subtitle:
      "Innovative ICT solutions that streamline operations and enable digital transformation.",
    description:
      "We deliver comprehensive ICT solutions to help organizations modernize and thrive in the digital era. From custom software development and system integration to IT support and cloud services, we design scalable solutions tailored to your needs. Our approach ensures seamless operations, enhanced productivity, and sustainable growth powered by technology.",
    icon: MonitorSmartphone,
    color: "from-blue-400 to-blue-800",
    heroImage: "/service/Ict-Solution.webp",
    width: 900,
    height: 500,
     researchTypes: [
      "Web & Software Development – Build responsive websites, applications, and custom software solutions.",
    "Digital Marketing & SEO – Improve online visibility, engagement, and brand performance.",
    "Cloud Services & IT Infrastructure – Reliable hosting, storage, and network optimization.",
    "System Integration – Connect and streamline software, hardware, and network systems.",
    "Cybersecurity – Protect data and networks with advanced security solutions.",
    "IT Support & Maintenance – Continuous technical assistance to ensure smooth operations.",
    "Mobile & Desktop Applications – Design and deploy cross-platform applications.",
    "Technology Consulting – Expert strategies for selecting and implementing digital solutions.",
    ],
   serviceFeatures: [
    {
      icon: LayoutDashboard,
      title: "Web & Software Development",
      desc: "Create modern websites, business applications, and custom software solutions.",
    },
    {
      icon: BarChart3,
      title: "Digital Marketing & SEO",
      desc: "Enhance your online visibility, brand reach, and digital engagement.",
    },
    {
      icon: Shield,
      title: "Cybersecurity & Data Protection",
      desc: "Safeguard your digital assets with advanced security protocols and monitoring.",
    },
    {
      icon: MonitorSmartphone,
      title: "Cloud & IT Infrastructure",
      desc: "Optimize performance and scalability through reliable cloud and network services.",
    },
  ],
  },
  {
    id: 5,
    title: "Business Dashboard",
    slug: "business-dashboard",
    shortDescription:
      "Our business management analytics provide comprehensive dashboards, KPI tracking, and predictive models that help you monitor performance, identify opportunities, and make informed decisions.",
    subtitle:
      "Interactive dashboards for real-time performance monitoring and KPI tracking.",
    description:
      "Our business dashboards provide organizations with a 360° view of performance through visual reports, KPI tracking, and predictive analytics. Designed for leaders and managers, these dashboards simplify complex datasets into clear, actionable visuals. Whether it's monitoring financials, operations, or customer engagement, our solutions support better, faster decision-making.",
    icon: LayoutDashboard,
    color: "from-sky-400 to-sky-800",
    heroImage: "/service/business-dashboard.webp",
    width: 1920,
    height: 1514,
    serviceFeatures: [
      {
        icon: BarChart3,
        title: "KPI Tracking",
        desc: "Monitor critical business metrics in real time across departments and goals.",
      },
      {
        icon: LineChart,
        title: "Data Visualization",
        desc: "Simplify complex datasets with engaging and interactive visual dashboards.",
      },
      {
        icon: FileText,
        title: "Automated Reporting",
        desc: "Get instant, scheduled, or triggered performance reports delivered automatically.",
      },
      {
        icon: Shield,
        title: "Access Control",
        desc: "Ensure secure data visibility and dashboard sharing across authorized teams.",
      },
    ],
  },
{
  id: 6,
  title: "Capacity Building Training",
  slug: "capacity-building-training",
  shortDescription:
    "Empowering individuals and organizations through expert-led training in data analytics, ICT, leadership, HR, and soft skills to drive sustainable growth and excellence.",
  subtitle:
    "Tailored training programs that enhance technical, analytical, and leadership skills.",

  description:
    "Our capacity-building training programs are designed to empower individuals and organizations with the knowledge and skills needed for sustainable success. We provide hands-on, expert-led sessions covering data analytics, ICT, HR, leadership, and soft skills — ensuring participants gain both technical mastery and practical insight. Through customized programs and real-world learning approaches, we help professionals and teams enhance their capabilities, boost productivity, and achieve measurable growth. Offered online and onsite from Pulchowk, Lalitpur, our training combines flexibility, quality, and real-world relevance to help you stay ahead in today’s competitive environment.",

  // Training modules / topics included
  researchTypes: [
    "Data Analysis using Python – Advanced data manipulation, visualization, and analytics.",
    "Data Analysis using R – Statistical modeling and insightful visualizations.",
    "Data Analysis using SPSS – Efficient research-based statistical analysis.",
    "Data Analysis using STATA – Econometric and statistical techniques with confidence.",
    "Data Analysis using PowerBI – Interactive dashboards and business insights.",
    "Artificial Intelligence & Machine Learning – Predictive modeling and automation.",
    "Digital Marketing in Kathmandu, Nepal – SEO, social media strategies, and analytics.",
    "GIS & GPS using ArcGIS in Kathmandu, Nepal – Spatial data analysis and professional mapping.",
    "Data Collection Tools – Survey Solutions, KOBO, ODK for effective research data management.",
    "Scientific Writing in Kathmandu, Nepal – Research papers, reports, and publication skills.",
    "Web Development in Kathmandu, Nepal – Design and develop modern websites.",
    "IT Training in Kathmandu, Nepal – Computer fundamentals, networking, software, and IT problem-solving.",
    "HR Training in Kathmandu, Nepal – Human resource management, recruitment, and workplace skills."
  ],

  icon: GraduationCap,
  color: "from-blue-600 to-blue-800",
  heroImage: "/service/Capacity-Building-Training.webp",
  width: 5760,
  height: 3840,

  serviceFeatures: [
    {
      icon: Users,
      title: "Corporate & Individual Training",
      desc: "Customized learning experiences designed for both organizations and individual professionals.",
    },
    {
      icon: MonitorSmartphone,
      title: "Online & Onsite Learning Options",
      desc: "Flexible training modes — attend virtually or join our in-person sessions in Pulchowk, Lalitpur.",
    },
    {
      icon: Brain,
      title: "Hands-on & Practical Learning",
      desc: "Interactive sessions focused on real-world applications, case studies, and project-based exercises.",
    },
    {
      icon: Award,
      title: "Expert Mentorship & Certification",
      desc: "Led by industry professionals with verified certification upon successful completion.",
    },
  ],
},
];
