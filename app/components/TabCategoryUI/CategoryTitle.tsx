import { Image, TouchableOpacity } from "react-native"
import { PrimaryText } from "../PrimaryText"
import { tabCategoryStyles } from "../../styles"
import { images } from "../../core"
import { FC } from "react"
import { CategoryTitleProps } from "../../types/components"


const CategoryTitle:FC<CategoryTitleProps>=(props)=>{
    const {onPress,text}=props
    return  <TouchableOpacity
    onPress={onPress}
    style={tabCategoryStyles.titleView}>
    <PrimaryText style={tabCategoryStyles.titleStyle}>
      {text}
    </PrimaryText>
    <Image
      source={images.icRightArrow}
      style={tabCategoryStyles.rightArrowImage}
    />
  </TouchableOpacity>
}
export default CategoryTitle