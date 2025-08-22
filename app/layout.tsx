export const metadata = { title: "TC-S World Mini", description: "Solar Wallet + Market" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <div className="font-bold text-lg">TC-S • World Mini</div>
            <nav className="flex gap-4">
              <a href="/identify" className="no-underline hover:underline">Identify</a>
              <a href="/market" className="no-underline hover:underline">Market</a>
              <a href="/wallet" className="no-underline hover:underline">Wallet</a>
              <a
                href={`${process.env.NEXT_PUBLIC_WORLD_LINK_BASE}/${process.env.NEXT_PUBLIC_APP_ID}`}
                target="_blank" rel="noreferrer" className="ml-2"
              >
                Open in World
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-500">
          1 Solar = {process.env.TCS_KWH_PER_SOLAR} kWh
        </footer>
      </body>
    </html>
  );
}
