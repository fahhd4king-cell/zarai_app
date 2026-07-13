interface FormInputProps {
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: any) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
}: FormInputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-green transition-all ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-farm-green'
        } ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default FormInput
