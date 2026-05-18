interface StepHeaderProps {
  step: number
  total: number
  title: string
  subtitle?: string
}

export function StepHeader({ step, total, title, subtitle }: StepHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex gap-1 mb-6">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-ember-400' : 'bg-ember-900'
            }`}
          />
        ))}
      </div>
      <h2 className="text-2xl font-semibold text-[#F5E6DC]">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-ember-200/60">{subtitle}</p>}
    </div>
  )
}
