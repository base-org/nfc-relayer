import { generateRandomString } from '@helpers/generate-random-string';

describe('generateRandomString', () => {
  it('generates a string of the correct length', () => {
    const result = generateRandomString();
    expect(result.length).toBe(8);
  });

  it('generates a string with only allowed characters', () => {
    const result = generateRandomString();
    expect(result).toMatch(/^[A-Za-z0-9]+$/);
  });

  it('generates different strings on multiple calls', () => {
    const result1 = generateRandomString();
    const result2 = generateRandomString();
    expect(result1).not.toBe(result2);
  });

  it('generates a string of custom length when specified', () => {
    const result = generateRandomString(12);
    expect(result.length).toBe(12);
  });
});