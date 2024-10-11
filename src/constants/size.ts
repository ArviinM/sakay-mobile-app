import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
