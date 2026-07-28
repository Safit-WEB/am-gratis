export const metadata = {
  title: 'Bagi AM Gratis - Alight Motion Premium Gratis',
  description: 'Dapatkan Alight Motion Premium gratis dengan mudah. Support email sendiri atau akun siap pakai.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Ganti dengan AdSense script kamu nanti */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0f0f13', color: '#e4e4e7' }}>
        {children}
      </body>
    </html>
  );
}
