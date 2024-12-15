import {AxiosConfig} from './AxiosConfig';
interface UserLoginRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  otp: string;
}

export const userLogin = (userData: UserLoginRequest) => {
  return AxiosConfig.post('/auth/user/verify-phone', userData);
};
