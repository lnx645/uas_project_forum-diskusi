export const formatReputation = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(num);
};
export const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "some time ago";
  
  const now = new Date();
  const past = new Date(dateString);
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  
  const elapsed = now.getTime() - past.getTime();
  
  if (elapsed < msPerMinute) {
     return "just now";
  } else if (elapsed < msPerHour) {
     const mins = Math.round(elapsed / msPerMinute);
     return `${mins} min${mins > 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerDay) {
     const hours = Math.round(elapsed / msPerHour);
     return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
     const days = Math.round(elapsed / msPerDay);
     return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};