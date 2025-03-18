import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white w-full py-2 absolute bottom-0">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul>
            <li className="mb-2">
              <a href="/" className="hover:text-blue-400">
                About Us
              </a>
            </li>
            <li className="mb-2">
              <a href="/" className="hover:text-blue-400">
                Careers
              </a>
            </li>
            <li className="mb-2">
              <a href="/" className="hover:text-blue-400">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2">
              <a href="/" className="hover:text-blue-400">
                Privacy Policy
              </a>
            </li>
            <li className="mb-2">
              <a href="/" className="hover:text-blue-400">
                Terms of Service
              </a>
            </li>
            <li className="mb-2">
              <a href="/" className="hover:text-blue-400">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://twitter.com" className="hover:text-blue-400">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://linkedin.com" className="hover:text-blue-400">
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
            <a href="https://facebook.com" className="hover:text-blue-400">
              <i className="fab fa-facebook"></i> Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-2 border-t border-gray-700 pt-2 text-center text-gray-400">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
