const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateSizeVariantId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateSizeVariantIds() {
  try {
    const products = await prisma.product.findMany();
    
    for (const product of products) {
      if (!product.colors || product.colors.length === 0) continue;
      
      const updatedColors = product.colors.map(color => {
        if (!color.sizes || color.sizes.length === 0) return color;
        
        const updatedSizes = color.sizes.map(size => ({
          ...size,
          sizeVariantId: size.sizeVariantId || generateSizeVariantId()
        }));
        
        return { ...color, sizes: updatedSizes };
      });
      
      await prisma.product.update({
        where: { id: product.id },
        data: { colors: updatedColors }
      });
      
      console.log(`✓ Updated product ${product.id}: ${product.name}`);
    }
    
    console.log('\n✅ All products updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateSizeVariantIds();
