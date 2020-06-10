import React, { useState, useEffect } from 'react'
import classes from './UsersFilter.module.scss'
import styles from '../style/style.module.scss'
import {Filter} from './Filters/Filter/Filter'

export const UsersFilter = () => {

    const [users, setUsers] = useState([])
    const [filtersList, setFiltersList] = useState([])
    const [sexFilter, setSexFilter] = useState(0)


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

            <Filter //ПО ПОЛУ
                title='полу'
                name='sexFilter'
                addFilter={addFilter}
                delFilter={delFilter}
            >

            </Filter>

            <Filter //ПО ВОЗРАСТУ 
                title='возрасту'
                name='ageFilter'
                addFilter={addFilter}
                delFilter={delFilter}
            >

            </Filter>



            <button className={styles.button} >Фильтровать пользователей</button>


        </div>
    )
}