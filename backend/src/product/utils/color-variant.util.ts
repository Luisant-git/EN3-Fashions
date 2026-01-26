export function generateSizeVariantId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function addSizeVariantIds(colors: any[]): any[] {
  return colors.map(color => ({
    ...color,
    sizes: color.sizes?.map(size => ({
      ...size,
      sizeVariantId: size.sizeVariantId || generateSizeVariantId()
    })) || []
  }));
}
