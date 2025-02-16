/**
 * @fileoverview path checker according fsd
 * @author sia
 */
"use strict";

const path = require("path");
const { isPathRelative } = require("../helpers/index");
const micromatch = require("micromatch");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "path checker according fsd",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          ignoreImportPatterns: {
            type: 'array',
          },
          ignoreFiles: {
            type: 'array',
          }
        },
      }
    ],
    messages: {
      error: 'Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)',
    }, 
  },

  create(context) {
    const layers = {
      '1app': ['2pages', '3widgets', '4features', '6shared', '5entities'],
      '2pages': ['3widgets', '4features', '6shared', '5entities'],
      '3widgets': ['4features', '6shared', '5entities'],
      '4features': ['6shared', '5entities'],
      '5entities': ['6shared', '5entities'],
      '6shared': ['6shared'],
    }

    const availableLayers = {
      '1app': '1app',
      '5entities': '5entities',
      '4features': '4features',
      '6shared': '6shared',
      '2pages': '2pages',
      '3widgets': '3widgets',
    }


    const { alias = '', ignoreImportPatterns = [], ignoreFiles = [] } = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.filename;

      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath?.split('src')[1];
      const segments = projectPath?.split('\\')

      return segments?.[1];
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/')

      return segments?.[0]
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const currentFileLayer = getCurrentFileLayer()
        const importLayer = getImportLayer(importPath)

        if(isPathRelative(importPath)) {
          return;
        }

        if(!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some(pattern => {
          return micromatch.isMatch(importPath, pattern)
        });

        if(isIgnored) {
          return;
        }

        const currentFilePath = context.filename;
        const isIgnoreFile =  ignoreFiles.some(file=>{return micromatch.isMatch(currentFilePath, file)})
        
       if(isIgnoreFile) {
        return;
      }
       

        if(!layers[currentFileLayer]?.includes(importLayer)) {
          context.report({node: node, messageId: 'error'});
        }
      }
    };
  },
};
