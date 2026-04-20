import './globals.css';

export const metadata = {
  title: 'Truyện Tranh AI — Đọc Truyện Tạo Bằng AI Miễn Phí',
  description: 'Kho truyện tranh được tạo 100% bằng trí tuệ nhân tạo. Đọc miễn phí, cập nhật liên tục. Ủng hộ để tạo thêm truyện hay!',
  keywords: 'truyện tranh AI, AI comic, đọc truyện online, truyện tranh miễn phí, manga AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body>{children}</body>
    </html>
  );
}
