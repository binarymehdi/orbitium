import InitializeFlow from '@/features/flow-initialization/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/(private)/initialize-flow')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InitializeFlow/>
}
