import API from '../lib/api';

export const register = async ({
  email,
  password,
  phoneNumber,
  name,
}: {
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
}) => {
  const response = await API.post('/user/register', {
    email,
    password,
    phoneNumber,
    name,
  });
  return response.data;
};
