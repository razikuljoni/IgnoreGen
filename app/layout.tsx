import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ignoregen.vercel.app'),
  title: {
    default: 'IgnoreGen | Fast, Custom & AI-Powered .gitignore Generator',
    template: '%s | IgnoreGen',
  },
  description:
    'Generate custom, production-ready .gitignore files for 120+ languages, frameworks, operating systems, and IDEs. Powered by AI stack detection, syntax highlighting, instant copy, and preset sync.',
  keywords: [
    '.gitignore generator',
    'gitignore generator',
    'git ignore builder',
    'git developer tools',
    'create gitignore',
    'ai gitignore generator',
    'node gitignore',
    'python gitignore',
    'react gitignore',
    'vscode gitignore',
    'ignoregen',
    'ignoregen vercel',
    'MD Razikul Islam Joni',
  ],
  authors: [{ name: 'MD Razikul Islam Joni', url: 'https://github.com/razikuljoni' }],
  creator: 'MD Razikul Islam Joni',
  publisher: 'MD Razikul Islam Joni',
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
  alternates: {
    canonical: 'https://ignoregen.vercel.app',
  },
  openGraph: {
    title: 'IgnoreGen | Fast, Custom & AI-Powered .gitignore Generator',
    description:
      'Generate custom, production-ready .gitignore files for 120+ languages, frameworks, operating systems, and IDEs with AI stack detection.',
    url: 'https://ignoregen.vercel.app',
    siteName: 'IgnoreGen',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'IgnoreGen - Fast & Custom .gitignore Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IgnoreGen | Fast, Custom & AI-Powered .gitignore Generator',
    description:
      'Generate custom, production-ready .gitignore files for 120+ languages, frameworks, OS, and IDEs with AI stack detection.',
    images: ['/og-image.svg'],
    creator: '@razikuljoni',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'IgnoreGen',
  alternateName: '.gitignore Generator',
  operatingSystem: 'All',
  applicationCategory: 'DeveloperApplication',
  url: 'https://ignoregen.vercel.app',
  author: {
    '@type': 'Person',
    name: 'MD Razikul Islam Joni',
    url: 'https://github.com/razikuljoni',
  },
  description:
    'Free online .gitignore generator supporting 120+ programming languages, frameworks, IDEs, and operating systems with AI stack analyzer.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
