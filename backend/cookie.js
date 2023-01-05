import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const setCookie = (token, value) => {
    cookies.set(token, value, 
    { path: '/',secure: true, sameSite :true, maxAge: 8640000}
    );
    console.log(cookies.get(token));
};

export const getCookie = (token) => {
  if (cookies.get(token)===undefined){
    return '';
  }
  return cookies.get(token);
};