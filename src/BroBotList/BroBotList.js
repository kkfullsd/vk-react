import React, { useState } from 'react'
import classes from './BroBotList.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'

let BroBotList = () => {

   const [groups, changeGroups] = useState([])
   const [phrase, changePhrase] = useState([])
   const [output, changeOutput] = useState([])

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

   let combine = () => {
       let final = []
        for (let i=groups.length-1; i>=0; i--) {
            console.log(randomInteger(0, phrase.length-1))
            let result = groups[i] + ' ' + phrase[randomInteger(0, phrase.length-1)] + ' [image:image.jpg]'
            final.push(result)
        }
        changeOutput(final)
   }



    return (
        <div className={classes.main}>
            <div className={classes.control}>
            <label className={classes.label} htmlFor='groups'>Вставьте список групп</label>
            <textarea className={classes.textarea}  onChange={(event)=>{
                changeGroups(event.target.value.split('\n'))
                
            }} id='groups' />
            </div>

            <div className={classes.control}>
            <label className={classes.label}  htmlFor='phrase'>Вставьте список фраз</label>
            <textarea className={classes.textarea}  onChange={(event)=>{
                changePhrase(event.target.value.split('\n'))
            }} id='phrase' />
            </div>

            <div className={classes.control}>
            <button
            onClick={()=>combine()}
            >Комбинировать</button>
            </div>


            <div className={classes.output}>
            <CopyButton output={output} />
                {output.length > 0 ? output.map((str, index)=>{
                    return(
                        <div key={index}>
                            {str}
                        </div>
                    )
                }) : null}
            </div>




        </div>
    )
}

export default BroBotList