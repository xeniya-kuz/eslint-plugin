/**
 * @fileoverview checks public imports
 * @author sia
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------


const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {ecmaVersion: 6, sourceType: 'module'}
});

const aliasOptions = [
  {
    alias: '@'
  }
]

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/5entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\5entities\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/5entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\5entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/5entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    }
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/5entities/Article/model/file.ts'",
      errors: [{ message: "Абсолютный импорт разрешен только из public api (index.ts)"}],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\5entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/5entities/Article/testing/file.tsx'",
      errors: [{message: 'Абсолютный импорт разрешен только из public api (index.ts)'}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\5entities\\forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/5entities/Article/testing'",
      errors: [{message: 'Тестовые данные необходимо импортировать из public api (testing.ts)'}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    }
  ],
});
