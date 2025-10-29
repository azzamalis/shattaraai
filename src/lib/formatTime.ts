export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) {
    if (hours === 1) return 'about 24 hours ago';
    return `about ${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (months < 12) return `about ${months} month${months !== 1 ? 's' : ''} ago`;
  return `about ${years} year${years !== 1 ? 's' : ''} ago`;
}
