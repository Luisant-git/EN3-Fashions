export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const generateCategoryUrl = (categoryName, categoryId) => {
  return `/category/${slugify(categoryName)}/${categoryId}`;
};

export const generateSubcategoryUrl = (subcategoryName, subcategoryId) => {
  return `/subcategory/${slugify(subcategoryName)}/${subcategoryId}`;
};

export const generateProductUrl = (productName, productId) => {
  return `/product/${slugify(productName)}/${productId}`;
};
