import API from '../lib/api';

export const register = async ({
  email,
  password,
  phoneNumber,
}: {
  email: string;
  password: string;
  phoneNumber: string;
}) => {
  const response = await API.post('/user/register', {
    email,
    password,
    phoneNumber,
    name: '', // or accept name as part of the object if needed
  });
  return response.data;
};
