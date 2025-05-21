import { NumberToWordsFactory } from '../NumberToWordsFactory';
import { Language } from '../core/types';
import { EnglishNumberToWords } from '../languages/en/EnglishNumberToWords';
import { RomanianNumberToWords } from '../languages/ro/RomanianNumberToWords';

describe('NumberToWordsFactory', () => {
  describe('createConverter', () => {
    it('should create the correct converter for English', () => {
      const converter = NumberToWordsFactory.createConverter('en');
      expect(converter).toBeInstanceOf(EnglishNumberToWords);
    });

    it('should create the correct converter for Romanian', () => {
      const converter = NumberToWordsFactory.createConverter('ro');
      expect(converter).toBeInstanceOf(RomanianNumberToWords);
    });

    it('should throw error for unsupported language', () => {
      expect(() => NumberToWordsFactory.createConverter('fr' as Language))
        .toThrow('Unsupported language: fr');
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return all supported languages', () => {
      const languages = NumberToWordsFactory.getSupportedLanguages();
      expect(languages).toContain('en');
      expect(languages).toContain('ro');
      expect(languages).toContain('es');
      expect(languages.length).toBe(3);
    });
  });

  describe('isLanguageSupported', () => {
    it('should correctly identify supported languages', () => {
      expect(NumberToWordsFactory.isLanguageSupported('en')).toBe(true);
      expect(NumberToWordsFactory.isLanguageSupported('ro')).toBe(true);
      expect(NumberToWordsFactory.isLanguageSupported('es')).toBe(true);
    });

    it('should correctly identify unsupported languages', () => {
      expect(NumberToWordsFactory.isLanguageSupported('fr')).toBe(false);
      expect(NumberToWordsFactory.isLanguageSupported('')).toBe(false);
    });
  });
});
