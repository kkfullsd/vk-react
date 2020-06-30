import React from 'react'
import classes from './Description.module.scss'
import { FaUserFriends, FaFilter } from "react-icons/fa";
import { AiOutlineUsergroupAdd, AiOutlineAim, AiOutlineHeart } from "react-icons/ai";
import { RiUserSearchLine } from "react-icons/ri";




export const Description = () => {



    return (
      <div className={classes.main}>
        <p className={classes.description} >
          VK SMM TOOLS - это мощный и быстрый сервис для парсинга аудитории ВК. Сервис все еще развивается, но вот что он умеет
          уже сейчас:
        </p>

        <div className={classes.cards}>
          <div className={classes.card}>
            <div className={classes.icon}>
              <FaUserFriends />
            </div>
            <h4>Поиск сообществ по параметрам.</h4>
            <span>
              Поможет собрать группы с целевой аудиторией или группы
              конкурентов.
            </span>
          </div>

          <div className={classes.card}>
            <div className={classes.icon}>
              <FaFilter />
            </div>
            <h4>Фильтр сообществ по открытой стене</h4>
            <span>Для самых различных целей.</span>
          </div>

          <div className={classes.card}>
            <div className={classes.icon}>
              <AiOutlineUsergroupAdd />
            </div>
            <h4>Парсинг участников сообществ</h4>
            <span>
              Меньше чем за минуту скрипт соберет десятки тысяч пользователей
            </span>
          </div>

          <div className={classes.card}>
            <div className={classes.icon}>
              <AiOutlineAim />
            </div>
            <h4>Пересечения сообществ</h4>
            <span>
              Для того чтобы найти ЦА, которая точно заинтересована в этой нише
            </span>
          </div>

          <div className={classes.card}>
            <div className={classes.icon}>
              <RiUserSearchLine />
            </div>
            <h4>Фильтр пользователей по параметрам</h4>
            <span>
              Фильтр по возрасту, месту жительства, СП, образованию и тд.
            </span>
          </div>

          <div className={classes.card}>
            <div className={classes.icon}>
              <AiOutlineHeart />
            </div>
            <h4>Сбор активности с постов</h4>
            <span>
              Соберите всех лайкнувших, репостнувших, а так же авторов постов.
            </span>
          </div>



        </div>
      </div>
    );
}