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
  const [activeSection, setActiveSection] = useState('banners'); // 'banners' or 'hero'

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
    } else {
      saveBanners();
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
            {editMode ? '✏️ Editing Homepage Banners' : '👁️ Preview Mode'}
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
              onClick={saveBanners}
              disabled={saving}
            >
              {saving ? '💾 Saving...' : '💾 Save All Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Full Width Editor */}
      <div className="full-width-editor">
        {/* Edit Mode Instructions */}
        {editMode && (
          <div className="edit-instructions">
            <p>
              💡 <strong>Click any banner below</strong> to edit its content → Click gallery to change image → Save changes
            </p>
          </div>
        )}

        {/* Homepage Banners Section */}
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
                  <div className="banner-card-footer">
                    ✏️ Click to Edit
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel for Editing */}
      {editMode && selectedElement && (
        <div className="edit-panel">
          <div className="edit-panel-header">
            <h3>
              {selectedElement.type === 'banner' 
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
