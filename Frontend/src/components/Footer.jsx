import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Next<span className="text-[#6A38C2]">Hire</span>
          </h2>
          <p className="text-sm leading-relaxed">
            Connecting talented professionals with top companies worldwide.
            Find your dream job or hire the best talent effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/browse")}>Browse Jobs</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/profile")}>Profile</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Career Tips</li>
            <li className="hover:text-white cursor-pointer">Resume Guide</li>
            <li className="hover:text-white cursor-pointer">Interview Prep</li>
            <li className="hover:text-white cursor-pointer">Help Center</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <p className="text-sm mb-3">support@nexthire.com</p>
          <p className="text-sm mb-4">+91 81169 50851</p>

          <div className="flex space-x-4">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-white" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-white" />
            <Linkedin className="w-5 h-5 cursor-pointer hover:text-white" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} NextHire. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
