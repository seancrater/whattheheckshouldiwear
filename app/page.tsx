import WhatToWear from "@/components/WhatToWear";

export default function Home() {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-20">
      <main className="flex flex-col items-center justify-center">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">What the heck should I wear?</h1>
        </header>

        <WhatToWear />
      </main>
    </div>
  );
}
