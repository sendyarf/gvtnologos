import type { Match } from '../types';

/**
 * Shares a direct URL to the match using the Web Share API if available,
 * otherwise copies the URL to the clipboard.
 * @param match The match object to share.
 * @returns A promise that resolves to `true` if the URL was copied to clipboard, `false` otherwise.
 */
export const shareMatchUrl = async (match: Match): Promise<boolean> => {
  const matchTitle = match.team2.name ? `${match.team1.name} vs ${match.team2.name}` : match.team1.name;
  const url = `${window.location.origin}/${match.id}`;

  const shareData = {
    title: `Watch: ${matchTitle}`,
    text: `⚽ Watch ${matchTitle} live on GOVOET!`,
    url: url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return false; // Native share was used, no need to show toast
    } catch (err) {
      console.error('Error using Web Share API:', err);
      // Fallback to clipboard if user cancels or there's an error
      return copyToClipboard(url);
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    return copyToClipboard(url);
  }
};

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true; // Copied successfully
  } catch (err) {
    console.error('Failed to copy text to clipboard:', err);
    return false; // Failed to copy
  }
};