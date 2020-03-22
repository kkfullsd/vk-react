import React, { useState } from 'react'

export default props => {

   const [isCopied, setCopied] = useState(false)

   const copy = () => {

        let data = ''

        props.output.map((group)=>{
            data = data + "https://vk.com/" + group.screen_name + "\n"
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
        <button disabled className={props.className}>Скопировано в буфер обмена</button> : 
        <button onClick={copy} className={props.className}>Скопировать все в буффер обмена</button> 
        }
        
        </>
    )
}