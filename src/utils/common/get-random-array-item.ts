import crypto from "node:crypto";

export const getRandomArrayItem = <T>(array: T[]) => {
    return array[crypto.randomInt(0, array.length)];
};
