export const getRandomArrayItem = <T>(array: T[]) => {
    return array[Math.floor(Math.random() * array.length)];
};
