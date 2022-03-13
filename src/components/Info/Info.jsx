import React from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../../App';

import styles from './Info.module.scss';

function Info({ image, title, description, bigInfo }) {

   const {setCartOpened} = React.useContext(AppContext);

   return (
     
   <div className={`${styles.info} ${bigInfo? styles.bigInfo : ''}`}>
   <img src={image}  alt='EmptyCart' />
        <h3>{title}</h3>
         <p>{description}</p>
         <Link to='/' className={`clearLink ${styles.clearLink}`}>
         <button className='greenBtn' onClick={() => setCartOpened(false)}>
      <svg
         width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M1 7H14.7143" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M8.71436 1L14.7144 7L8.71436 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
               Вернуться назад
            </button>
            </Link>
      </div>
      
  )
}

export default Info;