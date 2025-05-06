/// <reference types="@figma/plugin-typings" />
import { UIMessage, ApplyMessage } from './types';
import { MESSAGE_TYPE, CODE_SYNTAX_TYPE } from './constants';

// Show plugin UI
figma.showUI(__html__, { width: 280, height: 210 });

// Theme information is managed only in the UI, the plugin doesn't get involved
// UI automatically adjusts based on OS settings

// Process messages from UI
figma.ui.onmessage = (msg: UIMessage) => {
  if (msg.type === MESSAGE_TYPE.APPLY || msg.type === MESSAGE_TYPE.RESET) {
    // Set action type based on message type
    const isReset = msg.type === MESSAGE_TYPE.RESET;
    const notificationActionType = isReset ? 'Remove' : 'Update';

    // For ApplyMessage, validate prefix
    if (!isReset) {
      const applyMsg = msg as ApplyMessage;
      if (!applyMsg.prefix || applyMsg.prefix.trim() === '') {
        figma.notify('Prefix is required. Please enter a valid prefix.', {
          error: true,
          timeout: 10000,
        });
        return;
      }
    }

    // For ApplyMessage, get the prefix
    const prefix = !isReset ? (msg as ApplyMessage).prefix : undefined;

    try {
      // Get all available variable collections
      const collections = figma.variables.getLocalVariableCollections();

      if (collections.length === 0) {
        figma.notify('No variable collections found.', {
          error: true,
          timeout: 5000,
        });
        return;
      }

      let totalUpdatedVariables: number = 0;
      let variablesWithCodeSyntax: number = 0;

      // Check if variables have code syntax (for reset operation)
      if (isReset) {
        for (const collection of collections) {
          for (const variableId of collection.variableIds) {
            const variable = figma.variables.getVariableById(variableId);
            if (variable) {
              const codeSyntax = variable.codeSyntax || {};
              if (Object.keys(codeSyntax).length !== 0) {
                variablesWithCodeSyntax++;
              }
            }
          }
        }

        if (variablesWithCodeSyntax === 0) {
          figma.notify('No code syntax found to reset.', {
            error: true,
            timeout: 10000,
          });
          return;
        }
      }

      // Process each collection
      for (const collection of collections) {
        // Process each variable
        for (const variableId of collection.variableIds) {
          try {
            const variable = figma.variables.getVariableById(variableId);

            if (!variable) continue;

            if (isReset) {
              // Only attempt to remove if code syntax exists
              const codeSyntax = variable.codeSyntax || {};
              if (Object.keys(codeSyntax).length !== 0) {
                variable.removeVariableCodeSyntax(
                  CODE_SYNTAX_TYPE.WEB as CodeSyntaxPlatform
                );
                totalUpdatedVariables++;
              }
            } else if (prefix !== undefined) {
              // Apply operation
              const variableName = variable.name.replace(/\//g, '-');
              variable.setVariableCodeSyntax(
                CODE_SYNTAX_TYPE.WEB as CodeSyntaxPlatform,
                `var(--${prefix}-${variableName})`
              );
              totalUpdatedVariables++;
            }
          } catch (varError) {
            console.error(`Variable processing error: ${varError}`);
            // Continue with other variables
          }
        }
      }

      // Completion notification
      figma.notify(
        `${notificationActionType}d code syntax for ${totalUpdatedVariables} variables`,
        { timeout: 5000 }
      );
    } catch (error) {
      figma.notify(
        `An error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
        {
          error: true,
          timeout: 10000,
        }
      );
    }

    // Close the plugin
    figma.closePlugin();
  }
};
