import styles from './GroupCreator.module.css'
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';


export default function GroupCreator() {

    return(
        <div className={styles.flexContainer}>
        
            <Sidebar/>               


        <div className={styles.mainContent}>

            <Outlet/>
        

          

        </div>

        </div>
       
    )
}