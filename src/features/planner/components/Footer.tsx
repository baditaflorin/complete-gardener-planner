import { GitFork, HeartHandshake } from 'lucide-react'
import { buildInfo } from '../../../generated/buildInfo'

export function Footer() {
  return (
    <footer className="footer">
      <span>Version {buildInfo.version}</span>
      <span>
        Commit{' '}
        <a href={`${buildInfo.repositoryUrl}/commit/${buildInfo.commit}`} target="_blank" rel="noreferrer">
          {buildInfo.commit}
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
