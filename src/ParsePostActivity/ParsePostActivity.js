import React, {useState} from 'react'
import classes from './ParsePostActivity.module.scss'
import styles from '../style/style.module.scss'
import VK from '../VK/VK'
import loader from '../ui/loader/loader.module.scss'

export const ParsePostActivity = () => {

    const [post, setPost] = useState([])
    const [activities, setActivities] = useState(['likes'])
    const [activitiesCount, setActivitiesCount] = useState(1)

    const [output, setOutput] = useState([])
    const [loading, setLoading] = useState(false)



    const start = async () => {
      if (post.length > 0) {
        if (output.length > 0) {
          setOutput([])
        }

        setLoading(true)
        let out = await VK.parsePostsActivity(post, activities, activitiesCount)
        console.log('out', out)
        setOutput(out)
        setLoading(false)
      }
      
    }


    const outRender = (
      <div className={styles.output} >
        {output ? output.map((id,index)=><div key={index} >https://vk.com/id{id}</div>) : null}
      </div>
    )

    return (
      <div className={styles.main}>
        <div className={styles.description}>
          Скрипт находит всех людей, оставивших лайки/репосты/комментарии к
          одному посту. Потом создаёт из них финальный список под ваши условия
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Вставьте ссылку на пост"
          onChange={(e) => {
            setPost(e.target.value.split("\n"));
          }}
        />

        <div className={classes.settings}>
          <h5>Какую активность собирать?</h5>
          <label>
            <input
              type="checkbox"
              checked={activities.includes("likes")}
              onChange={() =>
                activities.includes("likes")
                  ? setActivities(activities.filter((el) => el !== "likes"))
                  : setActivities(activities.concat("likes"))
              }
            />
            Лайки
          </label>

          <label>
            <input
              type="checkbox"
              checked={activities.includes("reposts")}
              onChange={() =>
                activities.includes("reposts")
                  ? setActivities(activities.filter((el) => el !== "reposts"))
                  : setActivities(activities.concat("reposts"))
              }
            />
            Репосты
          </label>

          {/* <label>
            <input
              type="checkbox"
              checked={activities.includes("quiz")}
              onChange={() =>
                activities.includes("quiz")
                  ? setActivities(activities.filter((el) => el !== "quiz"))
                  : setActivities(activities.concat("quiz"))
              }
            />
            Участвовавшие в опросе
          </label> */}

          <label>
            <input
              type="checkbox"
              checked={activities.includes("authors")}
              onChange={() =>
                activities.includes("authors")
                  ? setActivities(activities.filter((el) => el !== "authors"))
                  : setActivities(activities.concat("authors"))
              }
            />
            Авторы постов
          </label>


          <div>
            <h5>Количество активностей</h5>
            <span>Собирать людей сделавших не менее </span>
            <input
              type="number"
              className={styles.textinput + " " + classes.inputNumber}
              onChange={e=>setActivitiesCount(+e.target.value)}
              value={activitiesCount}
              min='1'
            />
            <span> активностей</span>
          </div>
        </div>

        <button 
            className={styles.button}
            onClick={start}
            >Начать сбор</button>

        {}
        {loading ? <div className={loader.loader}/> : null}
        { output && output.length === 0 ? null : <span>Собрано {output.length} пользователей</span>}
        { output && output.length === 0 ? null : outRender}
        
      </div>
    );
}