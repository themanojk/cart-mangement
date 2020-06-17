import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { useSelector, State, Dish } from '../store/types';
import DishRow from '../components/DishRow';
import { COLOR } from '../utils/constants';
import { dishes } from '../dummy.ts';

const ContainerRoot = styled.View`
  display: flex;
  justify-content: center;
`;

const FloatingMenuButton = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${COLOR.PRIMARY};
  height: 28px;
  width: 20%;
  border-radius: 10px;
  margin-top: 20px;
`;

const FloatingButtonContainer = styled.View`
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 200px;
  align-self: center;
  width: 100%;
  height: 100px;
  z-index: 2;
`;

const SectionContainer = styled.ScrollView`
  height: 100%;
  padding: 10px;
`;

const CartTotalView = styled.View`
  height: 200px;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToatlView = styled.View`
  height: 70px;
  width: 200px;
  background: #fff;
  border-radius: 5px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${COLOR.WHITE};
`;

const TotalText = styled.Text`
  color: ${COLOR.ORANGE};
  font-size: 14;
`;

const TotalPrice = styled.Text`
  color: ${COLOR.BLACK};
  font-size: 14;
`;

const INITIAL_ITEMS_COUNT = 2;

const Cart: React.FC = () => {
  let totalPrice = 0;
  const dishesList = useSelector((state: State) => state.dishes);
  const cartItems = useSelector((state: State) => Object.keys(state.cart));
  const cartState = useSelector((state: State) => state.cart);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0.0);

  const _getQuantity = (id) => {
    const cartCount = useSelector((state: State) => state.cart[id] || 0);
  };

  useEffect(() => {
    console.warn(cartItems);

    const price = cartItems.reduce((amount: number, dishId: string) => {
      const price = dishes[dishId].price;
      const count = cartState[dishId];
      amount += price * count;
      return amount;
    }, 0);
    // cartItems.map((row) => {
    //   let price = _getPriceById(row);
    //   let quantity = _getQuantity(row);
    //   console.warn(quantity, price);
    //   totalPrice += parseInt(price) * parseInt(quantity);
    // });

    setTotal(price);
  }, [cartItems]);

  const _handleLoadMore = () => {
    setLoadMore(true);
    setIsVisible(false);
  };
  const _getPriceById = (id) => {
    const itemIndex = dishes.findIndex((row) => {
      return row.id === id;
    });

    if (itemIndex < 0) {
      return 0;
    }

    return dishes[itemIndex].price;
  };

  return (
    <ContainerRoot>
      <CartTotalView>
        <ToatlView>
          <TotalText>Total Cost</TotalText>
          <TotalPrice>€{total}</TotalPrice>
        </ToatlView>
      </CartTotalView>
      <SectionContainer showsVerticalScrollIndicator={false}>
        <FlatList
          data={loadMore ? cartItems : cartItems.slice(0, INITIAL_ITEMS_COUNT)}
          renderItem={({ item }) => <DishRow dish={dishesList[item]} />}
        />
      </SectionContainer>
      {isVisible ? (
        <FloatingButtonContainer>
          <FloatingMenuButton onPress={() => _handleLoadMore()}>
            <ButtonText>Load More</ButtonText>
          </FloatingMenuButton>
        </FloatingButtonContainer>
      ) : null}
    </ContainerRoot>
  );
};

export default Cart;
