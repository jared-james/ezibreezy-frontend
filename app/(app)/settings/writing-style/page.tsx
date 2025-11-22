// app/(app)/settings/writing-style/page.tsx

export default function WritingStylePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Writing Style</h2>
      <p className="text-muted-foreground mb-8">
        Define your unique voice so AI can match your writing style
      </p>

      <form className="space-y-6">
        {/* Tone */}
        <div className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Tone
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>
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
                className="flex items-center gap-2 p-3 border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <input type="checkbox" className="border-border" />
                <span className="text-sm text-foreground">{tone}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/50" />

        {/* Writing samples */}
        <div className="pt-2 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Sample Content
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="eyebrow mb-2">
                Paste examples of your writing
              </label>
              <textarea
                rows={6}
                placeholder="Add 2-3 examples of posts you've written that reflect your style..."
                className="w-full px-4 py-2 mt-2 border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-background font-mono text-sm"
              />
              <p className="font-serif text-xs text-muted-foreground mt-1">
                The more examples you provide, the better AI can match your
                style
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        {/* Preferences */}
        <div className="pt-2 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Preferences
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="eyebrow mb-2">Preferred post length</label>
              <select className="w-full px-4 py-2 mt-2 border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-background">
                <option>Short (1-2 sentences)</option>
                <option>Medium (3-5 sentences)</option>
                <option>Long (6+ sentences)</option>
                <option>Varies by platform</option>
              </select>
            </div>

            <div className="h-px bg-border/30" />

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="border-border" />
                <span className="text-sm text-foreground">
                  Use emojis in posts
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="border-border" />
                <span className="text-sm text-foreground">Include hashtags</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="border-border" />
                <span className="text-sm text-foreground">
                  Add calls-to-action
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        {/* Keywords to avoid */}
        <div className="pt-2 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Words & Phrases to Avoid
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div>
            <label className="eyebrow mb-2">
              Add words or phrases you don&apos;t want to use
            </label>
            <input
              type="text"
              placeholder="e.g., synergy, leverage, game-changer"
              className="w-full px-4 py-2 mt-2 border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-background"
            />
            <p className="font-serif text-xs text-muted-foreground mt-1">
              Separate multiple words with commas
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2">
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 font-medium transition-colors"
          >
            Save Writing Style
          </button>
        </div>
      </form>
    </div>
  );
}
