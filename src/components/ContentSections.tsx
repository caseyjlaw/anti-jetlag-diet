import { dietSections } from '../content/dietContent'
import styles from './ContentSections.module.css'

export function ContentSections() {
  return (
    <div className={styles.sections}>
      {dietSections.map((section) => (
        <section key={section.id} id={section.id} className={styles.section}>
          <h2>{section.title}</h2>
          <p className={styles.sources}>
            Source{section.sources.length > 1 ? 's' : ''}:{' '}
            {section.sources.map((source, index) => (
              <span key={source.url}>
                {index > 0 && ', '}
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </span>
            ))}
          </p>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          {section.listItems && (
            <ol>
              {section.listItems.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ol>
          )}
          {section.subsections?.map((sub) => (
            <div key={sub.title} className={styles.subsection}>
              <h3>{sub.title}</h3>
              {sub.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
