# Number Words Converter

[![npm version](https://badge.fury.io/js/number-words-converter.svg)](https://badge.fury.io/js/number-words-converter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/mike-innerhaus/number-words-converter/actions/workflows/test.yml/badge.svg)](https://github.com/mike-innerhaus/number-words-converter/actions)
[![codecov](https://codecov.io/gh/mike-innerhaus/number-words-converter/graph/badge.svg)](https://codecov.io/gh/mike-innerhaus/number-words-converter)

A lightweight, zero-dependency TypeScript library for converting numbers to words in multiple languages. Currently supports English and Romanian.

## Features

- ✅ Convert numbers to words in multiple languages
- ✅ Support for both integer and decimal numbers
- ✅ Handles negative numbers and zero
- ✅ TypeScript support out of the box
- ✅ Zero runtime dependencies
- ✅ Comprehensive test coverage (>95%)
- ✅ Works in both Node.js and browser environments

## Requirements

- Node.js 14 or higher
- npm or yarn

## Installation

```bash
# Using npm
npm install number-words-converter

# Or using yarn
yarn add number-words-converter
```

## Usage

### Basic Usage

```typescript
import { numberToWords, LANGUAGES } from 'number-words-converter';

// English (default)
const words1 = numberToWords(42); // "forty-two"
const words2 = numberToWords(123.45, LANGUAGES.ENGLISH); // "one hundred twenty-three point forty-five"

// Romanian
const words3 = numberToWords(42, LANGUAGES.ROMANIAN); // "patruzeci și doi"
const words4 = numberToWords('123.45', LANGUAGES.ROMANIAN); // "o sută douăzeci și trei virgulă patruzeci și cinci"
```

### Available Languages

- `LANGUAGES.ENGLISH` - English (default)
- `LANGUAGES.ROMANIAN` - Romanian (Română)

### API Reference

#### `numberToWords(num: string | number, language: Language = 'en'): string`

Converts a number to words in the specified language.

**Parameters:**
- `num`: The number to convert (can be a string or number)
- `language`: The target language (defaults to English)

**Returns:** The number converted to words as a string

**Throws:**
- `Error` if the input cannot be converted to a valid number
- `Error` if the language is not supported

**Examples:**
```typescript
// Basic usage
numberToWords(42); // "forty-two"
numberToWords("123.45", LANGUAGES.ENGLISH); // "one hundred twenty-three point forty-five"

// With variables
const amount = 99.99;
const amountInWords = numberToWords(amount); // "ninety-nine point ninety-nine"

// In a template literal
const message = `You owe me ${numberToWords(100)} dollars.`;
// "You owe me one hundred dollars."
```

## Advanced Usage

### Handling Different Number Formats

The library handles various number formats:

```typescript
// Different decimal separators
numberToWords('1,234.56'); // US format
numberToWords('1.234,56', LANGUAGES.ROMANIAN); // EU format

// Negative numbers
numberToWords(-42); // "minus forty-two"

// Large numbers
numberToWords(1000000); // "one million"
```

## Development

### Prerequisites

- Node.js 14+
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mike-innerhaus/number-words-converter.git
   cd number-words-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Building

```bash
npm run build
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm test -- --coverage
```

### Linting

```bash
# Check for linting errors
npm run lint

# Automatically fix linting issues
npm run lint -- --fix
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by various number-to-words implementations

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Building

```bash
npm run build
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by various number-to-words implementations
- Special thanks to all contributors
