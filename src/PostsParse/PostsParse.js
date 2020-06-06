import React, { useState } from 'react'
import classes from './PostsParse.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'


export const PostsParse = () =>{

    const [output, setOutput] = useState([])


    console.log(output)

    return(
        <div className={classes.main} >
            <div className={classes.description} >
                Скрипт перебирает группы и собирает посты со стен сообществ
            </div>
            <div>
                <textarea className={classes.textarea}
                    placeholder='Вставьте список адресов сообществ'
                />
                <label>Глубина парсинга </label>
                <input type='number' />
                <div>
                    <button className={classes.button} >Собрать посты</button>
                </div>

                <div>
                    {output.length > 0 ?
                    <div>
                        <h3>Собрано постов: {output.length}</h3>
                        <div className={classes.output}>
                        <CopyButton output={output} />    
                        </div>
                    </div>
                    :
                    null
                    }
                </div>
            </div>

        </div>
    )

}