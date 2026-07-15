export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    name: 'K.K. Danny Enterprise',
    description: 'Building materials and hardware supplier in Adeiso, Eastern Region, Ghana. Cement, steel, roofing, paint, tiles, timber, tools, and same-day delivery.',
    url: 'https://kkdannyenterprise.com',
    telephone: ['+233244754803', '+233249986118', '+233240268125'],
    email: 'info@kkdannyenterprise.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Opp. Radiance Gas Filling Station, Near Point 3 Hotel',
      addressLocality: 'Adeiso',
      addressRegion: 'Eastern Region',
      addressCountry: 'GH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 5.8718,
      longitude: -0.3773,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '09:00',
        closes: '15:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Building Materials',
      itemListElement: [
        'Cement & Concrete', 'Steel & Reinforcement', 'Roofing Materials',
        'Paint & Finishes', 'Tiles & Flooring', 'Timber & Lumber',
        'Hardware & Fasteners', 'Tools & Equipment', 'Wire & Mesh', 'Pipes & Plumbing',
      ].map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Product', name } })),
    },
    areaServed: ['Adeiso', 'Nsawam', 'Suhum', 'Akropong-Akuapem', 'Aburi', 'Eastern Region, Ghana'],
    priceRange: '₵',
    currenciesAccepted: 'GHS',
    paymentAccepted: 'Cash, Mobile Money, Bank Transfer',
    sameAs: [
      'https://facebook.com/kkdannyenterprise',
      'https://wa.me/233244754803',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
