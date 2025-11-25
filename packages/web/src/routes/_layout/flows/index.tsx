import FlowsPage from '@/features/flows/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/flows/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FlowsPage/>
}
