/// <reference types="@figma/plugin-typings" />
import { ApplyMessage, CancelMessage } from "./types";
import "./ui.css";

// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const bodyElement = document.body;
  const prefixInput = document.getElementById("prefix") as HTMLInputElement;
  const previewCode = document.querySelector(".preview code") as HTMLElement;

  // Function to apply theme settings
  const applyTheme = (isDarkMode: boolean) => {
    if (isDarkMode) {
      bodyElement.classList.add("figma-dark");
      bodyElement.classList.remove("figma-light");
    } else {
      bodyElement.classList.add("figma-light");
      bodyElement.classList.remove("figma-dark");
    }
  };

  // Function to update the preview display
  const updatePreview = () => {
    if (previewCode) {
      previewCode.textContent = `var(${prefixInput.value}variableName)`;
    }
  };

  // Update preview on initial display
  updatePreview();

  // Update preview when prefix changes
  if (prefixInput) {
    prefixInput.addEventListener("input", updatePreview);
  }

  // Theme is managed directly through system settings, not dependent on Figma messages

  // Apply button event listener
  const applyButton = document.getElementById("apply");
  if (applyButton) {
    applyButton.addEventListener("click", () => {
      // Send message to plugin
      parent.postMessage(
        {
          pluginMessage: {
            type: "apply",
            prefix: prefixInput.value,
          } as ApplyMessage,
        },
        "*"
      );
    });
  }

  // Cancel button event listener
  const cancelButton = document.getElementById("cancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      // Send cancel message to plugin
      parent.postMessage(
        {
          pluginMessage: {
            type: "cancel",
          } as CancelMessage,
        },
        "*"
      );
    });
  }

  // Automatic dark/light mode detection (system settings)
  // This works based on browser/OS settings, separate from Figma theme
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Set initial state
  applyTheme(darkModeMediaQuery.matches);

  // Detect theme changes
  darkModeMediaQuery.addEventListener("change", (e) => {
    applyTheme(e.matches);
  });
});
