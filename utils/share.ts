import type { Match } from '../types';

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true; // Copied successfully
  } catch (err) {
    console.error('Failed to copy text to clipboard:', err);
    return false; // Failed to copy
  }
};


/**
 * Copies the direct URL of a match to the clipboard.
 * @param match The match object.
 * @returns A promise that resolves to `true` if the URL was copied to clipboard, `false` otherwise.
 */
export const copyMatchUrl = async (match: Match): Promise<boolean> => {
  const url = `${window.location.origin}/${match.id}`;
  return copyToClipboard(url);
};