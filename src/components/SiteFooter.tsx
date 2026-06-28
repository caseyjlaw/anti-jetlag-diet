import styles from './SiteFooter.module.css'

const REPO_URL = 'https://github.com/caseyjlaw/anti-jetlag-diet'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.disclaimer}>
        This site is an unofficial educational recreation and is not affiliated
        with Argonne National Laboratory or AntiJetLagDiet.com LLC.
      </p>
      <p>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          View project on GitHub
        </a>
      </p>
    </footer>
  )
}
