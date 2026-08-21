import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: '.gitignore Generator | Fast, Customizable & Secure Git Ignores',
  description: 'Easily generate customized .gitignore files for 120+ languages, frameworks, operating systems, and IDEs. Features search, presets, syntax highlighting, local sync, and AI stack detection.',
  openGraph: {
    title: '.gitignore Generator | Fast, Customizable & Secure Git Ignores',
    description: 'Easily generate customized .gitignore files for 120+ languages, frameworks, operating systems, and IDEs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '.gitignore Generator | Fast, Customizable & Secure Git Ignores',
    description: 'Easily generate customized .gitignore files for 120+ languages, frameworks, operating systems, and IDEs.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
