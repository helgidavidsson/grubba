import styles from './Sidebar.module.css'
export default function Sidebar({
    title,
    description
}) {
    
    return(
        <div className={styles.layout}>
            <h2>{title}</h2>

            <p>{description}</p>
        </div>
    )
}