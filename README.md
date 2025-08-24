# React Forms Task

You could see test in this files:

- Form Components Testing: Test both uncontrolled and React Hook Form implementations - hook-form.test.tsx and uncontrolled.test.tsx
  - Test form rendering with all required fields
  - Test field validation (name, age, email, passwords, etc.)
  - Test password strength calculation
  - Test form submission with valid/invalid data
  - Test error message display and clearing
  - Modal Components Testing:

- Test modal opening/closing functionality
  - Test accessibility features (focus management, ESC key) - modal.test.tsx
  - Test click outside to close behavior - modal.test.tsx
  - Test portal rendering - portal.test.tsx

- Redux Store Testing
  - Test actions and action creators - form-slice.test.ts
  - Test reducers with different action types - reducer.test.ts
  - Test selectors - selectors.test.ts
  - Test store state updates after form submissions - integration.test.ts

- Utility Functions Testing:
  - Test password strength validation - utility-functions.test.ts
  - Test image to base64 conversion - utility-functions.test.ts
  - Test form validation helpers - form-validation.test.ts
  - Test country autocomplete filtering - autocomplete.test.tsx

All components test in corresponding files

## Setup and Running

**Before use**

- Clone the repository: $ git clone https://github.com/morven2018/react-learn
- Install dependencies: $ npm install
- Switch to the corresponding branch

### Commands

- Start the development server: `$ npm run dev`
- Build the project for production: `$ npm run build`
- Run ESLint to check for linting issues and automatically fix them: `$ npm run lint`
- Formats the codebase using ESLint: `$ npm run lint:fix`
- Formats the codebase using Prettier: `$ npm run format:fix`
- Preview the production build locally using Vite: `$ npm run preview`
- Prepares the project for Git hooks using Husky: `$ npm run prepare`
- Run unit tests: $ npm run test
- Run tests with coverage: $ npm run test:coverage

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
