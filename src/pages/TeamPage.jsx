import SeoHelmet from "../components/seo/SeoHelmet";
import { Linkedin } from "lucide-react";

const TeamPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Khem Raj Pokhrel",
      position: "CEO",
      image: "/team/KhemRaj_Pokhrel_CEO.webp",
      linkedin: "https://www.linkedin.com/in/khemrajpokhrel/",
    },
    {
      id: 2,
      name: "Yuvraj Bhusal",
      position: "Co-Founder",
      image: "/team/Yuvraj_Bhusal_Co-Founder.webp",
      linkedin: "https://www.linkedin.com/in/yubrajbhusal/",
    },
    {
      id: 3,
      name: "Aswikar Khanal",
      position: "Data Analyst",
      image: "/team/aswikar_khanal_Data_Analyst.webp",
      linkedin: "https://www.linkedin.com/in/aswikar-khanal/",
    },
    {
      id: 10,
      name: "Ashish Karki",
      position: "Web Developer",
      image: "/team/ashishkarki.webp",
      linkedin: "https://www.linkedin.com/in/ashish-karki/",
    },
    {
      id: 11,
      name: "Utsav Pun",
      position: "Data Analytics Intern",
      image: "/team/utsav_pun.webp",
      linkedin: "https://www.linkedin.com/in/utsav-pun-627163357",
    },
    {
      id: 4,
      name: "Suresh Sharma",
      position: "Account & Finance, CA",
      image: "/team/Suresh_Sharma_Account&Finance, CA.webp",
      // linkedin: "https://www.linkedin.com/in/suresh-sharma/",
    },
    {
      id: 6,
      name: "Pravash Gautam",
      position: "Digital Marketing",
      image: "/team/Prabahs_Gautam_Digital_Marketing.webp",
      linkedin: "https://www.linkedin.com/in/pravash-gautam34/",
    },
    {
      id: 5,
      name: "Pratikshya Khanal",
      position: "Writer",
      image: "/team/Pratikshya_Khanal_Writer.webp",
      linkedin: "https://www.linkedin.com/in/pratikshakhanal/",
    },
    {
      id: 7,
      name: "Pawan Sahani",
      position: "Writer",
      image: "/team/Pawan_Sahani_Freelance_Writer.webp",
      linkedin: "https://www.linkedin.com/in/pawan-sahani-527517ba/",
    },
    {
      id: 8,
      name: "Manisha Gadtaula",
      position: "Qualitative Data Analyst",
      image: "/team/Manisha_Gadtaula_QualatativeDataAnalyst.webp",
      linkedin: "https://www.linkedin.com/in/manisha-gadtaula-b32713241/",
    },
    {
      id: 9,
      name: "Siraj Pokharel",
      position: "Field Manager",
      image: "/team/Siraj_Pokharel_Field_Manager.webp",
      // linkedin: "https://www.linkedin.com/in/siraj-pokharel/",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <SeoHelmet
        title="PB Group | Meet Our Expert Team in Data Analytics, IT & Research"
        description="Meet the dedicated team behind PB Group, including data analysts, IT specialists, researchers, and consultants. Our professionals deliver data-driven insights, innovative solutions, and expert training in Nepal."
        image="/team/hero-team.webp"
        url="https://pbg.com.np//teams"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our dedicated team of experts brings together years of experience in
            research, data analytics, and education to deliver exceptional
            results for our clients.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-60 sm:h-80">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-1 text-center">
                <div className="mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-xs sm:text-sm">
                    {member.position}
                  </p>
                </div>

                {/* LinkedIn Link */}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 hover:bg-blue-700 text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <Linkedin size={18} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;