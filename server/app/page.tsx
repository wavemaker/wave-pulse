"use client";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  router.replace('/pulse');
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      
    </section>
  );
}
