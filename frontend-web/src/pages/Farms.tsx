import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import Modal from '../components/Modal'
import FormInput from '../components/FormInput'

function Farms() {
  const [farms, setFarms] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', location: '', area: '' })

  useEffect(() => {
    loadFarms()
  }, [])

  const loadFarms = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/farms', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFarms(response.data)
    } catch (error) {
      console.error('Error loading farms:', error)
    }
  }

  const handleAddFarm = async () => {
    if (!formData.name || !formData.location || !formData.area) {
      alert('جميع الحقول مطلوبة')
      return
    }

    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/api/farms', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFormData({ name: '', location: '', area: '' })
      setIsModalOpen(false)
      loadFarms()
    } catch (error) {
      console.error('Error adding farm:', error)
      alert('خطأ في إضافة المزرعة')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">المزارع والحقول</h1>
          <p className="text-gray-600 mt-2">إدارة مزارعك وحقولك</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          إضافة مزرعة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.length > 0 ? (
          farms.map((farm: any) => (
            <div key={farm.id} className="card hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{farm.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">📍 {farm.location}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <FiEdit2 size={18} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">المساحة:</span> {farm.area} هكتار
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">الحقول:</span> {farm.fields?.length || 0}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">الماشية:</span> {farm.livestock?.length || 0}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">لا توجد مزارع بعد</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="إضافة مزرعة جديدة"
        actionLabel="إضافة"
        onAction={handleAddFarm}
        isLoading={isLoading}
      >
        <FormInput
          label="اسم المزرعة"
          placeholder="مثال: مزرعة النخيل"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <FormInput
          label="الموقع"
          placeholder="مثال: الدمام"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
        <FormInput
          label="المساحة (بالهكتار)"
          type="number"
          placeholder="50"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          required
        />
      </Modal>
    </div>
  )
}

export default Farms
