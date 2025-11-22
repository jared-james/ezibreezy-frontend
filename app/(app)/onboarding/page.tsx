// app/(app)/onboarding/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

type OnboardingStep = "welcome" | "about" | "goals" | "style" | "complete";

function getStepNumber(step: OnboardingStep): number {
  switch (step) {
    case "welcome":
      return 0;
    case "about":
      return 1;
    case "goals":
      return 2;
    case "style":
      return 3;
    case "complete":
      return 4;
    default:
      return 0;
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("welcome");

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Step {getStepNumber(step)} of 4</span>
            <span>{Math.round((getStepNumber(step) / 4) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(getStepNumber(step) / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === "welcome" && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to EziBreezi! 👋
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Let&apos;s get you set up in just a few minutes. We&apos;ll learn
              about you and your content goals so we can help you create amazing
              content.
            </p>
            <button
              onClick={() => setStep("about")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === "about" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Tell us about yourself
            </h2>
            <p className="text-gray-600 mb-8">
              This helps us generate content that&apos;s relevant to you
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What should we call you?
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What do you do?
                </label>
                <textarea
                  rows={4}
                  placeholder="I'm a content creator, entrepreneur, marketer..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What&apos;s your industry or niche?
                </label>
                <input
                  type="text"
                  placeholder="e.g., SaaS, Marketing, Fitness, Finance"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep("welcome")}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium inline-flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={() => setStep("goals")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === "goals" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What are your content goals?
            </h2>
            <p className="text-gray-600 mb-8">
              Select all that apply - this helps us tailor content ideas for you
            </p>

            <div className="space-y-3 mb-8">
              {[
                {
                  title: "Build an audience",
                  description: "Grow followers and expand your reach",
                },
                {
                  title: "Drive traffic",
                  description: "Get more visitors to your website or product",
                },
                {
                  title: "Generate leads",
                  description: "Attract potential customers",
                },
                {
                  title: "Establish thought leadership",
                  description: "Position yourself as an expert in your field",
                },
                {
                  title: "Share knowledge",
                  description: "Educate and help your audience",
                },
                {
                  title: "Build a personal brand",
                  description: "Grow your professional reputation",
                },
              ].map((goal) => (
                <label
                  key={goal.title}
                  className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{goal.title}</p>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("about")}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium inline-flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={() => setStep("style")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === "style" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Define your writing style
            </h2>
            <p className="text-gray-600 mb-8">
              Help our AI match your unique voice
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What tone do you prefer?
                </label>
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
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{tone}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste a few examples of your writing (optional)
                </label>
                <textarea
                  rows={6}
                  placeholder="Add 2-3 examples of posts you've written..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep("goals")}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium inline-flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
