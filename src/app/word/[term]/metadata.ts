// app/word/[term]/metadata.ts
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { term: string };
}): Promise<Metadata> {
  const word = params.term;
  let data: any = null;

  try {
    const res = await fetch(
      `https://grab-vocab-1.vercel.app/api/define/${word}`,
      {
        cache: "no-store", // optional: force fresh metadata
      }
    );
    data = await res.json();
  } catch (err) {
    console.error("Failed to fetch word metadata:", err);
  }

  const result = data?.result;
  const title = `Learn "${word}" - GrabVocab`;
  const description =
    result?.meaning || "Expand your vocabulary with GrabVocab.";
  const image =
    result?.imageURL || "https://grab-vocab-1.vercel.app/default-og-image.png";
  const url = `https://grab-vocab-1.vercel.app/word/${word}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
