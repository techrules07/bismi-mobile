import {AxiosConfig} from './AxiosConfig';

interface GetAddressResponse {
  data: any;
}

export const getAddress = async (
  id: string,
  userId: string,
): Promise<GetAddressResponse> => {
  try {
    const response = await AxiosConfig.post('/user/get/all-address', null, {
      params: {
        requestId: id,
        userId: userId,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw new Error('Failed to fetch addresses');
  }
};

export const getStateAndCity = async () => {
  return await AxiosConfig.get('/master/get/places');
};

export const getAddressTypes = async () => {
  return await AxiosConfig.get('/master/get/address-types');
};

export const addAddress = async (bodyData: any) => {
  return await AxiosConfig.post('/user/add/new-address', bodyData);
  
};
export const updateAddress = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post('/user/updateAddress', bodyData);
    console.log('Address updated successfully:', response.data);

    return response.data;
  } catch (error) {
    console.error('Failed to update address:', error);

    throw error;
  }
};

export const defaultAddressApi = async (addressId: string, userId: string) => {
  try {
    const bodyData = {
      addressId,
      userId,
    };

    const response = await AxiosConfig.post(
      '/user/update/default-address',
      bodyData,
    );

    return response.data;
  } catch (error) {
    console.error('Failed to set default address:', error);
    throw error;
  }
};
export const deleteAddress = (id: any) => {
  return AxiosConfig.post(`user/deleteAddress?id=${encodeURIComponent(id)}`)
    .then(response => {
      console.log('Address deleted successfully:', response.data);
    })
    .catch(error => {
      console.error('Failed to delete address:', error);
    });
};
