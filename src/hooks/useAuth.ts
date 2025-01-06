export default function useAuth() {
  const token = sessionStorage.getItem('token');
  const expires = sessionStorage.getItem('expires');

  const isExpired = expires ? Date.now() > Number(expires) * 1000 : true;

  return !isExpired && token;
}
