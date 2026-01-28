export function generateSizeVariantId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
