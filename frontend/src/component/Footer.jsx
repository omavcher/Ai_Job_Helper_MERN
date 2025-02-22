// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="mobile-footer">
      <Link to="/" className="footer-icon">
        <i className="fas fa-home"></i>
      </Link>
      <Link to="/practice-question" className="footer-icon">
        <i className="fas fa-book-open"></i>
      </Link>
      <Link to="/live-coding" className="footer-icon">
        <i className="fas fa-code"></i>
      </Link>
      <Link to="/resume-analyzer" className="footer-icon">
        <i className="fas fa-file-alt"></i>
      </Link>
      <Link to="/job-roadmaps" className="footer-icon">
        <i className="fas fa-map"></i>
      </Link>
    </div>
  );
};

export default Footer;
