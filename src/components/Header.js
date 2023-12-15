import { Link } from "react-router-dom"



export default function Header() {
    return(
        <header className="App-header">
            <h1>Hópurinn</h1>
            <nav>
                <Link to="/">Listi</Link>
                <Link to="/new-group">Nýr hópur</Link>
            </nav>
        </header>
    )
}