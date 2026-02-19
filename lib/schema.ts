export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Satorus",
  "image": "https://satorus.es/logo.png",
  "@id": "https://satorus.es",
  "url": "https://satorus.es",
  "telephone": "+34600000000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Granada, España",
    "addressLocality": "Granada",
    "postalCode": "18001",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.1773,
    "longitude": -3.5986
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "description": "Expertos en desarrollo de software a medida, ERPs y automatización inteligente para pymes en Granada."
};
