import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fonts} from '../styles';

const ShowMoreText = ({text}: {text: string}) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <View style={{}}>
      <Text style={styles.text} numberOfLines={showFullText ? undefined : 2}>
        {showFullText ? text : text.slice(0, 100)}
        {text.length > 100 && !showFullText && '...'}
      </Text>
      {text.length > 100 && (
        <TouchableOpacity onPress={toggleText} testID={'btnShowMoreText'}>
          <Text style={styles.toggleButton}>
            {showFullText ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    ...fonts.regular12,
    marginTop: '3%',
    marginBottom: 2,
  },
  toggleButton: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default ShowMoreText;
