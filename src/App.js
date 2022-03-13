import React from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import Orders from './pages/Orders/Orders';

import Header from './components/Header/Header';
import Drawer from './components/Drawer/Drawer';

export const AppContext = React.createContext({});

function App() {

   const [items, setItems] = React.useState([]);
   const [cartItems, setCartItems] = React.useState([]);
   const [favoriteItems, setFavoriteItems] = React.useState([]);
   const [cartOpened, setCartOpened] = React.useState(false);
   const [searchValue, setSearchValue] = React.useState('');
   const [isLoadingCard, setIsLoadingCard] = React.useState(true);
   const [isLoadingFavoriteCards, setIsLoadingFavoriteCards] = React.useState(true);
   
   React.useEffect(() => {
      async function fetchData() {
         try {

         const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
               axios.get('https://6213a01089fad53b1ffb7679.mockapi.io/cart'),
               axios.get('https://6213a01089fad53b1ffb7679.mockapi.io/favorites'),
               axios.get('https://6213a01089fad53b1ffb7679.mockapi.io/items')
            ]);

         setIsLoadingCard(false);
         setIsLoadingFavoriteCards(false);
         
         setCartItems(cartResponse.data);
         setFavoriteItems(favoritesResponse.data);
         setItems(itemsResponse.data);
            
         } catch (error) {

         alert('Ошибка при запросе данных ;(');
         console.error(error);
            
         }
      }
         fetchData();
   }, []);

   const onAddToCart = async (obj) => {
      try {

         const findCartItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));

         if (findCartItem) {
            setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
            await axios.delete(`https://6213a01089fad53b1ffb7679.mockapi.io/cart/${findCartItem.id}`);
         } else {
            setCartItems((prev) => [...prev, obj]);
            const { data } = await axios.post('https://6213a01089fad53b1ffb7679.mockapi.io/cart', obj);
            setCartItems((prev) => prev.map((item) => {
               if (item.parentId === data.parentId) {
                  return {
                     ...item,
                     id: data.id
                  };
               }
               return item;
            }));
         }
         
      } catch (error) {

         alert('Ошибка при добавлении в корзину');
         console.error(error);

      }
   }
   
   const onRemoveCartItem = async (id) => {
      try {

      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
      await axios.delete(`https://6213a01089fad53b1ffb7679.mockapi.io/cart/${id}`);
         
      } catch (error) {

         alert('Ошибка при удалии товара из корзины');
         console.error(error);

      }
   }

   const onAddToFavorites = async (obj) => {
      try {

         const findFavItem = favoriteItems.find((favObj) => Number(favObj.parentId) === Number(obj.id));
         
         if (findFavItem) {
            setFavoriteItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
            await axios.delete(`https://6213a01089fad53b1ffb7679.mockapi.io/favorites/${findFavItem.id}`);
         } else {
            setFavoriteItems((prev) => [...prev, obj]);
            const { data } = await axios.post('https://6213a01089fad53b1ffb7679.mockapi.io/favorites', obj);
            setFavoriteItems((prev) => prev.map((item) => {
               if (item.parentId === data.parentId) {
                  return {
                     ...item,
                     id: data.id
                  };
               }
               return item;
            }));
         }

      } catch (error) {

         alert('Не удалось добавить в закладки');
         console.error(error);

      }
   }

   const onChangeSearchInput = (event) => {
      setSearchValue(event.target.value);
   }

   const isItemAddedToCart = (id) => {
      return cartItems.some((obj) => Number(obj.parentId) === Number(id));
   }

   const isItemAddedToFavorite = (id) => {
      return favoriteItems.some((obj) => Number(obj.parentId) === Number(id));
   }

   const onClickCart = () => {
      setCartOpened(true)
      document.body.style.overflow = 'hidden';
   }
   const onCloseCart = () => {
      setCartOpened(false)
      document.body.style.overflow = 'unset';
   }
   
   return (
      
      <AppContext.Provider value={{items, cartItems, favoriteItems, isItemAddedToCart, setCartOpened, setCartItems, isItemAddedToFavorite }}>
      <div className='wrapper'>
            <Drawer onCloseCart={onCloseCart} onRemoveCartItem={onRemoveCartItem} cartOpened={cartOpened}/>
         <Header onClickCart={onClickCart} />
         <div className='content'>
         <Routes>
               <Route exact path='/' element={<Home items={items} searchValue={searchValue} setSearchValue={setSearchValue} onChangeSearchInput={onChangeSearchInput} onAddToFavorites={onAddToFavorites} onAddToCart={onAddToCart} isLoadingCard={isLoadingCard}/>} />
                  <Route exact path='/favorites' element={<Favorites onAddToFavorites={onAddToFavorites}isLoadingFavoriteCards={isLoadingFavoriteCards}/>} />
                  <Route exact path='/orders' element={<Orders />}/>
            </Routes>
            </div>
      </div>
      </AppContext.Provider>

   )
}

export default App;
