
import {AxiosConfig} from '../../Networking/AxiosConfig';


const userLogin = (userData: any) => {
  return AxiosConfig.post('/auth/user/verify-phone', userData);
};

const UserAdapter = {
    userLogin
}

export default UserAdapter;