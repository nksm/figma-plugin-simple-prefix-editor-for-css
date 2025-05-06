/// <reference types="@figma/plugin-typings" />
import { ApplyMessage, CancelMessage, ResetMessage } from './types';
import { MESSAGE_TYPE } from './constants';
import './ui.css';

// Run after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const bodyElement = document.body;
  const prefixInput = document.getElementById('prefix') as HTMLInputElement;
  const previewCode = document.querySelector('.preview__code') as HTMLElement;

  // Function to apply theme settings
  const applyTheme = (isDarkMode: boolean) => {
    if (isDarkMode) {
      bodyElement.classList.add('figma-dark');
      bodyElement.classList.remove('figma-light');
    } else {
      bodyElement.classList.add('figma-light');
      bodyElement.classList.remove('figma-dark');
    }
  };

  // Function to update the preview display
  const updatePreview = () => {
    previewCode.textContent = prefixInput.value
      ? `var(--${prefixInput.value}-variableName)`
      : '-';
  };

  // Update preview on initial display
  updatePreview();

  // Update preview when prefix changes
  if (prefixInput) {
    prefixInput.addEventListener('input', updatePreview);
  }

  // Theme is managed directly through system settings, not dependent on Figma messages

  // Apply button event listener
  const applyButton = document.getElementById('apply');
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      // Send message to plugin
      parent.postMessage(
        {
          pluginMessage: {
            type: MESSAGE_TYPE.APPLY,
            prefix: prefixInput.value,
          } as ApplyMessage,
        },
        '*'
      );
    });
  }

  // Cancel button event listener
  const cancelButton = document.getElementById('cancel');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      // Send cancel message to plugin
      parent.postMessage(
        {
          pluginMessage: {
            type: MESSAGE_TYPE.CANCEL,
          } as CancelMessage,
        },
        '*'
      );
    });
  }

  const resetButton = document.getElementById('reset');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      // Send message to plugin
      parent.postMessage(
        {
          pluginMessage: {
            type: MESSAGE_TYPE.RESET,
          } as ResetMessage,
        },
        '*'
      );
    });
  }

  // Automatic dark/light mode detection (system settings)
  // This works based on browser/OS settings, separate from Figma theme
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Set initial state
  applyTheme(darkModeMediaQuery.matches);

  // Detect theme changes
  darkModeMediaQuery.addEventListener('change', (e) => {
    applyTheme(e.matches);
  });
});
