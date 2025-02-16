const rule = require("../../../lib/rules/layer-imports"),
    RuleTester = require("eslint").RuleTester;

const aliasOptions = [
  {
    alias: '@'
  }
]
const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\4features\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/6shared/Button.tsx'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\4features\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/5entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\1app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/3widgets/Articl'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\3widgets\\pages',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\1app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\index.tsx',
      code: "import { StoreProvider } from '@/1app/providers/StoreProvider';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\5entities\\Article.tsx',
      code: "import { StateSchema } from '@/1app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\5entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/4features/Articl'",
      options: [
        {
          alias: '@',
          ignoreFiles:['**/5entities/providers']
        }
      ],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\5entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/4features/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\4features\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/3widgets/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\5entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/3widgets/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: aliasOptions,
    },
  ],
});
