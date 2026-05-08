import { useEffect, useState } from 'react'
import { GitFork, HeartHandshake } from 'lucide-react'
import { buildInfo } from '../../../generated/buildInfo'
import { fetchLatestCommit, type GitHubCommit } from '../../../lib/github'

export function Footer() {
  const [latest, setLatest] = useState<GitHubCommit | null>(null)

  useEffect(() => {
    void fetchLatestCommit().then(setLatest)
  }, [])

  return (
    <footer className="footer">
      <span>Version {buildInfo.version}</span>
      <span>
        Commit{' '}
        <a
          href={latest?.url ?? `${buildInfo.repositoryUrl}/commit/${buildInfo.commit}`}
          target="_blank"
          rel="noreferrer"
        >
          {latest?.sha ?? buildInfo.commit}
        </a>
      </span>
      <a href={buildInfo.repositoryUrl} target="_blank" rel="noreferrer">
        <GitFork size={15} /> GitHub repo
      </a>
      <a href={buildInfo.paypalUrl} target="_blank" rel="noreferrer">
        <HeartHandshake size={15} /> PayPal
      </a>
    </footer>
  )
}
