'use client';

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { uploadWPImage, updateUserProfile } from '@/lib/actions';
import styles from './ProfileAvatar.module.css';

export default function ProfileAvatar({ user }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Transition: Use user-level featured status
  // Note: if my ACF user field group is named something other than userData in GraphQL, please swap out that key
  const isFeatured = !!user?.userData?.isFeaturedUser;
  const userName = user?.name || 'Business Owner';
  // Fallback chain: customAvatar (ACF) -> avatar (WP Default) -> placeholder
  const currentImage = user?.customAvatar?.customAvatar?.node?.sourceUrl || user?.avatar?.url || user?.avatarUrl || '/placeholder-avatar.jpg'; 

  const validateAndProcessFile = (file) => {
    setError('');
    const maxSize = 2 * 1024 * 1024; // 2MB Limit
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, or WEBP images are allowed.');
      return;
    }
    if (file.size > maxSize) {
      setError('Image must be under 2MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload to WP Media Library
      const formData = new FormData();
      formData.append('file', selectedFile);
      const imageId = await uploadWPImage(formData);

      if (!imageId) throw new Error("Failed to upload image to server.");

      // 2. Update User Profile with new Avatar ID
      await updateUserProfile({ avatarId: imageId });
      
      // 3. Clean up UI and force Next.js to pull the fresh data
      setIsModalOpen(false);
      setSelectedFile(null);
      router.refresh(); 
      
    } catch (err) {
      console.error('Avatar Upload Error:', err);
      setError('Failed to save image. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
  };

  return (
    <>
      {/* Dashboard Avatar Display */}
      <div className={styles['avatar-wrapper']}>
        <button 
          type="button"
          className={`${styles['avatar-container']} ${isFeatured ? styles['avatar-container--verified'] : ''}`}
          onClick={() => setIsModalOpen(true)}
        >
          {/* The Image Wrapper safely constraints the Next.js fill property */}
          <div className={styles['avatar-image-wrap']}>
            <Image 
              src={previewUrl || currentImage} 
              alt={userName} 
              fill 
              style={{ objectFit: 'cover' }} 
              sizes="90px"
            />
            <div className={styles['avatar-hover-overlay']}>
              <span className="material-symbols-outlined">edit</span>
            </div>
          </div>
          
          {/* Gradient Verified Badge */}
          {isFeatured && (
            <div className={styles['avatar-badge']} title="Verified Business">
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', fontWeight: 'bold' }}>check</span>
            </div>
          )}
        </button>
        <h3 className={styles['avatar-name']}>{userName}</h3>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-dialog']}>
            <div className={styles['modal-header']}>
              <h3>Edit Profile Image</h3>
              <button onClick={closeModal} className={styles['modal-close']}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className={styles['modal-body']}>
              {/* Left Side: Drag & Drop Zone */}
              <button 
                type="button"
                className={`${styles['modal-dropzone']} ${isDragging ? styles['modal-dropzone--active'] : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/jpeg, image/png, image/webp" 
                  style={{ display: 'none' }} 
                />
                {previewUrl ? (
                  <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <Image src={previewUrl} alt="Preview" fill style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#64748b', marginBottom: '0.5rem' }}>cloud_upload</span>
                    <p style={{ margin: 0, color: '#475569', fontWeight: 500 }}>Drag & Drop</p>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>or click to browse</span>
                  </>
                )}
              </button>

              {/* Right Side: Actions & Errors */}
              <div className={styles['modal-actions']}>
                <div>
                  <p style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Upload a professional photo or logo to help customers recognize your business.
                  </p>
                  <ul style={{ margin: '0 0 1.5rem 0', paddingLeft: '1.2rem', color: '#64748b', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li>JPEG, PNG, or WEBP</li>
                    <li>Max file size: 2MB</li>
                    <li>1:1 Square aspect ratio best</li>
                  </ul>
                </div>
                
                {error && <div className={styles['modal-error']}>{error}</div>}
                
                <button 
                  onClick={handleSave} 
                  className={styles['btn-save']}
                  disabled={!selectedFile || isSubmitting}
                >
                  {isSubmitting ? 'Uploading...' : 'Save Image'}
                </button>
                <button onClick={closeModal} className={styles['btn-cancel']} disabled={isSubmitting}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ProfileAvatar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    userData: PropTypes.shape({
      isFeaturedUser: PropTypes.bool
    }),
    avatarUrl: PropTypes.string,
    avatar: PropTypes.shape({
      url: PropTypes.string
    }),
    customAvatar: PropTypes.shape({
      customAvatar: PropTypes.shape({
        node: PropTypes.shape({
          sourceUrl: PropTypes.string
        })
      })
    })
  })
};
