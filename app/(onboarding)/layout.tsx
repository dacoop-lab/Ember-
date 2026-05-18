'use client'

import { usePathname, useRouter } from 'next/navigation'

const STEPS = [
  { label: 'Profile',     path: '/onboarding/profile' },
  { label: 'Identity',    path: '/onboarding/identity' },
  { label: 'Photos',      path: '/onboarding/photos' },
  { label: 'Preferences', path: '/onboarding/preferences' },
]

const BACK: Record<string, string> = {
  '/onboarding/identity':    '/onboarding/profile',
  '/onboarding/photos':      '/onboarding/identity',
  '/onboarding/preferences': '/onboarding/photos',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const currentIndex = STEPS.findIndex((s) => pathname.startsWith(s.path))
  const backHref = BACK[pathname] ?? null

  return (
    <div
      className="flex flex-col min-h-dvh w-full px-6"
      style={{ paddingTop: 'max(48px, var(--safe-top))' }}
    >
      {/* Top bar */}
      <div className="pb-6 flex items-center gap-4 shrink-0">
        {backHref ? (
          <button
            onClick={() => router.push(backHref)}
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full text-ember-300/70 hover:text-ember-300 transition-colors -ml-2"
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-11 shrink-0" />
        )}

        {/* Step indicator */}
        <div className="flex-1 flex items-center">
          {STEPS.map((step, i) => {
            const isCompleted = i < currentIndex
            const isActive    = i === currentIndex

            return (
              <div key={step.path} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isCompleted ? 'bg-ember-600' : isActive ? 'bg-ember-400' : 'bg-ember-900'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium whitespace-nowrap transition-colors ${
                      isCompleted ? 'text-ember-600' : isActive ? 'text-ember-400' : 'text-ember-900'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 mx-1.5 mb-4 transition-colors ${
                      i < currentIndex ? 'bg-ember-600' : 'bg-ember-900'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Page content — flex-1 so continue button pushed to bottom */}
      <div
        className="flex-1 flex flex-col pb-8"
        style={{ paddingBottom: 'max(32px, var(--safe-bottom))' }}
      >
        {children}
      </div>
    </div>
  )
}
