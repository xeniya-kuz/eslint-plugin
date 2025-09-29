/**
 * @fileoverview checks public imports
 * @author sia
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const { isPathRelative } = require("../helpers/index");
const micromatch = require("micromatch");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: `problem`, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "checks public imports",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [{ // Add a schema if the rule has options
      type:'object',
      properties: {
        alias: {
          type: 'string',
        },
        testFilesPatterns: {
          type: 'array',
        }
      }
    }], 
    messages: {
      // Add messageId and message
      import: 'Абсолютный импорт разрешен только из public api (index.ts)',
      test: 'Тестовые данные необходимо импортировать из public api (testing.ts)',
    }, 
  },

  create(context) {
    // variables should be defined here
    // options in schema
    const { alias = '' , testFilesPatterns = [] } = context.options[0] ?? {};
    const allowedLayers = {
      "2pages": "pages",
      "3widgets": "widgets",
      "4features": "features",
      "5entities": "entities"
    }
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // visitor functions for different types of nodes
      ImportDeclaration(node) {
        // example: app/entities/Article
        const value = node.source.value;
        const importTo = alias? value.replace(`${alias}/`, ''): value;

        if (isPathRelative(importTo)) {
           return;
        }

        //[entities, article, model, types]
        const segments = importTo.split('/');
        const layer = segments[0];
        const slice = segments[1];

        if (!allowedLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        //[entities, article, testing]
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4; 
        const currentFilePath = context.filename;
        // при импорте из public api в тесты cypress он не компилируется, т.к. из public api экспорируются еще и ui компоненты
        const isFromMocks = currentFilePath.split('\\').at(-1).includes('mocks'); 
        const isMocks = segments.at(-1) === 'mocks'; 

        if (isImportNotFromPublicApi && !isTestingPublicApi && !isFromMocks && !isMocks) {
          context.report({
            node: node,
            messageId: 'import',
            fix: (fixer) => {
            return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
          }});
        }

        if (isTestingPublicApi) {
          const isCurrentFileTesting = testFilesPatterns.some(pattern =>micromatch.isMatch(currentFilePath,pattern))

          if (!isCurrentFileTesting) {
            context.report({node: node, messageId: 'test'});
          }
          
        }
        
      }
    };
  },
};
