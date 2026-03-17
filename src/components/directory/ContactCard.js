// components/directory/ContactCard.js
import PropTypes from 'prop-types';

export default function ContactCard({ contactInfo }) {
  // Destructure the props from the new listingdata ACF wrapper
  const {
    addressStreet,
    addressCity,
    addressState,
    addressZipCode,
    phoneNumber,
    businessEmail,
    websiteUrl,
  } = contactInfo.listingdata || {};

  return (
    <div className="contact-card">
      <h3 className="contact-card__title">Business Info</h3>
      
      <div className="contact-card__details">
        {/* Address Setup */}
        {(addressStreet || addressCity) && (
          <address className="contact-card__item contact-card__address">
            <strong>Address:</strong><br />
            {addressStreet}<br />
            {addressCity}, {addressState} {addressZipCode}
          </address>
        )}

        {/* Actionable Phone Link */}
        {phoneNumber && (
          <div className="contact-card__item contact-card__phone">
            <strong>Phone:</strong> <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
          </div>
        )}

        {/* Actionable Email Link */}
        {businessEmail && (
          <div className="contact-card__item contact-card__email">
            <strong>Email:</strong> <a href={`mailto:${businessEmail}`}>{businessEmail}</a>
          </div>
        )}

        {/* External Website Link */}
        {websiteUrl && (
          <div className="contact-card__item contact-card__website">
            <strong>Website:</strong>{' '}
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

ContactCard.propTypes = {
  contactInfo: PropTypes.shape({
    listingdata: PropTypes.object,
  }).isRequired,
};
