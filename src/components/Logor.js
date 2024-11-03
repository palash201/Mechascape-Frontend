import React from 'react';
import logo from '../images/logo.png'; // Import the image

const Logor = () => {
    return (
        <div className="logo-container">
            <a href="/" className="logo-link"> {/* Use <a> tag for navigation */}
                <img src={logo} alt="Steampunk Logo" className="logo" style={{ width: '150px', height: 'auto' }} />
            </a>
        </div>
    );
};

export default Logor;
