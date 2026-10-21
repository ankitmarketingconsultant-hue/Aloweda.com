import { useState, useEffect } from 'react';

/**
 * LazyImage component for optimized image loading
 * Loads a placeholder first, then loads the actual image
 */
const LazyImage = ({ src, alt, className, placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3C/svg%3E' }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        opacity: imageLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out'
      }}
      loading="lazy"
    />
  );
};

export default LazyImage;
