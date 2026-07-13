interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  isLoading?: boolean
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  actionLabel = 'حفظ',
  onAction,
  isLoading,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">{children}</div>

        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            إلغاء
          </button>
          {onAction && (
            <button
              onClick={onAction}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-farm-green text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {isLoading ? '⏳...' : actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal
