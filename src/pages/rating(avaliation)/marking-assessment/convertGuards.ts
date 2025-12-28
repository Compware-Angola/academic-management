export const convertGuards = (guards: string | null) => {
  if (guards == null) return [];
  try {
    return JSON.parse(guards);
  } catch (e) {
    return [];
  }
};
