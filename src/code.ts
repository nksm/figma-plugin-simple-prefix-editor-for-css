/// <reference types="@figma/plugin-typings" />
import { UIMessage } from "./types";

// Show plugin UI
figma.showUI(__html__, { width: 320, height: 360 });

// Theme information is managed only in the UI, the plugin doesn't get involved
// UI automatically adjusts based on OS settings

// Process messages from UI
figma.ui.onmessage = async (msg: UIMessage) => {
  if (msg.type === "cancel") {
    figma.closePlugin();
    return;
  }

  // Ignore theme requests - UI automatically adjusts based on system settings

  if (msg.type === "apply") {
    const { prefix } = msg;

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

          // Get the variable name
          let variableName: string = variable.name;

          // Convert slashes to hyphens
          variableName = variableName.replace(/\//g, "-");

          // Set the code syntax
          variable.setVariableCodeSyntax(
            "WEB",
            `var(--${prefix}-${variableName})`
          );
          totalUpdatedVariables++;
        }
      }

      // Completion notification
      figma.notify(
        `Updated code syntax for ${totalUpdatedVariables} variables`
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
