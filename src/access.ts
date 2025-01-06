// src/access.ts
export default function (initialState: { role: string }) {
  return {
    canUse: initialState.role === 'authenticated',
  };
}
