import React from 'react';

import styles from './Favorite.module.scss';

import Card from '../../components/Card/Card';
import Info from '../../components/Info/Info';

import { AppContext } from '../../App';

function Favorites({ onAddToFavorites, isLoadingFavoriteCards }) {
   
   const { favoriteItems } = React.useContext(AppContext)
   
   return (
     
     <div className={styles.favorites}>
         <h1>Мои закладки</h1>
            <div className={styles.favoriteCards}>
               {
                  (isLoadingFavoriteCards ? [...Array(12)] : favoriteItems).map((items, index) =>
                     <Card
                        key={index}
                        {...items}
                        onFavorite={(obj) => onAddToFavorites(obj)}
                        loaded={isLoadingFavoriteCards}
                     />)
               }
            {
               favoriteItems.length === 0? <Info image={'/img/emptyFavorites.png'} title={'У вас нет закладок'} description={'Вы ничего не добавляли в закладки'} bigInfo /> : ''
            }
            </div>
      </div>
      
  )
}

export default Favorites;