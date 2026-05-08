import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from './features/shell/ErrorBoundary'
import { PlannerApp } from './features/planner/PlannerApp'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <PlannerApp />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
