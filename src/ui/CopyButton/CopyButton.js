import React, { useState } from 'react'
import classes from './CopyButton.module.scss'

export default props => {

   const [isCopied, setCopied] = useState(false)

   const copy = () => {

        let data = ''

        
        props.output.map((group)=>{
            if (group.screen_name) {
                data = data + "https://vk.com/" + group.screen_name + "\n"
            } else {
                data = data + "https://vk.com/" + group+ "\n"
            }
        })
   
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
        <button disabled className={classes.CopyButton}>Скопировано в буфер обмена</button> : 
        <button onClick={copy} className={classes.CopyButton}>Скопировать все в буффер обмена</button> 
        }
        
        </>
    )
}