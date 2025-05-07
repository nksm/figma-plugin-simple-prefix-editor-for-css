/// <reference types="@figma/plugin-typings" />
import { ApplyMessage, ResetMessage } from './types';
import { MESSAGE_TYPE } from './constants';
import './ui.css';

// Object to manage DOM elements
interface UIElements {
  prefixInput: HTMLInputElement;
  previewCode: HTMLElement;
  applyButton: HTMLElement | null;
  resetButton: HTMLElement | null;
}

// Function to update the preview display
const updatePreview = (previewElement: HTMLElement, prefixValue: string) => {
  if (previewElement) {
    previewElement.textContent = `var(--${prefixValue}-variableName)`;
  }
};

// Function to set up the Apply button
const setApplyButton = (elements: UIElements) => {
  if (elements.applyButton) {
    elements.applyButton.addEventListener('click', () => {
      // Send message to plugin
      parent.postMessage(
        {
          pluginMessage: {
            type: MESSAGE_TYPE.APPLY,
            prefix: elements.prefixInput.value,
          } as ApplyMessage,
        },
        '*'
      );
    });
  }
};

// Function to set up the Reset button
const setResetButton = (elements: UIElements) => {
  if (elements.resetButton) {
    elements.resetButton.addEventListener('click', () => {
      // Send reset message to plugin
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
};

// Function to set up the prefix input field event listener
const setPrefixInputListener = (elements: UIElements) => {
  if (elements.prefixInput) {
    elements.prefixInput.addEventListener('input', () => {
      updatePreview(elements.previewCode, elements.prefixInput.value);
    });
  }
};

// Main initialization function
const initializeUI = () => {
  const elements: UIElements = {
    prefixInput: document.getElementById('prefix') as HTMLInputElement,
    previewCode: document.querySelector('.preview code') as HTMLElement,
    applyButton: document.getElementById('apply'),
    resetButton: document.getElementById('reset'),
  };

  // Update initial preview display
  updatePreview(elements.previewCode, elements.prefixInput.value);

  // Set up various event listeners
  setPrefixInputListener(elements);
  setApplyButton(elements);
  setResetButton(elements);
};

// Execute after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUI);
