/**
 * @fileoverview feature slice relative path checker
 * @author kseniia
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */

const path = require("path");
const { isPathRelative } = require("../helpers/index");

module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature slice relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [{ // Add a schema if the rule has options
      type:'object',
      properties: {
        alias: {
          type: 'string',
        }
      }
    }], 
    messages: {
      // Add messageId and message
      error:'В рамках одного слайса все пути должны быть относительными',
    }, 
  },

  //TODO: оптимизировать код, пути файлов, навести красоту

  create(context) {
    // variables should be defined here
    // options in schema
    const alias = context.options[0]?.alias ?? '';
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

        //example: C:\Мое\Программирование\Курсы\production\Ulbi\src\entities\Article\ui\ArticleListItem\ListView\ListView.tsx
        const fromFilename = context.filename;

        if (shouldBeRelative(fromFilename, importTo)){
          context.report({
            node, 
            messageId: 'error',
            fix:(fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename)
              .split('/')
              .slice(0, -1)
              .join('/')

              let relativePath = path.relative(normalizedPath, `/${importTo}`)
              .split('\\')
              .join('/')


              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath
              }
              
              return fixer.replaceText(node.source, `'${relativePath}'`)
            }
          });
        }
        
      }
    };
  },
};

const layers = {
  "pages": "pages",
  "widgets": "widgets",
  "features": "features",
  "entities": "entities",
  "shared": "shared",
}

function getNormalizedCurrentFilePath(currentFilePath) {
  //currentFilePath = C:\Мое\Программирование\Курсы\production\Ulbi\src\entities\Article\ui\ArticleListItem\ListView\ListView.tsx
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  const projectFrom = normalizedPath?.split('src')[1];
  return projectFrom?.split('\\').join('/')
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

 // to = app/entities/Article
  const toArray = to.split('/');
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article

  if (!toLayer || !toSlice || layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedCurrentFilePath(from)
  const fromArray = projectFrom?.split('/');
  const fromLayer = fromArray?.[1]; // entities
  const fromSlice = fromArray?.[2]; // Article

  if (!fromLayer || !fromSlice || layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
 
}