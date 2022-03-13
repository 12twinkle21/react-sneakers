import React from 'react';
import axios from 'axios';
   
import Info from '../Info/Info';

import styles from './Drawer.module.scss';

import { AppContext } from '../../App';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onCloseCart, onRemoveCartItem, cartOpened }) {
   
   const { cartItems = [], setCartItems } = React.useContext(AppContext);
   
   const [orderId, setOrderId] = React.useState(null);
   const [isCompletedOrder, setIsCompletedOrder] = React.useState(true);
   const [isLoading, setIsLoading] = React.useState(false);

   const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum, 0);
   const totalTax = Math.round(totalPrice * 0.05);

   const onClickOrderBtn = async () => {
      try {

         setIsLoading(true)
         const { data } = await axios.post('https://6213a01089fad53b1ffb7679.mockapi.io/orders', { items: cartItems });
         setOrderId(data.id);
         setIsCompletedOrder(false);
         setCartItems([]);
         
         for (let i = 0; i < cartItems.length; i++){
            const item = cartItems[i];
            await axios.delete('https://6213a01089fad53b1ffb7679.mockapi.io/cart/' + item.id);
            await delay(1000);
         }

      } catch (error) {

         alert('Ошибка при создании заказа :(');
         console.error(error);

      }
      
      setIsLoading(false)
   }

   return (
     
      <div className={`${styles.overlay} ${cartOpened? styles.overlayVisible : ''}`}>  
   <div className={styles.drawer}>
   <h2>
      Корзина
      <svg onClick={onCloseCart}
         width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
         <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" stroke="#DBDBDB"/>
         <path d="M20.0799 18.6155L17.6311 16.1667L20.0798 13.718C21.0241 12.7738 19.5596 11.3093 18.6154 12.2536L16.1667 14.7023L13.7179 12.2535C12.7738 11.3095 11.3095 12.7738 12.2535 13.7179L14.7023 16.1667L12.2536 18.6154C11.3093 19.5596 12.7738 21.0241 13.718 20.0798L16.1667 17.6311L18.6155 20.0799C19.5597 21.0241 21.0241 19.5597 20.0799 18.6155Z" fill="#B5B5B5"/>
      </svg>
            </h2>    
            {
               cartItems.length > 0 ? 
                  <>
               <div className={styles.cartItems}>
               {cartItems.map((obj, index) => (
                  <div key={`${obj.id}_${index}`} className={styles.cartItem}>
                  <img src={obj.imgUrl} width={70} height={70} alt='Sneakers' />
                  <div className={styles.cartInfo}>
                     <p>{obj.title}</p>
                     <b>{obj.price} руб.</b>
                  </div>
                  <div>
                  <svg onClick={() => onRemoveCartItem(obj.id)}
                     width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" stroke="#DBDBDB"/>
                     <path d="M20.0799 18.6155L17.6311 16.1667L20.0798 13.718C21.0241 12.7738 19.5596 11.3093 18.6154 12.2536L16.1667 14.7023L13.7179 12.2535C12.7738 11.3095 11.3095 12.7738 12.2535 13.7179L14.7023 16.1667L12.2536 18.6154C11.3093 19.5596 12.7738 21.0241 13.718 20.0798L16.1667 17.6311L18.6155 20.0799C19.5597 21.0241 21.0241 19.5597 20.0799 18.6155Z" fill="#B5B5B5"/>
                  </svg>
                     </div>
                  </div>
               ))}
               </div>
                  <div className={styles.cartTotalBlock}>
                  <ul>
                     <li>
                  <span>Налог 5%:</span>
                  <div></div>
                     <b>{totalTax} руб.</b>
                      </li>
                     <li>
                        <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice + totalTax} руб.</b>
                     </li>
                  </ul>
         <button className={styles.greenBtn} onClick={onClickOrderBtn} disabled={isLoading}>
         Оформить заказ
         <svg
            width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7H14.7143" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.71436 1L14.7144 7L8.71436 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
      </button>
      </div>
            </>
                  :
                  <Info image={isCompletedOrder ? '/img/emptyCart.jpg' : '/img/completedOrder.jpg'} title={isCompletedOrder ? 'Пустая корзина' : 'Заказ оформлен'} description={isCompletedOrder ? 'Добавьте хотя бы одну пару кроссовок, что оформить заказ' : `Ваш заказ #${orderId} скоро будет передан курьерской доставке`} />
            }
            </div>
         </div>
      
  )
}

export default Drawer;