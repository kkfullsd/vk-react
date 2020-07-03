import React, { useState } from 'react'
import classes from './CopyButton.module.scss'
import {GrCopy, GrCheckmark} from 'react-icons/gr'

export default props => {

   const [isCopied, setCopied] = useState(false)

   const copy = () => {

        let data = ''

        if (props.output instanceof Array) {
            props.output.map((group)=>{
                if (group.screen_name) {
                    data = data + "https://vk.com/" + group.screen_name + "\n"
                } else {
                    if(typeof group === 'string' && group.includes('https://vk.com/')) {
                        data = data + group + "\n"
                    } else {
                        data = data + "https://vk.com/" + group+ "\n"
                    }
                }
            })
        }
        
   
        window.navigator.clipboard.writeText(data)
        .then(()=>{
            console.log('copied')
        })
        .then(()=>{
            setCopied(true)
        })

}   

    return (
        <>
        {
        isCopied ?
        <button disabled className={classes.CopyButton}><GrCheckmark /></button> : 
        <button onClick={copy} className={classes.CopyButton}><GrCopy /></button> 
        }
        
        </>
    )
}