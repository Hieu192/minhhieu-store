import parse, { DOMNode, Element } from 'html-react-parser';
import Image from 'next/image';
import slugify from 'slugify';
import React from 'react';

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

export function createCategorySlug(categoryName: string): string {
  // Chuỗi các ký tự có dấu trong tiếng Việt và các ký tự không dấu tương ứng
  const accents: { [key: string]: string } = {
    'àáạảãâầấậẩẫăằắặẳẵ': 'a',
    'èéẹẻẽêềếệểễ': 'e',
    'ìíịỉĩ': 'i',
    'òóọỏõôồốộổỗơờớợởỡ': 'o',
    'ùúụủũưừứựửữ': 'u',
    'ỳýỵỷỹ': 'y',
    'đ': 'd'
  };

  let slug = categoryName.toLowerCase();

  // Thay thế các ký tự có dấu bằng các ký tự không dấu tương ứng
  for (const key in accents) {
    for (const char of key) {
      slug = slug.replace(new RegExp(char, 'g'), accents[key]);
    }
  }

  // Tiếp tục với các bước xử lý khác
  return encodeURIComponent(
    slug
      .replace(/ & /g, '-')
      .replace(/ /g, '-')
      .replace(/[^\w-]/g, '') // Giữ lại chữ cái, số, dấu gạch ngang
      .replace(/--+/g, '-') // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu
      .replace(/^-+|-+$/g, '') // Xóa dấu gạch ngang ở đầu và cuối chuỗi
  );
}

type HeadingItem = {
  id: string;
  text: string;
  level: 'h2' | 'h3';
};

export const headings: HeadingItem[] = [];

export const parseContent = (htmlContent: string) => {
  headings.length = 0; // reset TOC

  return parse(htmlContent, {
    replace: (node: DOMNode) => {
      if (node instanceof Element) {
        // Handle images
        if (node.name === 'img') {
          const { src, alt, width, height } = node.attribs;
          return (
            <Image
              src={src}
              alt={alt || ''}
              width={width ? parseInt(width) : 800}
              height={height ? parseInt(height) : 600}
              className="rounded-lg my-6"
              priority
            />
          );
        }

        // Handle headings
        if (['h2', 'h3'].includes(node.name)) {
          const text = node.children
            .map((child: any) => (child.data ? child.data : ''))
            .join('');
          const id = slugify(text, { lower: true, strict: true });

          headings.push({ id, text, level: node.name as 'h2' | 'h3' });

          return React.createElement(
            node.name,
            { id, style: { scrollMarginTop: '8rem' }, },
            text
          );
        }
      }
    },
  });
};


export function isValidVietnamPhone(phone: string): boolean {
  if (!phone) return false;

  // Xoá tất cả ký tự không phải số, trừ dấu +
  let cleaned = phone.trim().replace(/[^0-9+]/g, '');

  // Chuyển +84 hoặc 84 đầu thành 0
  if (cleaned.startsWith('+84')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('84')) {
    cleaned = '0' + cleaned.slice(2);
  }

  // Regex cho di động (10 số)
  const mobileRegex = /^0(3[2-9]|5[6,8,9]|7[0,6-9]|8[1-9]|9[0-9])[0-9]{7}$/;

  // Regex cho cố định (10 hoặc 11 số bắt đầu bằng 02)
  const landlineRegex = /^02\d{8,9}$/;

  return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
}
