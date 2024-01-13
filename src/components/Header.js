
import styles from "./Header.module.css"
import { Link } from "react-router-dom"

export default function Header() {
    return(
        <header className={styles.header}>
            <h1 className={styles.logo}>Grúbba</h1>
            
            <Link className={styles.link} to="/">Heim</Link>
            
            <Link className={styles.link} to="/innskraning">Skrá inn</Link>


           
        </header>
    )
}