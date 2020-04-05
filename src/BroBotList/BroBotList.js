import React, { useState } from 'react'
import classes from './BroBotList.module.scss'

let BroBotList = () => {

   const [groups, changeGroups] = useState([])
   const [phrase, changePhrase] = useState([])
   const [output, changeOutput] = useState([])


//    function randomInteger(min, max) {
//     // получить случайное число от (min-0.5) до (max+0.5)
//     let rand = min - 0.5 + Math.random() * (max - min + 1);
//     return Math.round(rand);
//   }

  function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

   let combine = () => {
       let final = []
        for (let i=0; i<groups.length; i++) {
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
                let arr = event.target.value.split('\n')
                changeGroups(prevState=>prevState.concat(arr))
            }} id='groups' />
            </div>

            <div className={classes.control}>
            <label className={classes.label}  htmlFor='phrase'>Вставьте список фраз</label>
            <textarea className={classes.textarea}  onChange={(event)=>{
                let arr = event.target.value.split('\n')
                changePhrase(prevState=>prevState.concat(arr))
            }} id='phrase' />
            </div>

            <div className={classes.control}>
            <button
            onClick={()=>combine()}
            >Комбинировать</button>
            </div>


            <div className={classes.output}>
                {output.length > 0 ? output.map(str=>{
                    return(
                        <div>
                            {str}
                        </div>
                    )
                }) : null}
            </div>




        </div>
    )
}

export default BroBotList