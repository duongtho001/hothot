import './globals.css';

const siteUrl = 'https://truyentranhai.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Truyện Tranh AI — Đọc Truyện Tạo Bằng AI Miễn Phí',
    template: '%s — Truyện Tranh AI',
  },
  description: 'Kho truyện tranh được tạo 100% bằng trí tuệ nhân tạo. Đọc miễn phí hơn 21 thể loại: Hành Động, Tu Tiên, Võ Hiệp, Tái Sinh, Lãng Mạn... Cập nhật liên tục.',
  keywords: [
    'truyện tranh AI', 'đọc truyện online', 'truyện tranh miễn phí', 
    'manga AI', 'manhwa AI', 'truyện tu tiên', 'truyện cổ trang',
    'truyện chuyển sinh', 'truyện tranh hay', 'truyentranhai',
    'đọc truyện tranh', 'comic AI', 'webtoon AI',
  ],
  authors: [{ name: 'Đường Thọ' }],
  creator: 'Đường Thọ',
  publisher: 'Truyện Tranh AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    siteName: 'Truyện Tranh AI',
    title: 'Truyện Tranh AI — Đọc Truyện Tạo Bằng AI Miễn Phí',
    description: 'Kho truyện tranh đa thể loại được tạo 100% bằng AI. Đọc miễn phí, cập nhật liên tục!',
    images: [
      {
        url: '/hero-banner.png',
        width: 1200,
        height: 630,
        alt: 'Truyện Tranh AI — Đọc Truyện Miễn Phí',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Truyện Tranh AI — Đọc Truyện Tạo Bằng AI Miễn Phí',
    description: 'Kho truyện tranh đa thể loại được tạo 100% bằng AI. Đọc miễn phí!',
    images: ['/hero-banner.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
};

// Structured Data (JSON-LD) for Google Rich Results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Truyện Tranh AI',
  url: siteUrl,
  description: 'Kho truyện tranh được tạo 100% bằng trí tuệ nhân tạo. Đọc miễn phí hơn 21 thể loại.',
  publisher: {
    '@type': 'Person',
    name: 'Đường Thọ',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/moi-cap-nhat?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
