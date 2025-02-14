import {AxiosConfig} from './AxiosConfig';

const verifyLogin = async (userData: any) => {
  try {
    const response = await AxiosConfig.post('auth/user/verify-phone', userData);
    console.log('Verify Response:', response);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Failed to login');
  }
};
const userLogin = async (userData: any) => {
  console.log('userData', userData);
  try {
    const response = await AxiosConfig.post('auth/user/check-phone', userData);
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Failed to login');
  }
};
const signUp = async (userData: any) => {
  try {
    const response = await AxiosConfig.post('auth/user/add-user', userData);
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Failed to login');
  }
};
const getProfile = async (userData: any) => {
  try {
    const response = await AxiosConfig.post('auth/getUserDetails', userData);
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error('profile get successfully:', error);
    throw new Error('Failed to get profile');
  }
};
const UserAdapter = {
  userLogin,
  verifyLogin,
  signUp,
  getProfile
};

export default UserAdapter;