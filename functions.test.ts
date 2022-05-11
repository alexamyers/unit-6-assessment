const {shuffleArray, array} = require('./utils')
const {bots} = require('./data.js')

describe('shuffleArray should', () => {
    const botsLength = 10;
    const array = bots;

    test('array is returning correct number of array items', () => {
        expect(array.length).toEqual(botsLength);
    });

    test('function shuffleArray returns an array', () => {
        expect(Array.isArray(array)).toBe(true);
    })

})