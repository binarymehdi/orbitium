import { OrbitiumLogo } from "../landing/components/nav/components"
import FlowsList from "./components/flows-list"
import CreateNewFlow from "./new-flow"

const FlowsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-6">
          <OrbitiumLogo />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Flows</h1>
              <p className="mt-2 text-gray-600">Create and manage your workflow automations</p>
            </div>
            <CreateNewFlow />
          </div>

          {/* Flows List */}
          <FlowsList />
        </div>
      </main>
    </div>
  )
}

export default FlowsPage