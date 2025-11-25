import { Save, Play, Container, ArrowLeft } from 'lucide-react'
import { useUpdateFlow } from '@/shared/integrations/tanstack-query/flows'
import { useWorkflowStore } from '@/shared/store/workflow'
import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

interface PlaygroundNavigationProps {
  flowId: string
}

export const PlaygroundNavigation = ({ flowId }: PlaygroundNavigationProps) => {
  const { nodes, edges } = useWorkflowStore()
  const updateFlow = useUpdateFlow()
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  const handleSaveFlow = async () => {
    try {
      setIsSaving(true)
      await updateFlow.mutateAsync({
        id: flowId,
        data: {
          data: {
            nodes,
            edges,
            ready: true
          }
        }
      })
      toast.success('Flow saved successfully')
    } catch (error) {
      console.error('Failed to save flow:', error)
      toast.error('Failed to save flow')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRunFlow = () => {
    // TODO: Implement run flow logic
    console.log('Run flow clicked')
  }

  const handleWarmupContainers = () => {
    // TODO: Implement warmup containers logic
    console.log('Warmup containers clicked')
  }

  const handleGoBack = () => {
    navigate({ to: '/flows' })
  }

  return (
    <div className='absolute top-5 left-5 z-50 flex gap-2'>
      <button 
        onClick={handleGoBack}
        className="flex items-center gap-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-full transition-all duration-300 ease-in-out group active:scale-110"
      >
        <ArrowLeft className="h-4 w-4 flex-shrink-0" />
        <span className="max-w-0 group-hover:max-w-[100px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2 text-sm font-medium">
          Back
        </span>
      </button>
      <button 
        onClick={handleSaveFlow}
        disabled={isSaving}
        className="flex items-center gap-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group active:scale-110"
      >
        <Save className="h-4 w-4 flex-shrink-0" />
        <span className="max-w-0 group-hover:max-w-[100px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2 text-sm font-medium">
          Save
        </span>
      </button>
      <button 
        onClick={handleWarmupContainers}
        className="flex items-center gap-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-full transition-all duration-300 ease-in-out group active:scale-110"
      >
        <Container className="h-4 w-4 flex-shrink-0" />
        <span className="max-w-0 group-hover:max-w-[120px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2 text-sm font-medium">
          Warmup
        </span>
      </button>
      <button 
        onClick={handleRunFlow}
        className="flex items-center gap-0 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full transition-all duration-300 ease-in-out group active:scale-110"
      >
        <Play className="h-4 w-4 flex-shrink-0" />
        <span className="max-w-0 group-hover:max-w-[100px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2 text-sm font-medium">
          Execute
        </span>
      </button>
    </div>
  )
}
