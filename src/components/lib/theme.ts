export const DEFAULT_THEME_COLOR = '#08979c';
const DEFAULT_THEME_HSL = '182 91% 32%';

export function setThemeColor(hexColor: string | null) {
  if (!hexColor) return;

  if (hexColor === DEFAULT_THEME_COLOR) {
    document.documentElement.style.setProperty('--organization-primary', DEFAULT_THEME_HSL);
  }

  // Convert hex to HSL
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  // Convert to HSL values that CSS uses
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  // Set the CSS variable
  document.documentElement.style.setProperty('--organization-primary', `${h} ${s}% ${l}%`);
}
