import React, { useState, useEffect } from 'react'
import classes from './ParsGroupMembers.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'
import styles from '../style/style.module.scss'
import VK from '../VK/VK'

let ParsGroupMembers = props => {
    document.title = 'Все участники групп'

    const [state, changeState] = useState([])
    const [output, changeOutput] = useState([])
    const [isValid, changeIsValid] = useState(true)
    const [isLoading, changeIsLoading] = useState(false)

    const [currentGroup, setCurrentGroup] = useState('')
    const [currentCount, setCurrentCount] = useState('')

    const starter = async () => {
        changeIsLoading(true)
        let resp = await VK.parseGroupMembers(state, setCurrentGroup, setCurrentCount)
        changeOutput(resp)
        setCurrentGroup('')
        setCurrentCount('')
        changeIsLoading(false)
    }


    const start = async () => {
        if (output.length === 0) {
            await starter()
        } else {
            changeOutput([])
            setCurrentGroup('')
            setCurrentCount('')
            await starter()
        }
    }

    return (
        <div className={classes.main}>
            <div className={styles.description}>Скрипт перебирает все указанные вами группы и собирает общий список подписчиков. <br/> Если пользователь состоит в нескольких группах, его id будет упомянут 1 раз. </div>
            <label className={styles.label} htmlFor='textarea'>Список адресов сообществ по 1 ссылке на строку</label>
            <textarea id='textarea' name='textarea' className={`${styles.textarea}`}
                onChange={(e)=>{
                    changeState(e.target.value.split('\n'))
                }}
            />

                {isLoading? null : 
                    <button className={styles.button} onClick={()=>start()} >Начать сбор</button>
                }

                {currentGroup ? <p>Сбор участников сообщества <b>{currentGroup}</b></p> : null}
                {currentCount ? <p>Всего участников собрано <b>{currentCount}</b>  </p> : null}

                
                 {isLoading ? 
                    <div className={loader.loader} /> : null
                    
                }
            
                {output.length === 0 || isLoading ? 
                    null :
                    <>
                    <br></br>
                    <label>Найдено уникальных участников: {output.length}</label>
                    <div className={classes.output}>
                    <CopyButton output={output.map(id=>'https://vk.com/'+id)} />
                    {output.map((id, i)=>(
                        <div key={i} >
                           https://vk.com/{id}
                        </div>
                    ))}
                    </div>
                    </>
                }

            
        </div>
    )
}

export default ParsGroupMembers