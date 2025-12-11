import React, { useState, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';
import { uploadFile } from '../api/order';
import API_BASE_URL from '../api/config';
import { toast } from 'react-toastify';

const Settings = () => {
  const [signatureUrl, setSignatureUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      const data = await response.json();
      if (data.signatureUrl) {
        setSignatureUrl(data.signatureUrl);
        setPreviewUrl(data.signatureUrl);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadFile(file);
      setSignatureUrl(result.url);
      setPreviewUrl(result.url);
    } catch (error) {
      toast.error('Failed to upload signature');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureUrl })
      });
      toast.success('Signature saved successfully!');
    } catch (error) {
      toast.error('Failed to save signature');
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your application settings</p>
      </div>

      <div className="settings-content">
        <div className="settings-card">
          <h3>Invoice Signature</h3>
          <p className="settings-description">Upload signature image to appear on invoices</p>
          
          <div className="signature-upload">
            <input
              type="file"
              id="signature-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="signature-upload" className="upload-btn">
              <Upload size={20} />
              {uploading ? 'Uploading...' : 'Upload Signature'}
            </label>

            {previewUrl && (
              <div className="signature-preview">
                <img src={previewUrl} alt="Signature" />
              </div>
            )}

            <button 
              className="btn btn-primary save-btn" 
              onClick={handleSave}
              disabled={!signatureUrl}
            >
              <Save size={20} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
