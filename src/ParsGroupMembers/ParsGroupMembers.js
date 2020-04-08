import React, { useState, useEffect } from 'react'
import classes from './ParsGroupMembers.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'

let ParsGroupMembers = props => {

    const [state, changeState] = useState([])
    const [output, changeOutput] = useState([])
    const [isValid, changeIsValid] = useState(true)
    const [isLoading, changeIsLoading] = useState(false)

    let search = (q, func) => {

        let counter = 0
   

        window.VK.Api.call('groups.getMembers', {group_id: q, v:'5.73' }, (r)=>{ if (r.response) {
            counter = Math.ceil(r.response.count / 1000)
            iterate(0)
            }             
        })

        let iterate = (num) => {
            if (num < counter) {
               window.VK.Api.call('groups.getMembers', {group_id: q, offset:num*1000, v:'5.73' }, (r)=>{ if (r.response) {
                changeOutput(prevState=>prevState.concat(r.response.items))
                setTimeout(()=>iterate(num+1), 500)
                }             
                }) 
            } else {
                console.log('im here')
                return func()
            }   
        }

    }

    function starter(arr) {
        changeIsLoading(true)
        let counter2 = 0

        let innerStarter = () =>{
            search(arr[counter2], ()=>{
                if (counter2 < arr.length-1) {
                    counter2 += 1
                    innerStarter()
                } else {
                    changeIsLoading(false)
                    
                }
            })
        }

        innerStarter()
        
        
    }



    let filter = () => {
        if (state.length !== 0) {
            changeIsValid(true)
            let funct = output !==[] ? changeOutput([]) : null

            let qs = []
            state.forEach((group)=>{
                let q = group.startsWith('https://vk.com/club') ? group.slice(19) : group.slice(15)
                if (!(q === '' || q === ' ' || q === '\n')) {
                    qs.push(q)
                } 
            })
            starter(qs)

        } else {
            changeIsValid(false)
        }   
    }

    let flipFlop = () => {
        if(output.length > 0 && !isLoading) {
            let arr = []
            let set = new Set(output)
            set.forEach(el=>arr.push(el))
            console.log('flipped flopeed')
            return arr
        }
    }

    useEffect(()=>{
        if (state.length !== 0) {
            changeIsValid(true) }
    })

    let style = isValid ? null : classes.error

    return (
        <div className={classes.main}>
            <div className={classes.description}>Скрипт перебирает все указанные вами группы и собирает общий список подписчиков. <br/> Если пользователь состоит в нескольких группах, его id будет упомянут 1 раз. </div>
            <label htmlFor='textarea'>Список адресов сообществ по 1 ссылке на строку</label>
            <textarea id='textarea' name='textarea' className={`${classes.textarea} ${style}`}
                onChange={(e)=>{
                    changeState(e.target.value.split('\n'))
                }}
            />

                {isLoading? null : 
                    <button className={classes.button} onClick={()=>filter()} >Начать сбор участников групп</button>
                }
                
                 {isLoading ? 
                    <div className={loader.loader}></div> : null
                    
                }
            
                {output.length === 0 || isLoading ? 
                    null :
                    <>
                    <br></br>
                    <label>Найдено участников: {flipFlop().length}</label>
                    <div className={classes.output}>
                    <CopyButton output={flipFlop()} />
                        {flipFlop().map((id, index)=>{
                            return(
                                <div key={index}>
                                    https://vk.com/id{id}
                                </div>
                            )
                        })}
                    </div>
                    </>
                }

            
        </div>
    )
}

export default ParsGroupMembers