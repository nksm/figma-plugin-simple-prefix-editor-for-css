/// <reference types="@figma/plugin-typings" />
import { UIMessage, ApplyMessage, ResetMessage } from "./types";
import { MESSAGE_TYPE, CODE_SYNTAX_TYPE } from "./constants";

// Show plugin UI
figma.showUI(__html__, { width: 320, height: 360 });

// Theme information is managed only in the UI, the plugin doesn't get involved
// UI automatically adjusts based on OS settings

// Process messages from UI
figma.ui.onmessage = async (msg: UIMessage) => {
  if (msg.type === MESSAGE_TYPE.CANCEL) {
    figma.closePlugin();
    return;
  }

  // Ignore theme requests - UI automatically adjusts based on system settings

  if (msg.type === MESSAGE_TYPE.APPLY || msg.type === MESSAGE_TYPE.RESET) {
    // Set action type based on message type
    const isReset = msg.type === MESSAGE_TYPE.RESET;
    const notificationActionType = isReset ? "Remove" : "Update";
    
    // For ApplyMessage, get the prefix
    const prefix = !isReset ? (msg as ApplyMessage).prefix : undefined;

    try {
      // Get all available variable collections
      const collections = figma.variables.getLocalVariableCollections();

      if (collections.length === 0) {
        figma.notify("No variable collections found.");
        return;
      }

      let totalUpdatedVariables: number = 0;

      // Process each collection
      for (const collection of collections) {
        // Process each variable
        for (const variableId of collection.variableIds) {
          const variable = figma.variables.getVariableById(variableId);
          
          if (!variable) continue;

          if (isReset) {
            // Reset operation
            variable.removeVariableCodeSyntax(
              CODE_SYNTAX_TYPE.WEB as CodeSyntaxPlatform
            );
          } else if (prefix !== undefined) {
            // Apply operation
            const variableName = variable.name.replace(/\//g, "-");
            variable.setVariableCodeSyntax(
              CODE_SYNTAX_TYPE.WEB as CodeSyntaxPlatform,
              `var(--${prefix}-${variableName})`
            );
          }
          
          totalUpdatedVariables++;
        }
      }

      // Completion notification
      figma.notify(
        `${notificationActionType} code syntax for ${totalUpdatedVariables} variables`
      );
    } catch (error) {
      figma.notify(
        `An error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    // Close the plugin
    figma.closePlugin();
  }
};
