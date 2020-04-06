import React, { useState, useEffect } from 'react'
import classes from './ParsGroupMembers.module.scss'

let ParsGroupMembers = props => {

    const [state, changeState] = useState([])
    const [output, changeOutput] = useState([])
    const [isValid, changeIsValid] = useState(true)
   // const [counter, changeCounter] = useState(0)
    const [aimer, changeAimer] = useState(0)



    let search = (q) => {
        let counter = 0

        window.VK.Api.call('groups.getMembers', {group_id: q, v:'5.73' }, (r)=>{ if (r.response) {
            let num = Math.ceil(r.response.count / 1000)
            counter = num
            iterate(0)
            }             
        })

        let iterate = (num) => {
            if (num < counter) {
               window.VK.Api.call('groups.getMembers', {group_id: q, offset:num*1000, v:'5.73' }, (r)=>{ if (r.response) {
                console.log(q, ' ', r.response)
                setTimeout(()=>iterate(num+1), 500)
                }             
                }) 
            } else {
                //????????????
            }
            
        }

    }




    let filter = () => {
        if (state.length !== 0) {
            state.forEach((group)=>{
                let q = group.startsWith('https://vk.com/club') ? group.slice(19) : group.slice(15)
                search(q)
            })

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

            <button className={classes.button} onClick={()=>filter()} >Начать сбор участников групп</button>
            <div className={classes.output}>

            </div>
        </div>
    )
}

export default ParsGroupMembers