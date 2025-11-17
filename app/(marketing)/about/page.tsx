// app/(marketing)/about/page.tsx

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About EziBreezi</h1>

      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700">
            EziBreezi helps you think through what you want to say, capture it
            quickly, and turn it into posts without social feeling like a second
            or third full-time job.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-700">
            [Product explanation goes here]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-700">
            [Call to action content goes here]
          </p>
        </section>
      </div>
    </div>
  );
}
