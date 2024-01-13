import styles from './Sidebar.module.css'
export default function Sidebar({
    title,
    description
}) {
    
    return(
        <div className={styles.layout}>
            <h2 className={styles.title}>{title}</h2>

            <p className={styles.description}>{description}</p>
        </div>
    )
}