import { removeDecimalZeros } from '@/utils/math';

describe('math removeDecimalZeros', () => {
  it.each`
    value      | expected
    ${'3.000'} | ${'3'}
    ${'3.100'} | ${'3.1'}
    ${'3.010'} | ${'3.01'}
    ${'3.011'} | ${'3.011'}
  `('should remove decimals zeros from $value', ({ value, expected }) => {
    const str = removeDecimalZeros(value);
    expect(str).toBe(expected);
  });
});
