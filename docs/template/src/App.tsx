import './App.css'
import { Icon, Icons } from '@/components/common'

function App() {
  return (
    <div className="min-h-screen bg-surface-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="heading-1 text-gradient mb-4">
            Adminex
          </h1>
          <p className="text-body text-secondary-600">
            Free React Admin Dashboard Template
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md card-hover">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Icon icon={Icons.bolt} className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="heading-5 text-secondary-900 mb-2">
              Vite Powered
            </h3>
            <p className="text-body-sm text-secondary-500">
              Lightning fast HMR and optimized builds
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md card-hover">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <Icon icon={Icons.palette} className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="heading-5 text-secondary-900 mb-2">
              Tailwind CSS v4
            </h3>
            <p className="text-body-sm text-secondary-500">
              Modern utility-first styling with custom theme
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md card-hover">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
              <Icon icon={Icons.typescript} className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="heading-5 text-secondary-900 mb-2">
              TypeScript
            </h3>
            <p className="text-body-sm text-secondary-500">
              Full type safety and better DX
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center gap-4">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-success-100 text-success-700 text-sm font-medium">
            <span className="w-2 h-2 bg-success-500 rounded-full mr-2 animate-pulse-dot"></span>
            Tailwind CSS Active
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-info-100 text-info-700 text-sm font-medium">
            React 19
          </span>
        </div>

        {/* Glass Card Demo */}
        <div className="mt-12 glass rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-secondary-700">
            <Icon icon={Icons.sparkles} className="w-5 h-5" />
            <p>Glass morphism effect demo</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
