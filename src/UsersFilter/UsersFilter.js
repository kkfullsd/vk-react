import React, { useState, useEffect } from 'react'
import classes from './UsersFilter.module.scss'
import styles from '../style/style.module.scss'
import {Filter} from './Filters/Filter/Filter'
import VK from '../VK/VK'

export const UsersFilter = () => {

    const [users, setUsers] = useState([])
    const [status, setStatus] = useState('')

    //ФИЛЬТРЫ
    const [filtersList, setFiltersList] = useState([])
    const [sexFilter, setSexFilter] = useState(0)
    const [minAgeFilter, setMinAgeFilter] = useState(0)
    const [maxAgeFilter, setMaxAgeFilter] = useState(99)


    const startFilter = () =>{
        let filters = {
            sexFilter,
            minAgeFilter,
            maxAgeFilter,
        }
        VK.getUsers(users, filtersList, filters, statusUpdater)
    }

    const statusUpdater = num => {
        setStatus(`${num}`)
    }

    const addFilter = filterName => {
        setFiltersList(filtersList.concat(filterName))
    }

    const delFilter = filterName => {
        setFiltersList(filtersList.filter((elem)=>elem !== filterName))
    }

    return (
        <div className={classes.main} >
            <div className={styles.description} >
                Скрипт фильтрует пользователей по параметрам.
            </div>

            <textarea className={styles.textarea}
                    placeholder='Вставьте список адресов пользователей'
                    onChange={(e)=>{
                        setUsers(e.target.value.split('\n'))
                    }}
            />

            <Filter //ПО ПОЛУ 'sexFilter'
                title='полу'
                name='sexFilter'
                addFilter={addFilter}
                delFilter={delFilter}
            >
                <label className={classes.radiolabel}>
                    <input type="radio" name='sex' onChange={()=>setSexFilter(2)}/>Только мужчины
                </label>
                <label className={classes.radiolabel}>
                    <input type="radio" name='sex' onChange={()=>setSexFilter(1)} />Только женщины
                </label>

            </Filter>

            <Filter //ПО ВОЗРАСТУ 'ageFilter' 
                title='возрасту'
                name='ageFilter'
                addFilter={addFilter}
                delFilter={delFilter}
            >
                <label className={classes.numLabel}>От
                    <input type='number' onChange={e=>setMinAgeFilter(+e.target.value)} value={minAgeFilter}/>
                    лет
                </label>
                
                <label className={classes.numLabel}>До
                    <input type='number' onChange={e=>setMaxAgeFilter(+e.target.value)} value={maxAgeFilter}/>
                    лет
                </label>
            </Filter>



            <button className={styles.button} onClick={startFilter}>Фильтровать пользователей</button>
            <span>Пользователей собрано: {status}</span>


        </div>
    )
}