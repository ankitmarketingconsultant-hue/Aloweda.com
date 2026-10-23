import { useState, useEffect } from 'react';
import './VisualEditor.css';

// Import animated videos for "What's Aloweda?" preview
import AyurvedaVideo from '../assets/Ayurveda.mp4';
import AllopathyVideo from '../assets/Allopathy.mp4';
import SafeSyntheticsVideo from '../assets/SafeSynthetics.mp4';
import KnowledgeInnovationVideo from '../assets/Knowledge&Innovation.mp4';

const VisualEditor = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero'); // 'hero', 'banners', 'announcement', 'about'

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const websiteUrl = 'https://aloweda-smoky.vercel.app';

  // Helper function to get correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If already absolute URL, return as is
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // If it's an uploaded image, use full website URL
    if (imageUrl.startsWith('/uploads/')) {
      return `https://aloweda-smoky.vercel.app${imageUrl}`;
    }
    
    // For assets folder images, try to load from src/assets first
    // If that fails, fallback to website URL
    if (imageUrl.startsWith('/assets/')) {
      // Try importing from src/assets
      const assetName = imageUrl.replace('/assets/', '');
      try {
        // This will work for known assets
        return new URL(`../assets/${assetName}`, import.meta.url).href;
      } catch {
        // Fallback to website URL
        return `https://aloweda-smoky.vercel.app${imageUrl}`;
      }
    }
    
    // Default: use website URL
    return `https://aloweda-smoky.vercel.app${imageUrl}`;
  };

  useEffect(() => {
    fetchContent();
    fetchUploadedImages();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/content`);
      const data = await response.json();
      
      if (data.success) {
        setContent(data.content);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUploadedImages(data.images);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const handleSlideClick = (index) => {
    if (editMode) {
      setSelectedElement({ type: 'slide', index });
    }
  };

  const handleAnnouncementClick = () => {
    if (editMode) {
      setSelectedElement({ type: 'announcement' });
    }
  };

  const updateSlideField = (field, value) => {
    if (selectedElement?.type === 'slide') {
      const newSlides = [...(content.heroSlider?.slides || [])];
      newSlides[selectedElement.index][field] = value;
      setContent({ 
        ...content, 
        heroSlider: {
          ...content.heroSlider,
          slides: newSlides
        }
      });
    }
  };

  const openImageGallery = () => {
    setShowImageGallery(true);
  };

  const selectImageFromGallery = (imageUrl) => {
    if (selectedElement?.type === 'slide') {
      updateSlideField('imageUrl', imageUrl);
    }
    setShowImageGallery(false);
  };

  const uploadNewImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        selectImageFromGallery(data.imageUrl);
        fetchUploadedImages(); // Refresh gallery
        alert('✅ Image uploaded!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('❌ Upload failed');
    }
  };

  const uploadGraphicVideo = async (file, graphicIndex) => {
    const formData = new FormData();
    formData.append('image', file); // Backend uses 'image' field for all uploads

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        // Update the graphic's videoUrl
        const newGraphics = [...content.heroSlider.slides[0].graphics];
        if (!newGraphics[graphicIndex]) newGraphics[graphicIndex] = {};
        newGraphics[graphicIndex].videoUrl = data.imageUrl;
        
        const updatedContent = { ...content };
        updatedContent.heroSlider.slides[0].graphics = newGraphics;
        setContent(updatedContent);
        
        // Save to backend
        await saveHeroSlider();
        alert('✅ Video uploaded successfully!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('❌ Video upload failed');
    }
  };

  const deleteGraphic = async (graphicIndex) => {
    if (!confirm('Are you sure you want to remove this graphic video?')) return;
    
    try {
      const newGraphics = [...content.heroSlider.slides[0].graphics];
      if (newGraphics[graphicIndex]) {
        newGraphics[graphicIndex].videoUrl = '';
      }
      
      const updatedContent = { ...content };
      updatedContent.heroSlider.slides[0].graphics = newGraphics;
      setContent(updatedContent);
      
      // Save to backend
      await saveHeroSlider();
      alert('✅ Graphic video removed!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('❌ Failed to remove graphic');
    }
  };

  const saveHeroSlider = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/content/hero-slider`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content.heroSlider)
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Hero slider saved successfully!');
      }
    } catch (err) {
      alert('❌ Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const saveCurrentSection = () => {
    if (activeSection === 'hero') {
      saveHeroSlider();
    } else if (activeSection === 'announcement') {
      saveAnnouncement();
    } else if (activeSection === 'about') {
      saveAbout();
    } else if (activeSection === 'contact') {
      saveContactInfo();
    }
  };

  const saveAnnouncement = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/content/announcement`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content.announcementBar)
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Announcement saved successfully!');
      }
    } catch (err) {
      alert('❌ Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/content/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content.aboutSection)
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ About section saved successfully!');
      }
    } catch (err) {
      alert('❌ Failed to save about section');
    } finally {
      setSaving(false);
    }
  };

  const saveContactInfo = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/content/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content.contactInfo)
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Contact info saved successfully!');
      }
    } catch (err) {
      alert('❌ Failed to save contact info');
    } finally {
      setSaving(false);
    }
  };

  const addNewSlide = () => {
    const newSlide = {
      title: 'New Slide Title',
      subtitle: 'New Slide Subtitle',
      description: 'Add your description here',
      imageUrl: '/assets/FaceWash.png',
      buttonText: 'SHOP NOW',
      buttonLink: '/shop',
      order: (content.heroSlider?.slides || []).length + 1,
      enabled: true
    };
    
    const newSlides = [...(content.heroSlider?.slides || []), newSlide];
    setContent({
      ...content,
      heroSlider: {
        ...content.heroSlider,
        slides: newSlides
      }
    });
  };

  const deleteSlide = (index) => {
    if (confirm('Delete this slide?')) {
      const newSlides = content.heroSlider.slides.filter((_, i) => i !== index);
      setContent({
        ...content,
        heroSlider: {
          ...content.heroSlider,
          slides: newSlides
        }
      });
      setSelectedElement(null);
    }
  };

  if (loading) {
    return (
      <div className="visual-editor">
        <div className="loading">Loading preview...</div>
      </div>
    );
  }

  return (
    <div className="visual-editor">
      {/* Top Control Bar */}
      <div className="control-bar">
        <div className="control-bar-left">
          <h2>🎨 Page Content Editor</h2>
          <span className="mode-indicator">
            {editMode ? `✏️ Editing ${activeSection === 'hero' ? 'Hero Slider' : activeSection === 'banners' ? 'Banners' : activeSection === 'announcement' ? 'Announcement' : 'About Section'}` : '👁️ Preview Mode'}
          </span>
        </div>
        <div className="control-bar-right">
          <a 
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="preview-link-btn"
          >
            🔗 View Live Website
          </a>
          <button 
            className={`mode-toggle ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? '👁️ Preview Mode' : '✏️ Edit Mode'}
          </button>
          {editMode && (
            <button 
              className="save-btn"
              onClick={saveCurrentSection}
              disabled={saving}
            >
              {saving ? '💾 Saving...' : '💾 Save All Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="section-tabs">
        <button 
          className={`tab-btn ${activeSection === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveSection('hero')}
        >
          🎬 Hero Slider
        </button>
        <button 
          className={`tab-btn ${activeSection === 'announcement' ? 'active' : ''}`}
          onClick={() => setActiveSection('announcement')}
        >
          📢 Announcement Bar
        </button>
        <button 
          className={`tab-btn ${activeSection === 'about' ? 'active' : ''}`}
          onClick={() => setActiveSection('about')}
        >
          ℹ️ About Section
        </button>
        <button 
          className={`tab-btn ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveSection('contact')}
        >
          📞 Contact Info
        </button>
      </div>

      {/* Full Width Editor */}
      <div className="full-width-editor">
        {/* Edit Mode Instructions */}
        {editMode && (
          <div className="edit-instructions">
            <p>
              💡 <strong>Click any {activeSection === 'hero' ? 'slide' : activeSection === 'banners' ? 'banner' : 'element'} below</strong> to edit its content → Click gallery to change image → Save changes
            </p>
          </div>
        )}

        {/* Hero Slider Section */}
        {activeSection === 'hero' && (
          <div className="hero-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">🎬 Hero Slider</h3>
                <p className="section-subtitle">Main slider at the top of homepage (Recommended: 5-7 slides)</p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#f59e0b', 
                  marginTop: '8px',
                  background: '#fffbeb',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #fcd34d'
                }}>
                  ⚠️ <strong>Note:</strong> Slide #1 "What's Aloweda?" uses a special layout with 4 animated graphics on the homepage.
                </p>
              </div>
              <button 
                className="add-banner-btn"
                onClick={addNewSlide}
              >
                ➕ Add New Slide
              </button>
            </div>

            {/* Slides Grid */}
            <div className="banners-grid">
              {content.heroSlider?.slides?.map((slide, index) => (
                <div 
                  key={index}
                  className={`banner-card ${selectedElement?.type === 'slide' && selectedElement.index === index ? 'selected' : ''}`}
                  onClick={() => handleSlideClick(index)}
                >
                  <div className="banner-card-header">
                    <div className="banner-number">Slide #{index + 1}</div>
                    <div className="banner-status">
                      {slide.enabled ? '✅ Enabled' : '❌ Disabled'}
                    </div>
                  </div>
                  <div className="banner-card-image">
                    {slide.imageUrl ? (
                      <img 
                        src={getImageUrl(slide.imageUrl)}
                        alt={slide.title || 'Slide'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="no-image">⚠️ Image not found</div>';
                        }}
                      />
                    ) : index === 0 && slide.graphics && slide.graphics.length > 0 ? (
                      // Special preview for "What's Aloweda?" with 4 animated videos
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        padding: '16px',
                        height: '100%'
                      }}>
                        {[
                          { video: AyurvedaVideo, label: 'Ayurveda' },
                          { video: AllopathyVideo, label: 'Allopathy' },
                          { video: SafeSyntheticsVideo, label: 'Safe Synthetics' },
                          { video: KnowledgeInnovationVideo, label: 'Knowledge & Innovation' }
                        ].map((item, gIdx) => (
                          <div key={gIdx} style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            overflow: 'hidden'
                          }}>
                            <video
                              src={item.video}
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'contain',
                                marginBottom: '6px'
                              }}
                            />
                            <div style={{
                              color: 'white',
                              fontSize: '9px',
                              fontWeight: '600',
                              textAlign: 'center',
                              lineHeight: '1.2',
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}>
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-image" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        textAlign: 'center',
                        height: '100%'
                      }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                        <div style={{ fontSize: '13px' }}>No Image</div>
                      </div>
                    )}
                  </div>
                  <div className="banner-card-content">
                    <h4>{slide.title || 'Untitled Slide'}</h4>
                    <p>{slide.subtitle || 'No subtitle'}</p>
                  </div>
                  {editMode && (
                    <div className="banner-card-footer" style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      <span style={{ flex: 1 }}>✏️ Click to Edit</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSlide(index);
                        }}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcement Bar Section */}
        {activeSection === 'announcement' && (
          <div className="announcement-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">📢 Announcement Bar</h3>
                <p className="section-subtitle">Multiple rotating messages in top bar</p>
              </div>
              <button
                onClick={() => {
                  const newMessages = [
                    ...(content.announcementBar?.messages || []),
                    { text: '✨ New Announcement', link: '/shop', bgColor: '#2d5f3f' }
                  ];
                  setContent({
                    ...content,
                    announcementBar: {
                      ...content.announcementBar,
                      messages: newMessages
                    }
                  });
                }}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                + Add Message
              </button>
            </div>

            <div className="announcement-editor">
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox"
                    checked={content.announcementBar?.enabled || false}
                    onChange={(e) => setContent({
                      ...content,
                      announcementBar: {
                        ...content.announcementBar,
                        enabled: e.target.checked
                      }
                    })}
                  />
                  {' '}Enable Announcement Bar
                </label>
              </div>

              <h4 style={{ marginTop: '20px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                Messages ({content.announcementBar?.messages?.length || 0})
              </h4>

              {(content.announcementBar?.messages || []).length === 0 && (
                <div style={{
                  padding: '20px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  No announcement messages. Click "+ Add Message" to create one.
                </div>
              )}

              {(content.announcementBar?.messages || []).map((msg, index) => (
                <div key={index} style={{
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      Message #{index + 1}
                    </h5>
                    <button
                      onClick={() => {
                        if (confirm('Delete this announcement message?')) {
                          const newMessages = content.announcementBar.messages.filter((_, i) => i !== index);
                          setContent({
                            ...content,
                            announcementBar: {
                              ...content.announcementBar,
                              messages: newMessages
                            }
                          });
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500' }}>Text</label>
                    <input
                      type="text"
                      value={msg.text || ''}
                      onChange={(e) => {
                        const newMessages = [...content.announcementBar.messages];
                        newMessages[index].text = e.target.value;
                        setContent({
                          ...content,
                          announcementBar: {
                            ...content.announcementBar,
                            messages: newMessages
                          }
                        });
                      }}
                      placeholder="🔥 Free Shipping on Orders Above ₹999"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500' }}>Link (optional)</label>
                    <input
                      type="text"
                      value={msg.link || ''}
                      onChange={(e) => {
                        const newMessages = [...content.announcementBar.messages];
                        newMessages[index].link = e.target.value;
                        setContent({
                          ...content,
                          announcementBar: {
                            ...content.announcementBar,
                            messages: newMessages
                          }
                        });
                      }}
                      placeholder="/shop"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: '500' }}>Background Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={msg.bgColor || '#2d5f3f'}
                        onChange={(e) => {
                          const newMessages = [...content.announcementBar.messages];
                          newMessages[index].bgColor = e.target.value;
                          setContent({
                            ...content,
                            announcementBar: {
                              ...content.announcementBar,
                              messages: newMessages
                            }
                          });
                        }}
                        style={{ width: '50px', height: '35px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={msg.bgColor || '#2d5f3f'}
                        onChange={(e) => {
                          const newMessages = [...content.announcementBar.messages];
                          newMessages[index].bgColor = e.target.value;
                          setContent({
                            ...content,
                            announcementBar: {
                              ...content.announcementBar,
                              messages: newMessages
                            }
                          });
                        }}
                        placeholder="#2d5f3f"
                        style={{ flex: 1, fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  <div className="preview-box" style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '6px' }}>
                      Preview:
                    </label>
                    <div style={{
                      background: msg.bgColor || '#2d5f3f',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'center',
                      fontWeight: '500',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      {msg.text || 'No text'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <div className="about-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">ℹ️ About Section</h3>
                <p className="section-subtitle">Company introduction shown on homepage</p>
              </div>
            </div>

            <div className="about-editor">
              <div className="form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  value={content.aboutSection?.title || ''}
                  onChange={(e) => setContent({
                    ...content,
                    aboutSection: {
                      ...content.aboutSection,
                      title: e.target.value
                    }
                  })}
                  placeholder="About Aloweda"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.aboutSection?.description || ''}
                  onChange={(e) => setContent({
                    ...content,
                    aboutSection: {
                      ...content.aboutSection,
                      description: e.target.value
                    }
                  })}
                  placeholder="Tell your brand story..."
                  rows="6"
                />
              </div>

              <div className="form-group">
                <label>
                  <input 
                    type="checkbox"
                    checked={content.aboutSection?.enabled || false}
                    onChange={(e) => setContent({
                      ...content,
                      aboutSection: {
                        ...content.aboutSection,
                        enabled: e.target.checked
                      }
                    })}
                  />
                  {' '}Show About Section on Homepage
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Contact Info Section */}
        {activeSection === 'contact' && (
          <div className="contact-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">📞 Contact Information</h3>
                <p className="section-subtitle">Phone, email, address, and WhatsApp details</p>
              </div>
            </div>

            <div className="contact-editor">
              <div className="form-group">
                <label>📱 Phone Number</label>
                <input
                  type="tel"
                  value={content.contactInfo?.phone || ''}
                  onChange={(e) => setContent({
                    ...content,
                    contactInfo: {
                      ...content.contactInfo,
                      phone: e.target.value
                    }
                  })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label>📧 Email Address</label>
                <input
                  type="email"
                  value={content.contactInfo?.email || ''}
                  onChange={(e) => setContent({
                    ...content,
                    contactInfo: {
                      ...content.contactInfo,
                      email: e.target.value
                    }
                  })}
                  placeholder="contact@aloweda.com"
                />
              </div>

              <div className="form-group">
                <label>📍 Business Address</label>
                <textarea
                  value={content.contactInfo?.address || ''}
                  onChange={(e) => setContent({
                    ...content,
                    contactInfo: {
                      ...content.contactInfo,
                      address: e.target.value
                    }
                  })}
                  placeholder="123 Business Street, City, State - 123456"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>💬 WhatsApp Number (with country code)</label>
                <input
                  type="tel"
                  value={content.contactInfo?.whatsappNumber || ''}
                  onChange={(e) => setContent({
                    ...content,
                    contactInfo: {
                      ...content.contactInfo,
                      whatsappNumber: e.target.value
                    }
                  })}
                  placeholder="919876543210"
                />
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Format: Country code + number (no spaces or special characters)
                </small>
              </div>

              <div className="preview-box">
                <h4>Preview:</h4>
                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {content.contactInfo?.phone && (
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📱</span>
                      <span>{content.contactInfo.phone}</span>
                    </div>
                  )}
                  {content.contactInfo?.email && (
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📧</span>
                      <span>{content.contactInfo.email}</span>
                    </div>
                  )}
                  {content.contactInfo?.address && (
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📍</span>
                      <span>{content.contactInfo.address}</span>
                    </div>
                  )}
                  {content.contactInfo?.whatsappNumber && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>💬</span>
                      <span>{content.contactInfo.whatsappNumber}</span>
                    </div>
                  )}
                  {!content.contactInfo?.phone && !content.contactInfo?.email && !content.contactInfo?.address && !content.contactInfo?.whatsappNumber && (
                    <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      No contact information added yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel for Editing */}
      {editMode && selectedElement && (
        <div className="edit-panel">
          <div className="edit-panel-header">
            <h3>
              {selectedElement.type === 'slide' 
                ? 'Editing Slide #' + (selectedElement.index + 1)
                : 'Editing Content'}
            </h3>
            <button 
              className="close-panel"
              onClick={() => setSelectedElement(null)}
            >
              ✕
            </button>
          </div>

          <div className="edit-panel-body">
            {/* Hero Slide Editor */}
            {selectedElement.type === 'slide' && (
              <>
                {/* Special Graphics Section for Slide #1 - MOVED TO TOP */}
                {selectedElement.index === 0 && content.heroSlider.slides[0].graphics && (
                  <div className="form-group" style={{ 
                    background: '#f0f9ff', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '2px solid #3b82f6',
                    marginBottom: '20px'
                  }}>
                    <label style={{ color: '#1e40af', marginBottom: '12px', display: 'block', fontSize: '15px' }}>
                      <strong>🎨 What's Aloweda? Animated Graphics</strong>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal', marginTop: '4px' }}>
                        These 4 animated videos show on the homepage
                      </div>
                    </label>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      {[
                        { video: AyurvedaVideo, label: 'Ayurveda', idx: 0 },
                        { video: AllopathyVideo, label: 'Allopathy', idx: 1 },
                        { video: SafeSyntheticsVideo, label: 'Safe Synthetics', idx: 2 },
                        { video: KnowledgeInnovationVideo, label: 'Knowledge & Innovation', idx: 3 }
                      ].map((item) => (
                        <div key={item.idx} style={{
                          background: 'white',
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}>
                            <video
                              src={item.video}
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'contain',
                                borderRadius: '4px',
                                background: '#f3f4f6'
                              }}
                            />
                            <div style={{
                              flex: 1,
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#374151'
                            }}>
                              #{item.idx + 1}: {item.label}
                            </div>
                          </div>
                          
                          <input
                            type="text"
                            value={content.heroSlider.slides[0].graphics[item.idx]?.label || item.label}
                            onChange={(e) => {
                              const newGraphics = [...content.heroSlider.slides[0].graphics];
                              if (!newGraphics[item.idx]) newGraphics[item.idx] = {};
                              newGraphics[item.idx].label = e.target.value;
                              updateSlideField('graphics', newGraphics);
                            }}
                            placeholder="Label"
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              fontSize: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              marginBottom: '6px'
                            }}
                          />
                          
                          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                            <label style={{
                              flex: 1,
                              padding: '6px 8px',
                              fontSize: '11px',
                              background: '#3b82f6',
                              color: 'white',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              fontWeight: '500'
                            }}>
                              📤 Upload
                              <input
                                type="file"
                                accept="video/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    uploadGraphicVideo(e.target.files[0], item.idx);
                                  }
                                }}
                              />
                            </label>
                            <button
                              onClick={() => deleteGraphic(item.idx)}
                              style={{
                                padding: '6px 12px',
                                fontSize: '11px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                          
                          <input
                            type="text"
                            value={content.heroSlider.slides[0].graphics[item.idx]?.videoUrl || ''}
                            readOnly
                            placeholder="Video path will appear here"
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              fontSize: '10px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontFamily: 'monospace',
                              background: '#f9fafb',
                              color: '#6b7280'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Slide Title</label>
                  <input
                    type="text"
                    value={content.heroSlider.slides[selectedElement.index].title || ''}
                    onChange={(e) => updateSlideField('title', e.target.value)}
                    placeholder="Main Heading"
                  />
                </div>

                <div className="form-group">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={content.heroSlider.slides[selectedElement.index].subtitle || ''}
                    onChange={(e) => updateSlideField('subtitle', e.target.value)}
                    placeholder="Subheading"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.heroSlider.slides[selectedElement.index].description || ''}
                    onChange={(e) => updateSlideField('description', e.target.value)}
                    placeholder="Slide description..."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={content.heroSlider.slides[selectedElement.index].buttonText || ''}
                    onChange={(e) => updateSlideField('buttonText', e.target.value)}
                    placeholder="SHOP NOW"
                  />
                </div>

                <div className="form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    value={content.heroSlider.slides[selectedElement.index].buttonLink || ''}
                    onChange={(e) => updateSlideField('buttonLink', e.target.value)}
                    placeholder="/shop"
                  />
                </div>

                <div className="form-group">
                  <label>Slide Image</label>
                  <div className="image-preview-section">
                    {content.heroSlider.slides[selectedElement.index].imageUrl && (
                      <img 
                        src={getImageUrl(content.heroSlider.slides[selectedElement.index].imageUrl)}
                        alt="Preview"
                        className="current-image-preview"
                      />
                    )}
                    <button 
                      className="gallery-btn"
                      onClick={openImageGallery}
                    >
                      🖼️ Choose from Gallery
                    </button>
                    <label className="upload-new-btn">
                      📤 Upload New Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            uploadNewImage(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox"
                      checked={content.heroSlider.slides[selectedElement.index].enabled || false}
                      onChange={(e) => updateSlideField('enabled', e.target.checked)}
                    />
                    {' '}Enable this slide
                  </label>
                </div>

                <button 
                  className="delete-btn"
                  onClick={() => deleteSlide(selectedElement.index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '20px',
                    width: '100%'
                  }}
                >
                  🗑️ Delete Slide
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="gallery-modal">
          <div className="gallery-modal-content">
            <div className="gallery-header">
              <h3>🖼️ Image Gallery</h3>
              <button onClick={() => setShowImageGallery(false)}>✕</button>
            </div>
            <div className="gallery-grid">
              {uploadedImages.length === 0 ? (
                <div className="no-images">
                  <p>No uploaded images yet</p>
                  <label className="upload-first-btn">
                    📤 Upload First Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          uploadNewImage(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                uploadedImages.map((img, idx) => (
                  <div 
                    key={idx}
                    className="gallery-item"
                    onClick={() => selectImageFromGallery(img.url)}
                  >
                    <img src={img.url} alt={img.filename} />
                    <div className="gallery-item-overlay">
                      <span>✓ Select</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualEditor;
