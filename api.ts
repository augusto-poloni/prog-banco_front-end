import axios from 'axios';
import { Platform } from 'react-native';


const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }


  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }


  return 'http://localhost:3000'; 
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

export default api;