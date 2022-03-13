import React from 'react';
import axios from 'axios';

import styles from './Orders.module.scss';

import Card from '../../components/Card/Card';
import Info from '../../components/Info/Info';


function Orders() {

   const [orderItems, setOrderItems] = React.useState([]);
   const [isLoadingCard, setIsLoadingCard] = React.useState(true);

   React.useEffect(() => {
      async function fetchData() {
      try {
           
         const { data } = await axios.get('https://6213a01089fad53b1ffb7679.mockapi.io/orders');
         setOrderItems(data.map((obj) => obj.items).flat());
         setIsLoadingCard(false);

      } catch (error) {
         
         alert('Ошибка при запросе заказов ');
         console.error(error);
         
        }
      }
      fetchData();
   }, []);

   return (
     
     <div className={styles.orders}>
         <h1>Мои заказы</h1>
            <div className={styles.orderCards}>
               {
                  (isLoadingCard ? [...Array(12)] : orderItems).map((items, index) => (
                     <Card
                        key={index}
                        {...items}
                        loaded={isLoadingCard}
                     />
                  ))}
            {
               orderItems.length === 0 ? <Info image={'/img/emptyOrders.png'} title={'У вас нет заказов'} description={'Оформите хотя бы один заказ'} bigInfo /> : ''
            }
            </div>
      </div>
       
  )
}

export default Orders;