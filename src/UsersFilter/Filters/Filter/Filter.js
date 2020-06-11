import React, { useState } from 'react'
import classes from './Filter.module.scss'
import { FaPlus, FaMinus } from 'react-icons/fa';


export const Filter = (props) => {

    const [enable, setEnable] = useState(false)

    return (
        <div className={classes.filter}>
        <div className={classes.titleblock}>
            <div className={classes.add} onClick={()=>{
                setEnable(!enable)
                if (!enable) {
                    props.addFilter(props.name)
                } else {
                    props.delFilter(props.name)
                }
                }}>
                {enable ? <FaMinus className={classes.plus}/> : <FaPlus className={classes.plus}/>}
            </div>
            <span>Фильтр по {props.title}</span>
                
        </div>
        {enable ?
         <div className={classes.children} >
            {props.children}
        </div>
        :
        null
        }
        
        </div>
    )
}