import type {ActivityOption} from '@/lib/utils/formatRegistrationFields'

export default function ActivityCheckboxList({
  options,
  selectedValues,
  onToggle,
  disabled = false,
  idPrefix,
}: {
  options: ActivityOption[]
  selectedValues: string[]
  onToggle: (value: string) => void
  disabled?: boolean
  idPrefix: string
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.value)
        const checkboxId = `${idPrefix}_${option.value}`

        return (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id={checkboxId}
                checked={isChecked}
                onChange={() => onToggle(option.value)}
                disabled={disabled}
                className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 transition-all duration-300 ease-out focus:ring-2 focus:ring-blue-100 focus:border-blue-600 hover:border-gray-400 cursor-pointer"
              />
            </div>
            <label htmlFor={checkboxId} className="ml-3 cursor-pointer flex flex-col gap-1">
              <span className="text-sm text-gray-700 font-semibold">{option.label}</span>
              {option.description && (
                <span className="block text-xs font-medium text-gray-500 max-w-md">
                  {option.description}
                </span>
              )}
            </label>
          </div>
        )
      })}
    </div>
  )
}
