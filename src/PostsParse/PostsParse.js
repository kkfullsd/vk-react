import React, { useState } from 'react'
import classes from './PostsParse.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'
import VK from '../VK/VK'
import Select from 'react-select'
import {dropdownStyle} from '../style/style'
import loader from '../ui/loader/loader.module.scss'


export const PostsParse = () =>{
    document.title = 'Парс постов со стены'

    const [groups, setGroups] = useState([])
    const [deep, setDeep] = useState(100)
    const [output, setOutput] = useState([])
    const [filter, setFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(false)


    const selectOptions = [
        {value: 'owner', label: 'Записи владельца стены'},
        {value: 'others', label: 'Записи не от владельца стены'},
        {value: 'all', label: 'Все записи на стене'},
    ]


    const startParse = async () => {
        if (groups.length > 0){
            if (output.length === 0) {
                setIsLoading(true) 
                let result = await VK.getGroupPosts(groups, {count: deep, filter: 'all'})
                setOutput(result)
                setIsLoading(false)  
            } else {
                setOutput([])
                setIsLoading(true) 
                let result = await VK.getGroupPosts(groups, {count: deep, filter: 'all'})
                setOutput(result)
                setIsLoading(false) 
            }
        } else {
            alert('Пустой запрос')
        }
       
    }

    return(
        <div className={classes.main} >
            <div className={classes.description} >
                Скрипт перебирает сообщества и собирает посты со стен сообществ
            </div>
            <div>
                <textarea className={classes.textarea}
                    placeholder='Вставьте список адресов сообществ'
                    onChange={(e)=>{
                        setGroups(e.target.value.split('\n'))
                    }}
                />
                <label className={classes.labelSelect}>Чьи записи собирать:
                    <Select
                    styles={dropdownStyle}
                    options={selectOptions}
                    value={selectOptions.filter((obj)=>(obj.value === filter))[0]}
                    onChange={selectedOption=>setFilter(selectOptions.value)}
                    />
                </label>
                <label>Собирать постов со стены группы  
                <input 
                    type='number'
                    min={1}
                    max={100}
                    value={deep}
                    onChange={e=>setDeep(e.target.value)}
                    
                />
                </label>
                <div>
                    <button className={classes.button}
                        onClick={startParse}
                    >Собрать посты</button>
                </div>

                <div>
                    {isLoading ? <div className={loader.loader} /> : null}
                    {output.length > 0 && !isLoading ?
                    <div>
                        <h3>Собрано постов: {output.length}</h3>
                        <div className={classes.output}>
                        <CopyButton output={output} />
                        {output.map((item, index)=>{
                            return(<div key={`${index}`}>{item}</div>)
                        })}    
                        </div>
                    </div>
                    :
                    null
                    }
                </div>
            </div>

        </div>
    )

}