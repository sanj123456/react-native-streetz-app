import {FC, memo, useRef, useState} from 'react';
import {FlatList, Image, Pressable, TouchableOpacity, View} from 'react-native';
import {images} from '../../core';
import {tabCategoryStyles} from '../../styles';
import {MyImage} from '../MyImage';
import {PrimaryText} from '../PrimaryText';
import CategoryTitle from './CategoryTitle';
import {SubCategoryItemProps} from '../../types/components';

let renderedWidth = 0;
const SubCategoryItem: FC<SubCategoryItemProps> = props => {
  const {data, onPressCategory, onPressSubCategory} = props;
  const flatListRef = useRef<FlatList>(null);

  const [itemVisible, setItemVisible] = useState<any>([]);

  const renderItemHandler = ({item}: any) => {
    return (
      <Pressable
        onPress={onPressSubCategory?.bind(null, item)}
        style={tabCategoryStyles.subCategoryView}>
        <MyImage
          style={tabCategoryStyles.imageStyle}
          source={item?.thumbnail_url}
        />
        <PrimaryText numberOfLines={1} style={tabCategoryStyles.subText}>
          {item.sub_category_name}
        </PrimaryText>
      </Pressable>
    );
  };

  const onViewableItemsChanged = ({viewableItems, changed}: any) => {
    setItemVisible(viewableItems);
  };

  const viewabilityConfigCallbackPairs: any = useRef([
    {onViewableItemsChanged},
  ]);

  const onPressArrowHandler = (type: any) => {
    if (type === 'back') {
      renderedWidth -= 250;
      flatListRef.current?.scrollToOffset({offset: renderedWidth});
    }

    if (type === 'next') {
      renderedWidth += 250;
      flatListRef.current?.scrollToOffset({offset: renderedWidth});
    }
  };

  return (
    <View style={tabCategoryStyles.itemView}>
      <CategoryTitle text={data.item.category_name} onPress={onPressCategory} />
      <FlatList
        ref={flatListRef}
        horizontal
        data={data?.item?.sub_category}
        renderItem={renderItemHandler}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        ItemSeparatorComponent={() => (
          <View style={tabCategoryStyles.itemSeparatorStyle} />
        )}
        contentContainerStyle={{padding: 10}}
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />

      {data.item.sub_category.length === 0 ? null : itemVisible[0]?.item?.id ==
        data?.item?.sub_category[0].id ? null : (
        <TouchableOpacity
          style={tabCategoryStyles.leftScrollArrow}
          onPress={onPressArrowHandler.bind(null, 'back')}>
          <Image
            source={images.leftArrow}
            style={tabCategoryStyles.arrowImage}
          />
        </TouchableOpacity>
      )}

      {itemVisible[itemVisible.length - 1]?.index !==
      data?.item?.sub_category.length - 1 ? (
        <TouchableOpacity
          style={tabCategoryStyles.rightScrollArrow}
          onPress={onPressArrowHandler.bind(null, 'next')}>
          <Image
            source={images.rightArrow}
            style={tabCategoryStyles.arrowImage}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default memo(SubCategoryItem);
