export function generateColorVariantId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function addColorVariantIds(colors: any[]): any[] {
  return colors.map(color => ({
    ...color,
    colorVariantId: color.colorVariantId || generateColorVariantId()
  }));
}
