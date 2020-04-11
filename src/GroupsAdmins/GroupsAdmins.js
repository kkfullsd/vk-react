import React, { useState } from 'react'
import classes from './GroupsAdmins.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'
import VK from '../VK/VK'

let GroupsAdmins = props => {
    document.title = 'Поиск администраторов групп'

    const [state, changeState] = useState([])
    const [output, changeOutput] = useState([])
    const [isLoading, changeIsLoading] = useState(false)
    const [showAdv, setShowAdv] = useState(false)

    
   let start = async () => {
       changeIsLoading(true)
       await VK.groupsAdmins(state, (response)=>{
            changeOutput(response)
            console.log(response)
            changeIsLoading(false)
       })
   }
        


    return (
        <div className={classes.main}>
            <div className={classes.description}>Проверяет все сообщества из вашего списка, просматривает блок «Контакты» в каждом и собирает оттуда данные всех администраторов. <br/>
Если человек является администратором группы, но в блоке «Контакты» этого не указано, то скрипт этого узнать не сможет.</div>
            <label htmlFor='textarea'>Список адресов сообществ по 1 ссылке на строку</label>
            <textarea id='textarea' name='textarea' className={`${classes.textarea} HERE IS THE STYLE IF ERROR`}
                onChange={(e)=>{
                    changeState(e.target.value.split('\n'))
                }}
            />
            <label>
                <input type ='checkbox' 
                onChange={()=>{setShowAdv(prevState=>!prevState)}}
                
            />
            ID вида 12345 — для рекламного кабинета ВК
            </label>
            
                
            
                {isLoading? null : 
                    <button className={classes.button} onClick={()=>start()} >Начать сбор администраторов групп</button>
                }
                
                 {isLoading ?   
                    <div className={loader.loader}></div> : null
                    
                }
            
                {output.length === 0 || isLoading ? 
                    null :
                    <>
                    <br></br>
                    <label>Найдено адмиинистраторов: {output.length}</label>
                    <div className={classes.output}>
                    {/* <CopyButton output={showcrosses()} /> */}
                    {output.map((obj, index)=>{
                        if (showAdv) {
                            return (
                                <div key={index} >
                                    {obj.user_id}
                                </div>
                            )
                        } else {
                            return (
                                <div key={index} >
                                   https://vk.com/id{obj.user_id}
                                </div>
                            )
                        }
                        
                    })}
                    </div>
                    </>
                }

            
        </div>
    )
}

export default GroupsAdmins