function Card({ title, href }: { title: string; href: string }) {
  return (
    <a href={href} className="block rounded-lg border bg-white p-4 hover:shadow">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-500">Open {title}</div>
    </a>
  );
}

export default function Home() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">TC-S World Mini</h1>
      <p>Identify items, price them in <strong>kWh → Solar → Rays</strong>, and trade in the Market with the situationally-aware wallet.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card title="Identify" href="/identify" />
        <Card title="Market" href="/market" />
        <Card title="Wallet" href="/wallet" />
      </div>
    </div>
  );
}
