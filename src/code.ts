/// <reference types="@figma/plugin-typings" />
import { UIMessage } from "./types";
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
    const { prefix } = msg;
    let notificationActionType = "Update";

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
        // Get all variable IDs in the collection
        const variableIds = collection.variableIds;

        // Process each variable
        for (const variableId of variableIds) {
          const variable = figma.variables.getVariableById(variableId);

          if (!variable) continue;

          if (msg.type === MESSAGE_TYPE.APPLY) {
            // Convert slashes to hyphens
            const variableName = variable.name.replace(/\//g, "-");

            // Set the code syntax
            variable.setVariableCodeSyntax(
              CODE_SYNTAX_TYPE.WEB as CodeSyntaxPlatform,
              `var(--${prefix}-${variableName})`
            );
          }

          if (msg.type === MESSAGE_TYPE.RESET) {
            variable.removeVariableCodeSyntax(
              CODE_SYNTAX_TYPE.WEB as CodeSyntaxPlatform
            );
            notificationActionType = "Remove";
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
