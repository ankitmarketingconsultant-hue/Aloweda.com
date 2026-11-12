import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState(getSampleAnnouncements());
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const marqueeRef = useRef(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/announcements/active`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.log('Using sample announcements (Backend not available)');
      // Keep sample announcements if API fails
    }
  };

  function getSampleAnnouncements() {
    return [
      {
        _id: '1',
        text: '🚚 Free Shipping on Orders Above ₹999',
        icon: '🚚',
        showIcon: true,
        link: '/shop',
        linkText: 'Shop Now',
        isActive: true,
        order: 1
      },
      {
        _id: '2',
        text: '🎉 Flat 10% Discount on Online Payments',
        icon: '🎉',
        showIcon: true,
        link: null,
        isActive: true,
        order: 2
      },
      {
        _id: '3',
        text: '🌿 Consult Specialist',
        icon: '🌿',
        showIcon: true,
        link: '/about',
        linkText: 'Learn More',
        isActive: true,
        order: 3
      },
      {
        _id: '4',
        text: '🔥 Limited Time Offer – Buy 2 Get 1 Free',
        icon: '🔥',
        showIcon: true,
        link: '/shop',
        linkText: 'Shop Now',
        isActive: true,
        order: 4
      }
    ];
  }

  const handleClose = () => {
    setIsVisible(false);
    // Store in sessionStorage so it stays closed during the session
    sessionStorage.setItem('announcementBarClosed', 'true');
    // Notify navbar to adjust position
    window.dispatchEvent(new CustomEvent('announcementBarClosed'));
  };

  // Check if announcement bar was previously closed in this session
  useEffect(() => {
    const wasClosed = sessionStorage.getItem('announcementBarClosed');
    if (wasClosed === 'true') {
      setIsVisible(false);
    }
  }, []);

  // Notify when visibility changes
  useEffect(() => {
    if (isVisible) {
      window.dispatchEvent(new CustomEvent('announcementBarVisible'));
    } else {
      window.dispatchEvent(new CustomEvent('announcementBarHidden'));
    }
  }, [isVisible]);

  if (!isVisible || announcements.length === 0) {
    return null;
  }

  // Create marquee content by duplicating announcements for seamless loop
  const marqueeContent = [...announcements, ...announcements, ...announcements];

  return (
    <div 
      className={`announcement-bar ${isPaused ? 'paused' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="announcement-bar__inner">
        <div 
          ref={marqueeRef}
          className={`announcement-bar__marquee ${isPaused ? 'paused' : ''}`}
        >
          {marqueeContent.map((announcement, index) => (
            <div 
              key={`${announcement._id}-${index}`} 
              className="announcement-bar__item"
            >
              {announcement.showIcon !== false && announcement.icon && (
                <span className="announcement-bar__icon" aria-hidden="true">
                  {announcement.icon}
                </span>
              )}
              <span className="announcement-bar__text">
                {announcement.text}
              </span>
              {announcement.link && announcement.linkText && (
                <>
                  <span className="announcement-bar__separator">•</span>
                  <Link 
                    to={announcement.link} 
                    className="announcement-bar__cta"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {announcement.linkText}
                    <svg 
                      className="announcement-bar__arrow" 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <button 
        className="announcement-bar__close"
        onClick={handleClose}
        aria-label="Close announcement bar"
      >
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 14 14" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1 1L13 13M13 1L1 13" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default AnnouncementBar;
