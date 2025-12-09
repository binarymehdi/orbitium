import { Save, Play, Container, ArrowLeft } from 'lucide-react'
import { useUpdateFlow } from '@/shared/integrations/tanstack-query/flows'
import { useWorkflowStore } from '@/shared/store/workflow'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

interface PlaygroundNavigationProps {
  flowId: string
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const PlaygroundNavigation = ({ flowId }: PlaygroundNavigationProps) => {
  const { nodes, edges, setNodeExecutionStatus, setIsExecuting, resetExecutionState, setExecutionOutput } = useWorkflowStore()
  const updateFlow = useUpdateFlow()
  const [isSaving, setIsSaving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
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

  const handleRunFlow = useCallback(async () => {
    try {
      resetExecutionState()
      setIsRunning(true)
      setIsExecuting(true)
      
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
      
      toast.info('Executing flow...')
      
      const eventSource = new EventSource(`${API_BASE}/flows/${flowId}/execute/stream`)
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.status === 'running') {
            setNodeExecutionStatus(data.nodeId, 'running')
            toast.info(`Running: ${data.title}`)
          } else if (data.status === 'completed') {
            setNodeExecutionStatus(data.nodeId, 'completed')
          } else if (data.status === 'done') {
            // Engine says done, but wait for backend's "finished" with data_flow
            toast.info('Finishing up...')
          } else if (data.status === 'finished') {
            eventSource.close()
            setIsExecuting(false)
            setIsRunning(false)
            console.log('Execution finished, data:', data)
            const output = data.data_flow || 'Pipeline executed successfully (no output captured)'
            setExecutionOutput(output, data.success !== false)
            if (data.success !== false) {
              toast.success('🎉 Pipeline completed successfully!')
            } else {
              toast.error('Pipeline failed')
            }
          }
        } catch (e) {
          console.error('Failed to parse SSE data:', e)
        }
      }
      
      eventSource.onerror = () => {
        eventSource.close()
        setIsExecuting(false)
        setIsRunning(false)
        toast.error('Connection to execution stream lost')
      }
      
    } catch (error) {
      console.error('Failed to execute flow:', error)
      toast.error('Failed to execute flow')
      setIsExecuting(false)
      setIsRunning(false)
    }
  }, [flowId, nodes, edges, updateFlow, setNodeExecutionStatus, setIsExecuting, resetExecutionState, setExecutionOutput])

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
        disabled={isRunning}
        className="flex items-center gap-0 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group active:scale-110"
      >
        <Play className="h-4 w-4 flex-shrink-0" />
        <span className="max-w-0 group-hover:max-w-[100px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2 text-sm font-medium">
          {isRunning ? 'Running...' : 'Execute'}
        </span>
      </button>
    </div>
  )
}
