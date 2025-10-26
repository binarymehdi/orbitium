import { OrbitiumLogo } from "../landing/components/nav/components"
import CreateNewFlow from "./new-flow"

const FlowsPage = () => {
  return (
    <div className="flex flex-col">
      <div id="top-nav" className="border-b-1 border-gray-300 h-14"><OrbitiumLogo/></div>
      <div className="flex flex-row">
        <div id="side-nav" className="border-r-1 h-screen w-1/6">
        Projects
        </div>
        <div id="flows-view" className="relative w-full">
          <CreateNewFlow />
          <h1>flows</h1>
        </div>
      </div>
    </div>
  )
}

export default FlowsPage