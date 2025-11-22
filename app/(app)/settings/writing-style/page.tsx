// app/(app)/settings/writing-style/page.tsx

export default function WritingStylePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Writing Style</h2>
      <p className="text-gray-600 mb-8">
        Define your unique voice so AI can match your writing style
      </p>

      <form className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tone</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Professional",
              "Casual",
              "Friendly",
              "Authoritative",
              "Conversational",
              "Educational",
            ].map((tone) => (
              <label
                key={tone}
                className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">{tone}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sample Content
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste examples of your writing
              </label>
              <textarea
                rows={6}
                placeholder="Add 2-3 examples of posts you've written that reflect your style..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                The more examples you provide, the better AI can match your
                style
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred post length
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Short (1-2 sentences)</option>
                <option>Medium (3-5 sentences)</option>
                <option>Long (6+ sentences)</option>
                <option>Varies by platform</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  Use emojis in posts
                </span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Include hashtags</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  Add calls-to-action
                </span>
              </label>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Words & Phrases to Avoid
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add words or phrases you don&apos;t want to use
            </label>
            <input
              type="text"
              placeholder="e.g., synergy, leverage, game-changer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple words with commas
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Save Writing Style
          </button>
        </div>
      </form>
    </div>
  );
}
