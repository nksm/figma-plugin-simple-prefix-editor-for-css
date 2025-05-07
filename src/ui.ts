/// <reference types="@figma/plugin-typings" />
import { ApplyMessage, ResetMessage } from './types';
import { MESSAGE_TYPE } from './constants';
import './ui.css';

// Run after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const prefixInput = document.getElementById('prefix') as HTMLInputElement;
  const previewCode = document.querySelector('.preview__code') as HTMLElement;

  // Function to update the preview display
  const updatePreview = () => {
    previewCode.textContent = prefixInput.value
      ? `var(--${prefixInput.value}-variableName)`
      : '-';
  };

  // Update preview on initial display
  updatePreview();

  // Update preview when prefix changes
  prefixInput.addEventListener('input', updatePreview);

  // Theme is managed directly through system settings, not dependent on Figma messages

  // Apply button event listener
  const applyButton = document.getElementById('apply');
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

  const resetButton = document.getElementById('reset');
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
});
