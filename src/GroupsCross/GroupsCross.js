import React, { useState, useEffect } from 'react'
import classes from './GroupsCross.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'
import VK from '../VK/VK'

let GroupsCross = props => {
    document.title = 'Пересечения групп'

    const [state, changeState] = useState([])
    const [output, changeOutput] = useState({})
    const [isValid, changeIsValid] = useState(true)
    const [isLoading, changeIsLoading] = useState(false)
    const [showCount, setShowCount] = useState(false)
    const [min, setMin] = useState(2)

   // let method = ['groups.getMembers', {group_id: 'club75124626', v: '5.73'}]

   let groups = ['https://vk.com/vseti_rabota', 'https://vk.com/frlance', 'club58648198']


   

    
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
            <div className={classes.description}>Скрипт перебирает все указанные вами группы и собирает общий список подписчиков. <br/> Если пользователь состоит в нескольких группах, он попадет в список. </div>
            <label htmlFor='textarea'>Список адресов сообществ по 1 ссылке на строку</label>
            <textarea id='textarea' name='textarea' className={`${classes.textarea} HERE IS THE STYLE IF ERROR`}
                onChange={(e)=>{
                    changeState(e.target.value.split('\n'))
                }}
            />
                <label>
                Пользователь состоит не менее, чем в <input type='number' value={min} onChange={(e)=>{setMin(e.target.value)}}/> группах
                </label>

                <label>
                    <input type='checkbox' onChange={()=>setShowCount(!showCount)}/>
                    Показать на сколько групп подписан пользователь
                </label>
            
                {isLoading? null : 
                    <button className={classes.button} onClick={()=>start()} >Начать сбор пересечений групп</button>
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
                    {/* <CopyButton output={flipFlop()} /> */}
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