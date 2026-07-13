import { useState } from 'react'
import axios from 'axios'
import FormInput from '../components/FormInput'

function ForageCalculator() {
  const [formData, setFormData] = useState({
    sheepCount: '',
    dailyConsumption: '',
    forageProductivity: '',
    foragePrice: '',
  })
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculate = async (e: any) => {
    e.preventDefault()

    if (
      !formData.sheepCount ||
      !formData.dailyConsumption ||
      !formData.forageProductivity ||
      !formData.foragePrice
    ) {
      alert('جميع الحقول مطلوبة')
      return
    }

    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:3000/api/forage/calculate',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setResults(response.data.results)
    } catch (error) {
      console.error('Error calculating forage:', error)
      alert('خطأ في الحساب')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">🌾 حاسبة علف القصب</h1>
        <p className="text-gray-600 mt-2">احسب احتياجات المزرعة من العلف والمساحة المطلوبة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-6">المدخلات</h2>
          <form onSubmit={handleCalculate} className="space-y-4">
            <FormInput
              label="عدد الأغنام (رأس)"
              type="number"
              placeholder="100"
              value={formData.sheepCount}
              onChange={(e) =>
                setFormData({ ...formData, sheepCount: e.target.value })
              }
              required
            />

            <FormInput
              label="استهلاك العلف اليومي لكل رأس (كج)"
              type="number"
              placeholder="2"
              step="0.1"
              value={formData.dailyConsumption}
              onChange={(e) =>
                setFormData({ ...formData, dailyConsumption: e.target.value })
              }
              required
            />

            <FormInput
              label="إنتاجية فدان القصب (كج/فدان)"
              type="number"
              placeholder="15000"
              value={formData.forageProductivity}
              onChange={(e) =>
                setFormData({ ...formData, forageProductivity: e.target.value })
              }
              required
            />

            <FormInput
              label="سعر طن القصب (ريال)"
              type="number"
              placeholder="500"
              value={formData.foragePrice}
              onChange={(e) =>
                setFormData({ ...formData, foragePrice: e.target.value })
              }
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary mt-6"
            >
              {isLoading ? '⏳ جاري الحساب...' : '📊 احسب'}
            </button>
          </form>
        </div>

        {results && (
          <div className="card bg-green-50 border-2 border-green-200">
            <h2 className="text-xl font-bold mb-6 text-green-900">النتائج</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm">الاحتياج اليومي</p>
                <p className="text-3xl font-bold text-green-600">
                  {results.dailyNeed} كج
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm">الاحتياج السنوي</p>
                <p className="text-3xl font-bold text-green-600">
                  {results.yearlyNeed} كج
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm">مساحة القصب المطلوبة</p>
                <p className="text-3xl font-bold text-green-600">
                  {results.requiredArea} هكتار
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm">التكلفة السنوية للعلف</p>
                <p className="text-3xl font-bold text-green-600">
                  {results.yearlyCost} ريال
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForageCalculator
