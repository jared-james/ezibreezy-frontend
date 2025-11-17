// app/(app)/ideas/components/PageHeading.tsx

export default function PageHeading() {
  return (
    <div className="mb-8 border-b-4 border-double border-[--foreground] pb-6">
      <div>
        <p className="eyebrow mb-2">The Newsroom</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
          Idea Wire
        </h1>
        <p className="font-serif text-[--muted] mt-2 max-w-xl text-lg italic">
          Generate, capture, and curate your content ideas and clippings.
        </p>
      </div>
    </div>
  );
}
