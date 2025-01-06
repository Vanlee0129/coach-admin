// src/access.ts
export default function () {
  const token = sessionStorage.getItem('token');
  const expires = sessionStorage.getItem('expires');

  const isExpired = expires ? Date.now() > Number(expires) : true;

  return {
    canUse: isExpired && token,
  };
}
