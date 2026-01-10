import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

const Topbar = () => {
  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/PBGroupIT/",
      label: "Facebook",
      color: "text-[#1877F2]",
    },
    {
      icon: FaTwitter,
      href: "https://www.twitter.com/pbITgroup",
      label: "Twitter",
      color: "text-[#1DA1F2]",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/pbgroupit",
      label: "Instagram",
      color: "text-[#E4405F]",
    },
    {
      icon: FaLinkedinIn,
      href: "https://www.linkedin.com/company/pbgroups/",
      label: "LinkedIn",
      color: "text-[#0A66C2]",
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/@PBGroup2022",
      label: "YouTube",
      color: "text-[#FF0000]",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/97715422929",
      label: "WhatsApp",
      color: "text-[#25D366]",
    },
    {
      icon: FaTiktok,
      href: "https://www.tiktok.com/@pbgroup0?_t=ZS-8z201mbD7Fk&_r=1",
      label: "Tiktok",
      color: "text-white",
    },
  ];

  return (
    <div className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2.5 sm:py-3">
          {/* Left side - Contact Information */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm">
            <div className="flex items-center">
              <MapPin size={14} className="mr-1.5 sm:mr-2 text-blue-400 flex-shrink-0" />
              <a
                href="https://www.google.com/maps/place/PB+Group+%7C+Research+and+Data+Analytics+Company+in+Nepal/@27.6772162,85.3152768,19.94z/data=!4m14!1m7!3m6!1s0x39eb193c5fed8d65:0x4bd54b2ed54938b0!2sPB+Group+%7C+Research+and+Data+Analytics+Company+in+Nepal!8m2!3d27.6772224!4d85.315185!16s%2Fg%2F11jzr_tyk7!3m5!1s0x39eb193c5fed8d65:0x4bd54b2ed54938b0!8m2!3d27.6772224!4d85.315185!16s%2Fg%2F11jzr_tyk7?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <span className="hidden sm:inline">Pulchowk, Lalitpur 44600</span>
                <span className="sm:hidden">Pulchowk, Lalitpur</span>
              </a>
            </div>

            <div className="flex items-center">
              <Phone size={14} className="mr-1.5 sm:mr-2 text-green-400 flex-shrink-0" />
              <a
                href="tel:+9779802351303"
                className="text-gray-300 hover:text-white transition-colors"
              >
                980-2351303
              </a>  
            </div>

            <div className="flex items-center">
              <a
                href="mailto:info@pbg.com.np?subject=Consultation%20Request"
                className="flex items-center hover:text-white transition-colors"
              >
                <Mail
                  size={14}
                  className="mr-1.5 sm:mr-2 text-orange-400 flex-shrink-0"
                />
                <span className="text-gray-300 hover:text-white">
                  info@pbg.com.np
                </span>
              </a>
            </div>
          </div>

          {/* Right side - Social Media Icons */}
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 mt-2 sm:mt-2.5 lg:mt-0">
            <span className="text-gray-400 text-xs sm:text-sm hidden md:inline-block lg:inline-block">
              Follow Us:
            </span>
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} transition-all duration-300 p-1 sm:p-1.5 transform hover:scale-125 rounded`}
                  aria-label={social.label}
                >
                  <social.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar