import { useState, useEffect } from 'react';
import './VisualEditor.css';

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

  const handleBannerClick = (index) => {
    if (editMode) {
      setSelectedElement({ type: 'banner', index });
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

  const updateBannerField = (field, value) => {
    if (selectedElement?.type === 'banner') {
      const newBanners = [...content.homepageBanners];
      newBanners[selectedElement.index][field] = value;
      setContent({ ...content, homepageBanners: newBanners });
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
    if (selectedElement?.type === 'banner') {
      updateBannerField('imageUrl', imageUrl);
    } else if (selectedElement?.type === 'slide') {
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

  const saveBanners = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/content/banners`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ banners: content.homepageBanners })
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Banners saved successfully!');
      }
    } catch (err) {
      alert('❌ Failed to save changes');
    } finally {
      setSaving(false);
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
    } else if (activeSection === 'banners') {
      saveBanners();
    } else if (activeSection === 'announcement') {
      saveAnnouncement();
    } else if (activeSection === 'about') {
      saveAbout();
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

  const deleteBanner = (index) => {
    if (confirm('Delete this banner?')) {
      const newBanners = content.homepageBanners.filter((_, i) => i !== index);
      setContent({
        ...content,
        homepageBanners: newBanners
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
          className={`tab-btn ${activeSection === 'banners' ? 'active' : ''}`}
          onClick={() => setActiveSection('banners')}
        >
          🖼️ Product Banners
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
                    ) : (
                      <div className="no-image">📷 No Image</div>
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

        {/* Homepage Banners Section */}
        {activeSection === 'banners' && (
          <div className="banners-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">🖼️ Homepage Banners</h3>
                <p className="section-subtitle">These banners appear on your website homepage</p>
              </div>
              <button 
                className="add-banner-btn"
                onClick={() => {
                  const newBanner = {
                    title: 'New Banner',
                    subtitle: 'Subtitle here',
                    description: 'Description here',
                    imageUrl: '/assets/FaceWash.png',
                    buttonText: 'SHOP NOW',
                    buttonLink: '/shop',
                    order: content.homepageBanners.length + 1,
                    enabled: true
                  };
                  setContent({
                    ...content,
                    homepageBanners: [...content.homepageBanners, newBanner]
                  });
                }}
              >
                ➕ Add New Banner
              </button>
            </div>

            {/* Banners Grid */}
            <div className="banners-grid">
              {content.homepageBanners?.map((banner, index) => (
                <div 
                  key={index}
                  className={`banner-card ${selectedElement?.type === 'banner' && selectedElement.index === index ? 'selected' : ''}`}
                  onClick={() => handleBannerClick(index)}
                >
                  <div className="banner-card-header">
                    <div className="banner-number">#{index + 1}</div>
                    <div className="banner-status">
                      {banner.enabled ? '✅ Enabled' : '❌ Disabled'}
                    </div>
                  </div>
                  <div className="banner-card-image">
                    {banner.imageUrl ? (
                      <img 
                        src={getImageUrl(banner.imageUrl)}
                        alt={banner.title || 'Banner'}
                        onError={(e) => {
                          console.error('Image load error:', banner.imageUrl);
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="no-image">⚠️ Image not found<br/><small style="font-size:10px">Check console</small></div>';
                        }}
                      />
                    ) : (
                      <div className="no-image">📷 No Image</div>
                    )}
                  </div>
                  <div className="banner-card-content">
                    <h4>{banner.title || 'Untitled Banner'}</h4>
                    <p>{banner.subtitle || 'No subtitle'}</p>
                    {banner.imageUrl && (
                      <small style={{ 
                        color: '#9ca3af', 
                        fontSize: '11px', 
                        display: 'block',
                        marginTop: '8px',
                        wordBreak: 'break-all'
                      }}>
                        📎 {banner.imageUrl}
                      </small>
                    )}
                  </div>
                  {editMode && (
                    <div className="banner-card-footer" style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      <span style={{ flex: 1 }}>✏️ Click to Edit</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBanner(index);
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
                <p className="section-subtitle">Top bar message shown across website</p>
              </div>
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

              <div className="form-group">
                <label>Announcement Text</label>
                <input
                  type="text"
                  value={content.announcementBar?.text || ''}
                  onChange={(e) => setContent({
                    ...content,
                    announcementBar: {
                      ...content.announcementBar,
                      text: e.target.value
                    }
                  })}
                  placeholder="🔥 Free Shipping on Orders Above ₹999"
                />
              </div>

              <div className="form-group">
                <label>Link (optional)</label>
                <input
                  type="text"
                  value={content.announcementBar?.link || ''}
                  onChange={(e) => setContent({
                    ...content,
                    announcementBar: {
                      ...content.announcementBar,
                      link: e.target.value
                    }
                  })}
                  placeholder="/shop"
                />
              </div>

              <div className="preview-box">
                <h4>Preview:</h4>
                <div className="announcement-preview" style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  {content.announcementBar?.text || 'No announcement text'}
                </div>
              </div>
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
      </div>

      {/* Side Panel for Editing */}
      {editMode && selectedElement && (
        <div className="edit-panel">
          <div className="edit-panel-header">
            <h3>
              {selectedElement.type === 'slide' 
                ? 'Editing Slide #' + (selectedElement.index + 1)
                : selectedElement.type === 'banner'
                ? 'Editing Banner #' + (selectedElement.index + 1)
                : 'Editing Announcement'}
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

            {/* Banner Editor */}
            {selectedElement.type === 'banner' && (
              <>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={content.homepageBanners[selectedElement.index].title || ''}
                    onChange={(e) => updateBannerField('title', e.target.value)}
                    placeholder="Face Wash"
                  />
                </div>

                <div className="form-group">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={content.homepageBanners[selectedElement.index].subtitle || ''}
                    onChange={(e) => updateBannerField('subtitle', e.target.value)}
                    placeholder="Gentle but serious cleansers"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.homepageBanners[selectedElement.index].description || ''}
                    onChange={(e) => updateBannerField('description', e.target.value)}
                    placeholder="Full description..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={content.homepageBanners[selectedElement.index].buttonText || ''}
                    onChange={(e) => updateBannerField('buttonText', e.target.value)}
                    placeholder="SHOP NOW"
                  />
                </div>

                <div className="form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    value={content.homepageBanners[selectedElement.index].buttonLink || ''}
                    onChange={(e) => updateBannerField('buttonLink', e.target.value)}
                    placeholder="/shop"
                  />
                </div>

                <div className="form-group">
                  <label>Banner Image</label>
                  <div className="image-preview-section">
                    {content.homepageBanners[selectedElement.index].imageUrl && (
                      <img 
                        src={getImageUrl(content.homepageBanners[selectedElement.index].imageUrl)}
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
                      checked={content.homepageBanners[selectedElement.index].enabled || false}
                      onChange={(e) => updateBannerField('enabled', e.target.checked)}
                    />
                    {' '}Enable this banner
                  </label>
                </div>

                <button 
                  className="delete-btn"
                  onClick={() => deleteBanner(selectedElement.index)}
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
                  🗑️ Delete Banner
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
