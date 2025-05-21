import { SpanishNumberToWords } from '../languages/es/SpanishNumberToWords';

describe('SpanishNumberToWords', () => {
  const converter = new SpanishNumberToWords();

  test('should convert zero correctly', () => {
    expect(converter.convert('0')).toBe('cero');
  });

  test('should convert single digit numbers', () => {
    expect(converter.convert('1')).toBe('uno');
    expect(converter.convert('5')).toBe('cinco');
  });

  test('should convert teens', () => {
    expect(converter.convert('10')).toBe('diez');
    expect(converter.convert('15')).toBe('quince');
    expect(converter.convert('16')).toBe('dieciséis');
  });

  test('should convert tens and twenties', () => {
    expect(converter.convert('20')).toBe('veinte');
    expect(converter.convert('21')).toBe('veintiuno');
    expect(converter.convert('22')).toBe('veintidós');
    expect(converter.convert('25')).toBe('veinticinco');
    expect(converter.convert('29')).toBe('veintinueve');
    expect(converter.convert('30')).toBe('treinta');
    expect(converter.convert('31')).toBe('treinta y uno');
    expect(converter.convert('55')).toBe('cincuenta y cinco');
  });

  test('should convert hundreds', () => {
    expect(converter.convert('100')).toBe('cien');
    expect(converter.convert('101')).toBe('ciento uno');
    expect(converter.convert('123')).toBe('ciento veintitrés');
    expect(converter.convert('200')).toBe('doscientos');
    expect(converter.convert('555')).toBe('quinientos cincuenta y cinco');
    expect(converter.convert('999')).toBe('novecientos noventa y nueve');
  });

  test('should convert numbers with decimals', () => {
    expect(converter.convert('123.45')).toBe('ciento veintitrés coma cuatro cinco');
    expect(converter.convert('0.5')).toBe('cero coma cinco');
    expect(converter.convert('7.09')).toBe('siete coma cero nueve'); 
  });

  test('should convert negative numbers', () => {
    expect(converter.convert('-1')).toBe('menos uno');
    expect(converter.convert('-42')).toBe('menos cuarenta y dos');
    expect(converter.convert('-123.45')).toBe('menos ciento veintitrés coma cuatro cinco');
  });

  test('should convert thousands', () => {
    expect(converter.convert('1000')).toBe('mil');
    expect(converter.convert('1001')).toBe('mil uno');
    expect(converter.convert('2000')).toBe('dos mil');
    expect(converter.convert('5432')).toBe('cinco mil cuatrocientos treinta y dos');
    expect(converter.convert('123456')).toBe('ciento veintitrés mil cuatrocientos cincuenta y seis');
    expect(converter.convert('100000')).toBe('cien mil');
  });

  test('should convert millions and billions', () => {
    expect(converter.convert('1000000')).toBe('un millón');
    expect(converter.convert('2000000')).toBe('dos millones');
    expect(converter.convert('1234567')).toBe('un millón doscientos treinta y cuatro mil quinientos sesenta y siete');
    expect(converter.convert('1000000000')).toBe('mil millones'); 
    expect(converter.convert('2000000000')).toBe('dos mil millones');
    expect(converter.convert('1000000000000')).toBe('un billón'); 
    expect(converter.convert('2000000000000')).toBe('dos billones');
    expect(converter.convert('1000000000000000000')).toBe('un trillón');
    expect(converter.convert('2000000000000000000')).toBe('dos trillones');
  });
});
