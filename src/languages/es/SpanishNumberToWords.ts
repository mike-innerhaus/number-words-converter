import { BaseNumberToWords } from '../base/BaseNumberToWords';
import type { Language } from '../../core/types';

export class SpanishNumberToWords extends BaseNumberToWords {
  protected readonly language: Language = 'es';

  protected readonly zero: string = 'cero';
  protected readonly negative: string = 'menos';
  protected readonly separator: string = 'coma'; 

  protected readonly ones: string[] = [
    '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'
  ];

  protected readonly teens: string[] = [
    'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 
    'diecisiete', 'dieciocho', 'diecinueve'
  ];

  protected readonly tens: string[] = [
    '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
  ];

  
  protected readonly hundreds: string[] = [
    '', 
    'ciento', 
    'doscientos',
    'trescientos',
    'cuatrocientos',
    'quinientos',
    'seiscientos',
    'setecientos',
    'ochocientos',
    'novecientos'
  ];

  protected readonly scales: string[] = [
    '', 'mil', 'millón', 
    'mil millones', 
    'billón',       
    'mil billones', 
    'trillón'       
  ];

  constructor() {
    super();
  }

  protected override convertLessThanThousand(num: number): string {
    if (num === 0) {
      return '';
    }

    let result = '';

    if (num === 100) {
      return 'cien';
    }

    if (num > 100) { 
      const hundredDigit = Math.floor(num / 100);
      result += this.hundreds[hundredDigit];
      num %= 100;
      if (num > 0) {
        result += ' ';
      }
    }

    if (num > 0) {
      if (num < 10) {
        result += this.ones[num];
      } else if (num < 20) { 
        result += this.teens[num - 10];
      } else if (num < 30) { 
        if (num === 20) {
          result += 'veinte';
        } else {
          switch (num) {
            case 21: result += 'veintiuno'; break;
            case 22: result += 'veintidós'; break;
            case 23: result += 'veintitrés'; break;
            case 24: result += 'veinticuatro'; break;
            case 25: result += 'veinticinco'; break;
            case 26: result += 'veintiséis'; break;
            case 27: result += 'veintisiete'; break;
            case 28: result += 'veintiocho'; break;
            case 29: result += 'veintinueve'; break;
          }
        }
      } else { 
        const tenDigit = Math.floor(num / 10);
        result += this.tens[tenDigit];
        const oneDigit = num % 10;
        if (oneDigit > 0) {
          result += ' y ' + this.ones[oneDigit];
        }
      }
    }
    return result.trim();
  }

  protected override convertInteger(integerStr: string): string {
    const num = BigInt(integerStr);

    if (num === 0n) {
      return this.zero;
    }

    if (num < 0n) {
      return `${this.negative} ${this.convertInteger(integerStr.substring(1))}`;
    }

    let result = '';
    let remaining = num;
    let isFirstScaleGroup = true; 

    for (let i = this.scales.length - 1; i >= 0; i--) {
      const scaleValue = BigInt(10) ** BigInt(3 * i);
      if (remaining >= scaleValue || (i === 0 && remaining > 0n)) { 
        const scaleCount = remaining / scaleValue;
        remaining = remaining % scaleValue;

        if (scaleCount > 0n) {
          let scaleStr = '';
          if (scaleCount === 1n && (this.scales[i] === 'mil' || this.scales[i] === 'mil millones')) {
            scaleStr = this.scales[i]; 
          } else {
            let countAsWords = this.convertLessThanThousand(Number(scaleCount));
            if (scaleCount === 1n && i > 1 && this.scales[i].endsWith('llón')) { 
              if (countAsWords === 'uno') countAsWords = 'un';
            }
            
            scaleStr = countAsWords;
            if (this.scales[i]) {
              let scaleName = this.scales[i];
              if (scaleCount > 1n && i > 1 && scaleName.endsWith('llón')) {
                if (scaleName === 'millón') scaleName = 'millones';
                else if (scaleName === 'billón') scaleName = 'billones'; 
                else if (scaleName === 'trillón') scaleName = 'trillones'; 
                else scaleName += 'es'; 
              }
              scaleStr += ` ${scaleName}`;
            }
          }

          if (!isFirstScaleGroup && result !== '') {
            result += ' ';
          }
          result += scaleStr;
          isFirstScaleGroup = false;
        }
      }
    }

    if (remaining > 0n && result === '') { 
        result = this.convertLessThanThousand(Number(remaining));
    }

    return result.trim();
  }
}
