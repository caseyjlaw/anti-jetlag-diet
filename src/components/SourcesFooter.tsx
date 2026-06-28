import { PRIMARY_SOURCES } from '../content/dietContent'
import styles from './SourcesFooter.module.css'

const REPO_URL = 'https://github.com/caseyjlaw/anti-jetlag-diet'

export function SourcesFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.lead}>Content adapted from public sources.</p>
      <ul>
        {PRIMARY_SOURCES.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.label}
            </a>
          </li>
        ))}
        <li>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            Project source on GitHub
          </a>
        </li>
      </ul>
      <p className={styles.disclaimer}>
        This site is an unofficial educational recreation and is not affiliated
        with Argonne National Laboratory or AntiJetLagDiet.com LLC.
      </p>
    </footer>
  )
}
