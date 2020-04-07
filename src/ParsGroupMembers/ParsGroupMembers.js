import React, { useState, useEffect } from 'react'
import classes from './ParsGroupMembers.module.scss'
import loader from '../ui/loader/loader.module.scss'

let ParsGroupMembers = props => {

    const [state, changeState] = useState([])
    const [state2, changeState2] = useState([])
    const [output, changeOutput] = useState([])
    const [isValid, changeIsValid] = useState(true)
    const [isLoading, changeIsLoading] = useState(false)

   // const [counter, changeCounter] = useState(0)
    const [aimer, changeAimer] = useState(0)



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
            let qs = []
            state.forEach((group)=>{
                let q = group.startsWith('https://vk.com/club') ? group.slice(19) : group.slice(15)
                qs.push(q)
            })
            starter(qs)

        } else {
            changeIsValid(false)
        }   
    }


    return (
        <div className={classes.main}>
            <label htmlFor='textarea'>Список адресов сообществ по 1 ссылке на строку</label>
            <textarea id='textarea' name='textarea' className={classes.textarea}
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
                    <div className={classes.output}>
                        {output.map((id, index)=>{
                            return(
                                <div key={index}>
                                    https://vk.com/id{id}
                                </div>
                            )
                        })}
                    </div>
                }

            
        </div>
    )
}

export default ParsGroupMembers