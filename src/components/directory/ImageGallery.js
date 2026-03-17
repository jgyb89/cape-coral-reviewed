// components/directory/ImageGallery.js
import Image from 'next/image';
import PropTypes from 'prop-types';

export default function ImageGallery({ images, videoUrl }) {
  if (!images || images.length === 0) {
    return null; // Return nothing if the business hasn't uploaded media
  }

  // Separate the first image to act as the "Hero" or main display
  const [mainImage, ...thumbnails] = images;

  return (
    <section className="image-gallery">
      {/* Main Feature Image */}
      <figure className="image-gallery__main">
        <Image
          src={mainImage.sourceUrl}
          alt={mainImage.altText || 'Featured business image'}
          width={mainImage.mediaDetails?.width || 800}
          height={mainImage.mediaDetails?.height || 600}
          priority // Tells Next.js to preload this specific image for faster LCP
          className="image-gallery__image"
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </figure>

      {/* Thumbnail Grid for the rest of the gallery */}
      {thumbnails.length > 0 && (
        <div className="image-gallery__thumbnails">
          {thumbnails.map((img) => (
            <figure key={img.id || img.sourceUrl} className="image-gallery__thumb">
              <Image
                src={img.sourceUrl}
                alt={img.altText || 'Gallery image'}
                width={img.mediaDetails?.width || 400}
                height={img.mediaDetails?.height || 300}
                className="image-gallery__image"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </figure>
          ))}
        </div>
      )}

      {/* Optional Video Link Rendering */}
      {videoUrl && (
        <div className="image-gallery__video">
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="image-gallery__video-link">
            Watch Video Tour
          </a>
        </div>
      )}
    </section>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      sourceUrl: PropTypes.string.isRequired,
      altText: PropTypes.string,
      mediaDetails: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
      }),
    })
  ).isRequired,
  videoUrl: PropTypes.string,
};
