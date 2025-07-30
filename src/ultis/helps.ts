

export const formatPrice = (price: number) =>
new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
}).format(price);

export function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toLocaleUpperCase('vi') + word.slice(1))
    .join(' ')
}