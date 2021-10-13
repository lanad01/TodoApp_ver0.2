import { Dimensions,Platform, StatusBar } from 'react-native';

export const WIDTH = Dimensions.get('screen').width;
export const HEIGHT = Dimensions.get('screen').height;
const XD_WIDTH = 720;
export const DPW = WIDTH / XD_WIDTH;

export default DP=(()=>{
    return DPW;
 })()
 
 
export const isNotch = (()=>{
    if(Platform.OS === 'ios'){
       return HEIGHT >=812; 
    }
    if(Platform.OS === 'android'){
       return StatusBar.currentHeight !== 24;
    }
 })();