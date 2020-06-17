import React, { useEffect, useRef } from 'react';
import { SectionList, Image, View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import {
  useDispatch,
  useSelector,
  State,
  Dish,
  categories,
  Category,
} from '../store/types';
import { getDishes } from '../store/actions/dishes';
import SectionHeader from '../components/Home/SectionHeader';
import DishRow from '../components/DishRow';
import { COLOR } from '../utils/constants';
import ActionSheet from 'react-native-actionsheet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

const RestaurantImage = require('../assets/images/restaurant.jpeg');

const ContainerRoot = styled.ScrollView`
  position: relative;
`;

type Section = {
  title: string;
  data: Dish[];
};

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
  bottom: 0px;
  align-self: center;
  width: 100%;
  height: 100px;
  z-index: 2;
`;

const SectionContainer = styled.View`
  padding: 10px;
  height: 100%;
`;

const CartButton = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${COLOR.PRIMARY};
  height: 42px;
  width: 100%;
  border-radius: 2px;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: ${COLOR.WHITE};
`;

const TopWrapper = styled.View`
  height: 400;
`;
const RestaurantContainer = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const RestName = styled.Text`
  font-size: 20;
  margin-top: 10;
  margin: auto;
`;
const RestDetails = styled.Text`
  font-size: 14;
  color: #c4c4c4;
  margin-top: 10px;
`;
const RestContact = styled.Text`
  font-size: 14;
  color: #c4c4c4;
  margin: auto;
`;

const BookButton = styled.TouchableOpacity`
  border-radius: 10px;
  background: #000;
  color: #fff;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 120;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.View`
  width: 80%;
  background: #fff;
  position: absolute;
  bottom: -35%;
  padding-top: 10px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  z-index: 1;
  elevation: 4;
  border-radius: 5px;
`;
const ItemsWrapper = styled.View`
  height: 200px;
`;
type CategoryCount = {
  category: Category;
  count: number;
};

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const actionSheetRef = useRef<ActionSheet>(null);
  const sectionRef = useRef<SectionList<Dish>>(null);
  const dishes = useSelector((state: State) => state.dishes);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    dispatch(getDishes());
  }, []);

  const handleMenuClick = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.show();
    }
  };

  const handleCategorySelection = (index: number): void => {
    if (sectionRef.current) {
      sectionRef.current.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0,
      });
    }
  };

  const sections: Section[] = Object.values(dishes).reduce(
    (accumlator: Section[], current: Dish) => {
      const section: Section | undefined = accumlator.find(
        (item) => item.title === current.category
      );
      if (section) {
        section.data = [...section.data, current];
      } else {
        accumlator = [
          ...accumlator,
          { title: current.category, data: [current] },
        ];
      }
      return accumlator;
    },
    []
  );

  const categoryCountArray: CategoryCount[] = Object.values(dishes).reduce(
    (accumlator: CategoryCount[], dish: Dish) => {
      const categoryCount: CategoryCount | undefined = accumlator.find(
        (item) => item.category === dish.category
      );
      if (categoryCount) {
        categoryCount.count = categoryCount.count + 1;
      } else {
        accumlator = [...accumlator, { category: dish.category, count: 1 }];
      }
      return accumlator;
    },
    []
  );

  return (
    <View>
      <ContainerRoot>
        <TopWrapper>
          <RestaurantContainer>
            <Image
              source={RestaurantImage}
              style={{ height: 300, width: '100%' }}
            />

            <Card>
              <View>
                <RestName>Inka Restaurant</RestName>
                <RestDetails>
                  5.0 (200+) | All days: 09:00 AM - 06:00 PM
                </RestDetails>
                <RestContact>Reach Us at : 9998887771</RestContact>
                <BookButton>
                  <ButtonText>Book a Table</ButtonText>
                </BookButton>
              </View>
            </Card>
          </RestaurantContainer>
        </TopWrapper>
        <SectionContainer>
          <SectionList
            ref={sectionRef}
            sections={sections}
            renderItem={({ item }) => <DishRow dish={item} />}
            renderSectionHeader={({ section }) => (
              <SectionHeader title={section.title} />
            )}
          />
        </SectionContainer>
        <ItemsWrapper>
          <ActionSheet
            ref={actionSheetRef}
            title='Categories'
            options={[
              ...categoryCountArray.map(
                (categoryCount: CategoryCount) =>
                  `${categoryCount.category} (${categoryCount.count})`
              ),
            ]}
            onPress={handleCategorySelection}
          />
        </ItemsWrapper>
      </ContainerRoot>
      <FloatingButtonContainer>
        <FloatingMenuButton onPress={handleMenuClick}>
          <ButtonText>Menu</ButtonText>
        </FloatingMenuButton>
        <CartButton onPress={() => navigation.navigate('Cart')}>
          <ButtonText>VIEW CART</ButtonText>
        </CartButton>
      </FloatingButtonContainer>
    </View>
  );
};

export default Home;
