import { Button } from '@/shared/components/ui/button'
import { Save, Play } from 'lucide-react'
import { useUpdateFlow } from '@/shared/integrations/tanstack-query/flows'
import { useWorkflowStore } from '@/shared/store/workflow'
import { useState } from 'react'

interface PlaygroundNavigationProps {
  flowId: string
}

export const PlaygroundNavigation = ({ flowId }: PlaygroundNavigationProps) => {
  const { nodes, edges } = useWorkflowStore()
  const updateFlow = useUpdateFlow()
  const [isSaving, setIsSaving] = useState(false)

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
      console.log('Flow saved successfully')
    } catch (error) {
      console.error('Failed to save flow:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRunFlow = () => {
    // TODO: Implement run flow logic
    console.log('Run flow clicked')
  }

  return (
    <div className='absolute top-5 right-5 z-50 flex gap-2'>
      <Button 
        onClick={handleSaveFlow}
        size="icon"
        variant="outline"
        className="bg-white hover:bg-gray-100"
        title="Save flow"
        disabled={isSaving}
      >
        <Save className="h-5 w-5" />
      </Button>
      <Button 
        onClick={handleRunFlow}
        size="icon"
        className="bg-green-600 hover:bg-green-700"
        title="Run flow"
      >
        <Play className="h-5 w-5" />
      </Button>
    </div>
  )
}
