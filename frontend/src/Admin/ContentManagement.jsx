import { useState, useEffect } from 'react';
import './ProductsManagement.css'; // Reuse same CSS

const ContentManagement = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('announcement');
  const [saving, setSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchContent();
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

  const updateAnnouncement = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/content/announcement`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          enabled: content.announcementBar.enabled,
          messages: content.announcementBar.messages
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Announcement bar updated!');
      } else {
        alert('❌ Failed to update: ' + data.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error updating announcement');
    } finally {
      setSaving(false);
    }
  };

  const addAnnouncementMessage = () => {
    setContent({
      ...content,
      announcementBar: {
        ...content.announcementBar,
        messages: [
          ...content.announcementBar.messages,
          { text: 'New announcement', bgColor: '#2d5f3f' }
        ]
      }
    });
  };

  const updateAnnouncementMessage = (index, field, value) => {
    const newMessages = [...content.announcementBar.messages];
    newMessages[index][field] = value;
    setContent({
      ...content,
      announcementBar: {
        ...content.announcementBar,
        messages: newMessages
      }
    });
  };

  const deleteAnnouncementMessage = (index) => {
    const newMessages = content.announcementBar.messages.filter((_, i) => i !== index);
    setContent({
      ...content,
      announcementBar: {
        ...content.announcementBar,
        messages: newMessages
      }
    });
  };

  if (loading) {
    return (
      <div className="products-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return <div>No content found</div>;
  }

  return (
    <div className="products-management">
      <div className="page-header">
        <div>
          <h2>📝 Content Management</h2>
          <p>Manage website content, banners, and text</p>
        </div>
        <button className="refresh-btn" onClick={fetchContent}>
          🔄 Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '0'
      }}>
        <button
          onClick={() => setActiveTab('announcement')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'announcement' ? '#2d5f3f' : 'transparent',
            color: activeTab === 'announcement' ? 'white' : '#6b7280',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.2s'
          }}
        >
          📢 Announcement Bar
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'contact' ? '#2d5f3f' : 'transparent',
            color: activeTab === 'contact' ? 'white' : '#6b7280',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.2s'
          }}
        >
          📞 Contact Info
        </button>
      </div>

      {/* Announcement Bar Tab */}
      {activeTab === 'announcement' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={content.announcementBar.enabled}
                onChange={(e) => setContent({
                  ...content,
                  announcementBar: { ...content.announcementBar, enabled: e.target.checked }
                })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              Enable Announcement Bar
            </label>
          </div>

          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Messages</h3>

          {content.announcementBar.messages.map((msg, index) => (
            <div key={index} style={{ 
              marginBottom: '16px', 
              padding: '16px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              background: '#f9fafb'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                  Message Text:
                </label>
                <input
                  type="text"
                  value={msg.text}
                  onChange={(e) => updateAnnouncementMessage(index, 'text', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '15px'
                  }}
                  placeholder="🎉 Your announcement message"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                    Background Color:
                  </label>
                  <input
                    type="color"
                    value={msg.bgColor || '#2d5f3f'}
                    onChange={(e) => updateAnnouncementMessage(index, 'bgColor', e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                    Link (optional):
                  </label>
                  <input
                    type="text"
                    value={msg.link || ''}
                    onChange={(e) => updateAnnouncementMessage(index, 'link', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '15px'
                    }}
                    placeholder="/shop"
                  />
                </div>

                <button
                  onClick={() => deleteAnnouncementMessage(index)}
                  style={{
                    padding: '10px 16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    height: '40px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={addAnnouncementMessage}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px'
              }}
            >
              ➕ Add Message
            </button>

            <button
              onClick={updateAnnouncement}
              disabled={saving}
              style={{
                padding: '12px 32px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? '💾 Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Contact Info Tab */}
      {activeTab === 'contact' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Contact Information</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Phone Number:
              </label>
              <input
                type="text"
                value={content.contactInfo?.phone || ''}
                onChange={(e) => setContent({
                  ...content,
                  contactInfo: { ...content.contactInfo, phone: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '15px'
                }}
                placeholder="+91 1234567890"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Email:
              </label>
              <input
                type="email"
                value={content.contactInfo?.email || ''}
                onChange={(e) => setContent({
                  ...content,
                  contactInfo: { ...content.contactInfo, email: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '15px'
                }}
                placeholder="info@aloweda.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                WhatsApp Number:
              </label>
              <input
                type="text"
                value={content.contactInfo?.whatsappNumber || ''}
                onChange={(e) => setContent({
                  ...content,
                  contactInfo: { ...content.contactInfo, whatsappNumber: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '15px'
                }}
                placeholder="+91 1234567890"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Address:
              </label>
              <textarea
                value={content.contactInfo?.address || ''}
                onChange={(e) => setContent({
                  ...content,
                  contactInfo: { ...content.contactInfo, address: e.target.value }
                })}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '15px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Your business address"
              />
            </div>
          </div>

          <button
            onClick={async () => {
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
                  alert('✅ Contact info updated!');
                }
              } catch (err) {
                alert('❌ Error updating contact info');
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
            style={{
              marginTop: '20px',
              padding: '12px 32px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? '💾 Saving...' : '💾 Save Contact Info'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
