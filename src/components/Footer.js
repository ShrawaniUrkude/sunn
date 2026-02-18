import React from 'react';
import '../styles/footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About SUN</h4>
          <p>A platform connecting generous donors with organizations and volunteers making a real difference.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/donations">Donations</a></li>
            <li><a href="/leaderboard">Leaderboard</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>User Types</h4>
          <ul>
            <li><a href="/donor-login">Donor</a></li>
            <li><a href="/organisation-login">Organisation</a></li>
            <li><a href="/volunteer-login">Volunteer</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@sundonations.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} SUN Donation Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
