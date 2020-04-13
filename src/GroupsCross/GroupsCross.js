import React, { useState, useEffect } from 'react'
import classes from './GroupsCross.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'
import VK from '../VK/VK'
import styles from '../style/style.module.scss'

let GroupsCross = props => {
    document.title = 'Пересечения групп'

    const [state, changeState] = useState([])
    const [output, changeOutput] = useState({})
    const [isLoading, changeIsLoading] = useState(false)
    const [showCount, setShowCount] = useState(false)
    const [min, setMin] = useState(2)

    
   let start = async () =>{
        let result = []

        let counter = 0
        changeIsLoading(true)

        
        let iteration = async () => {
            if (counter < state.length) {
                await VK.groupGetAllMembers(state[counter], (output)=>{
                        result.push(...output)
                        counter += 1
                        console.log(counter)
                        iteration(counter)
                    })
                } else {
                    changeOutput(VK.cross(result, min))
                    changeIsLoading(false)
                }
        }
        
        iteration(counter)

   }

   let showcrosses = () => {
       let rend = []
       Object.keys(output).map(id=>rend.push('https://vk.com/id' + id + (showCount ? ' : ' + output[id]  : ' ')))
       return rend
   }


    return (
        <div className={classes.main}>
            <div className={styles.description}>Скрипт перебирает все указанные вами группы и собирает общий список подписчиков. <br/> Если пользователь состоит в нескольких группах, он попадет в список. </div>
            <label className={styles.label} htmlFor='textarea'>Список адресов сообществ по 1 ссылке на строку</label>
            <textarea id='textarea' name='textarea' className={`${styles.textarea} HERE IS THE STYLE IF ERROR`}
                onChange={(e)=>{
                    changeState(e.target.value.split('\n'))
                }}
            />
                <label>
                Пользователь состоит не менее, чем в <input type='number' value={min} onChange={(e)=>{setMin(e.target.value)}}/> группах
                </label>

                <label>
                    <input type='checkbox' className={styles.checkbox} onChange={()=>setShowCount(!showCount)}/>
                    Показать на сколько групп подписан пользователь
                </label>
            
                {isLoading? null : 
                    <button className={styles.button} onClick={()=>start()} >Поиск</button>
                }
                
                 {isLoading ?   
                    <div className={loader.loader}></div> : null
                    
                }
            
                {Object.keys(output).length === 0 || isLoading ? 
                    null :
                    <>
                    <br></br>
                    <label>Найдено участников: {Object.keys(output).length}</label>
                    <div className={classes.output}>
                    <CopyButton output={showcrosses()} />
                    {showcrosses().map((str, index)=>{
                        return (
                            <div key={index} >
                                {str}
                            </div>
                        )
                    })}
                    </div>
                    </>
                }

            
        </div>
    )
}

export default GroupsCross