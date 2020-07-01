import React, { useState } from 'react'
import CountrySeclect from '../ui/CoutrySelect/CountrySelect'
import CitySelect from '../ui/CitySelect/CitySelect'
import classes from './GroupsSearch.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'
import styles from '../style/style.module.scss'
import Select from 'react-select';
import {dropdownStyle} from '../style/style'
import VK from '../VK/VK'

export const GroupsSearch = () => {
document.title = 'Поиск групп по параметрам'
    

    const [q, setQ] = useState([])
    const [type, setType] = useState('')
    const [country_id, setCountry_id] = useState('')
    const [city_id, setCity_id] = useState('')
    const [sort, setSort] = useState(0)

    const [output, setOutput] = useState([])
    const [loading, setLoading] = useState(false)

    const [valid, setValid] = useState(true)


    const [isClosed, setIsClosed] = useState(false)
    const [canPost, setCanPost] = useState(false)

    const [minMembers, setMinMembers] = useState(0)
    const [maxMembers, setMaxMembers] = useState(0)

    const [searched, setSearched] = useState(0)
    const [filtered, setFiltered] = useState(0)



    const searchedUpdater = (num) => {
        setSearched(num)
    }

    const filteredUpdater = (num) => {
        setFiltered(num)
    }



    const sortOptions = [
        {value:0, label: 'Cортировать по умолчанию (аналогично результатам поиска в полной версии сайта)'},
        {value:1, label: 'Cортировать по скорости ростa'},
        {value:2, label: 'Cортировать по отношению дневной посещаемости к количеству пользователей'},
        {value:3, label: 'Cортировать по отношению дневной посещаемости к количеству пользователей'},
        {value:4, label: 'Cортировать по отношению количества комментариев к количеству пользователей'},
        {value:5, label: 'Cортировать по отношению количества записей в обсуждениях к количеству пользователей'}
    ]

    const groupTypeOptions = [
        {value:'', label:"Не важно"},
        {value:'group', label:"Группа"},
        {value:'page', label:"Паблик"},
        {value:'event', label:"Событие"},
    ]

    const start = async ()=>{
        setLoading(true)
        const params = {type, country_id, city_id, sort}
        const filters = {canPost, minMembers, maxMembers, isClosed}
        const res = await VK.searchGroups(q, params, filters, searchedUpdater, filteredUpdater)
        setOutput(res)
        setLoading(false)
    }


    const searchGroups = async () => {
        if (q.length > 0) {
            if (output.length === 0) {
               start()
            } else {
                setOutput([])
                setSearched(0)
                setFiltered(0)

                start()
            }
        }
    }

    const outRender = (
        <div className={styles.output}>
            <CopyButton 
                output={output}
            />
            {output ? output.map((gr, i)=>(
                <div key={i}>https://vk.com/{gr}</div>
            )) : null}
        </div>
    )


        return (
          <div className={classes.GroupsSearch}>
            <div className={classes.control}>
              <input
                className={valid}
                id="q"
                onChange={(e) => setQ(e.target.value.split(","))}
                placeholder="Ключевые слова"
              />
            </div>

            <div className={classes.control}>
              <label htmlFor="selecttype">
                Тип сообщества
                <Select
                  options={groupTypeOptions}
                  styles={dropdownStyle}
                  onChange={(selectedOption) => {
                    setType(selectedOption.value);
                  }}
                  value={groupTypeOptions.find((obj) => obj.value === type)}
                />
              </label>
            </div>

            <div className={classes.control}>
              <CountrySeclect
                country_id={country_id}
                onSelect={(selectedOption) => {
                  setCountry_id(selectedOption.value);
                  setCity_id("");
                }}
              />
            </div>

            {country_id === "" ? null : (
              <div className={classes.control}>
                <CitySelect
                  country_id={country_id}
                  city_id={city_id}
                  onSelect={(selectedOption) => {setCity_id(selectedOption.value)}}
                />
              </div>
            )}

            <div className={classes.control}>
              <label htmlFor="sort">
                Сортировка по:
                <Select
                  styles={dropdownStyle}
                  options={sortOptions}
                  value={sortOptions.find((obj) => obj.value === sort)}
                  onChange={(selectedOption) => {setSort(selectedOption.value)}}
                />
              </label>
            </div>
            <div className={classes.control}>
              <label htmlFor="min">Минимум участников:</label>
              <input
                type="number"
                id="min"
                name="min"
                placeholder={minMembers}
                onChange={e => setMinMembers(e.target.value)}
              />
            </div>

            <div className={classes.control}>
              <label htmlFor="max">Максимум участников:</label>
              <input
                type="number"
                id="max"
                name="max"
                placeholder={maxMembers}
                onChange={e=>setMaxMembers(e.target.value)}
              />
            </div>

            <div className={classes.checkgroup}>
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={() => {setIsClosed(!isClosed)}}
              />

              <label className={styles.label} htmlFor="canPost">
                Только открытые группы
              </label>
            </div>

            <div className={classes.checkgroup}>
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={() => {setCanPost(!canPost)}}
              />

              <label className={styles.label} htmlFor="canPost">
                Только с открытой стеной
              </label>
            </div>

            {loading ? null : (
              <div>
                <button className={styles.button} onClick={searchGroups}>
                  {" "}
                  Найти группы{" "}
                </button>
              </div>
            )}

            <div>
            {searched > 0 ? <p>Найденно сообществ: {searched}</p> :  null}
            {filtered > 0 ? <p>Отфильтровано сообществ: {filtered}</p> :  null}
            </div>

           {loading ? <div className={loader.loader}/> : null}

           {output && output.length > 0 ? outRender : null}
            
          </div>
        );
    
    




}