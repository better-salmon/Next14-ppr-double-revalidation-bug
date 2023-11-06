import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CacheStateWatcher } from "../../components/cache-state-watcher";
import { RevalidateButton } from "../../components/revalidate-button";

export const dynamicParams = true;

export const revalidate = 5;

export default async function Page(): Promise<JSX.Element> {
  const response = await fetch("http://localhost:8081/count", {
    next: { tags: ["count-tag"] },
  });

  if (!response.ok) {
    notFound();
  }

  const data = (await response.json()) as { unixTimeMs: number; count: number };

  return (
    <main>
      <h3>
        Partial Pre-Rendering (PPR) Causes Duplicate Fetch Calls on Page
        Revalidation
      </h3>
      <div>
        Count: <span>{data.count}</span>
      </div>
      <Suspense fallback={null}>
        <CacheStateWatcher
          revalidateAfter={revalidate * 1000}
          time={data.unixTimeMs}
        />
        <RevalidateButton revalidate="/count" type="path" />
        <RevalidateButton revalidate="count-tag" type="tag" />
      </Suspense>
    </main>
  );
}
