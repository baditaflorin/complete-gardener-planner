export type GitHubCommit = {
  sha: string
  url: string
}

export async function fetchLatestCommit(): Promise<GitHubCommit | null> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 2500)
  try {
    const response = await fetch('https://api.github.com/repos/baditaflorin/complete-gardener-planner/commits/main', {
      signal: controller.signal,
    })
    if (!response.ok) {
      return null
    }
    const payload = (await response.json()) as { sha?: string; html_url?: string }
    if (!payload.sha || !payload.html_url) {
      return null
    }
    return { sha: payload.sha.slice(0, 7), url: payload.html_url }
  } catch {
    return null
  } finally {
    window.clearTimeout(timeout)
  }
}
