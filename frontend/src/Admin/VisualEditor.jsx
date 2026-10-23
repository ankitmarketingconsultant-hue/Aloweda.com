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
  const [iframeKey, setIframeKey] = useState(0); // For forcing iframe reload

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const websiteUrl = 'https://aloweda-smoky.vercel.app';

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
        alert('✅ Changes saved successfully! Website will refresh in 2 seconds...');
        
        // Wait 2 seconds then refresh iframe to show changes
        setTimeout(() => {
          setIframeKey(prev => prev + 1); // This forces iframe to reload
        }, 2000);
      }
    } catch (err) {
      alert('❌ Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="visual-editor">
        <div className="loading">Loading preview...</div>
      </div>
    );
  }

  const websiteUrl = 'https://aloweda-smoky.vercel.app';

  return (
    <div className="visual-editor">
      {/* Top Control Bar */}
      <div className="control-bar">
        <div className="control-bar-left">
          <h2>🎨 Visual Page Editor</h2>
          <span className="mode-indicator">
            {editMode ? '✏️ Edit Mode (Click banners below)' : '👁️ Preview Mode'}
          </span>
        </div>
        <div className="control-bar-right">
          <a 
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="preview-link-btn"
          >
            🔗 Open Live Website
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

      {/* Split View: Website Preview + Editor */}
      <div className="split-view">
        {/* Left Side: Website Preview */}
        <div className="website-preview-panel">
          <div className="preview-header">
            <div>
              <h3>🌐 Live Website Preview</h3>
              <span className="preview-note">
                {saving ? '🔄 Saving and refreshing...' : 'Changes will appear after saving'}
              </span>
            </div>
            <button 
              className="refresh-iframe-btn"
              onClick={() => setIframeKey(prev => prev + 1)}
              title="Refresh preview"
            >
              🔄 Refresh
            </button>
          </div>
          <iframe 
            key={iframeKey} // Forces reload when key changes
            src={websiteUrl}
            className="website-iframe"
            title="Website Preview"
          />
        </div>

        {/* Right Side: Editable Banners */}
        <div className="editor-panel-container">
          {/* Edit Mode Instructions */}
          {editMode && (
            <div className="edit-instructions">
              <p>
                💡 <strong>How to edit:</strong> Click any banner card below → Edit in side panel → Click gallery to change image → Save changes → Website refreshes automatically
              </p>
            </div>
          )}

          {/* Homepage Banners Preview */}
          <div className="banners-preview">
            <h3 className="section-title">🖼️ Homepage Banners</h3>
            <p className="section-subtitle">Click any banner to edit its content and image</p>
            
            {content.homepageBanners?.filter(b => b.enabled).map((banner, index) => (
              <div 
                key={index}
                className={`banner-preview ${editMode ? 'editable' : ''} ${selectedElement?.type === 'banner' && selectedElement.index === index ? 'selected' : ''}`}
                onClick={() => handleBannerClick(index)}
              >
                <div className="banner-content">
                  <div className="banner-text">
                    <h2>{banner.title || 'Banner Title'}</h2>
                    <h3>{banner.subtitle || 'Subtitle'}</h3>
                    <p>{banner.description || 'Description here...'}</p>
                    <button className="banner-cta">{banner.buttonText || 'SHOP NOW'}</button>
                  </div>
                  <div className="banner-image-container">
                    {banner.imageUrl ? (
                      <img 
                        src={banner.imageUrl} 
                        alt={banner.title}
                        onError={(e) => {
                          e.target.src = '/assets/placeholder.png';
                        }}
                      />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                  </div>
                </div>
                {editMode && (
                  <div className="edit-overlay">
                    ✏️ Click to Edit Banner #{index + 1}
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
                ? `✏️ Editing Banner #${selectedElement.index + 1}`
                : '✏️ Editing Announcement'
              }
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
                        src={content.homepageBanners[selectedElement.index].imageUrl}
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
