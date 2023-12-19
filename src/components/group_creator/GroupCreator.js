import { useState, useEffect } from 'react'
import styles from './GroupCreator.module.css'
import Sidebar from './Sidebar';
import Info from './Info';
import Participants from './Participants';
import socketIOClient from 'socket.io-client';
import Events from './Events';
import { Outlet } from 'react-router-dom';


export default function GroupCreator({
    ENDPOINT
}) {

  

    


 
    

    return(
        <div className={styles.flexContainer}>
        
            <Sidebar/>               


        <div className={styles.mainContent}>

            <Outlet/>
        

          

        </div>

        </div>
       
    )
}