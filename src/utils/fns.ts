/**
 * Strips HTML tags from a given string
 *
 * @param {string} str - The string to strip HTML tags from
 * @returns {string} The string with all HTML tags removed
 */
export function stripHtmlTags(str: string) {
  /**
   * If the string is falsy or has no content, return an empty string
   */
  if (!str || !str?.trim()) return "";

  /**
   * Use a regular expression to replace all HTML tags with nothing (i.e. remove them)
   */
  return str.replace(/<[^>]*>/g, "");
}

/**
 * Get class name from a given string
 *
 * @param {string} value - The string to get the class name from
 * @returns {string} The class name
 */
export const getClassName = (value?: string): string => {
  /**
   * If the string is falsy or has no content, return an empty string
   */
  if (!value || !value?.trim()) return "";
  // Replace whitespace with nothing (i.e. remove it)
  // and convert the result to lowercase
  return value.replace(/\s/g, "").toLowerCase();
};

import { BlockSettingsProperties } from "@/type/content";

/**
 * Convert the given string to font class
 * add the prefix 'font-' with all the string
 * @param headingFont - any string
 * @returns
 */
export const getFontClassName = (headingFont: string): string => {
  /**
   * If the string is falsy or has no content, return an empty string
   */
  if (!headingFont || !headingFont?.trim()) return "";
  // Implement your logic here
  return `font-${headingFont.toLowerCase()}`;
};

/**
 * Return the font size class
 * Providing class will be 'Size 48px'
 * convert this to size-48px
 * @param headingFontSize
 * @returns
 */
export const getFontSizeClassName = (headingFontSize: string): string => {
  /**
   * If the string is falsy or has no content, return an empty string
   */
  if (!headingFontSize || !headingFontSize?.trim()) return "";
  // Implement your logic here
  return `s-${headingFontSize
    .toLocaleLowerCase()
    .replace("size", "")
    .replace(" ", "")}`;
};

/**
 *
 * @param alignment
 * @returns
 */
export const getTextAlignmentClassName = (alignment: string): string => {
  // Implement your logic here
  return `text-${alignment.toLowerCase()}`;
};

/**
 * Generate class names for the block section tag by checking the properties
 * @param settings
 */
export const generateBlockClassNames = (settings: BlockSettingsProperties) => {
  let classNames = "";
  if (settings.removeMarginBottom) {
    classNames += "mb-0 ";
  }
  if (settings.removeMarginTop) {
    classNames += "mt-0 ";
  }
  if (settings.removePaddingTop) {
    classNames += "pt-0 ";
  }
  if (settings.removePaddingBottom) {
    classNames += "pb-0 ";
  }
  if (settings.paddingTop) {
    classNames += `pt-${settings.paddingTop} `;
  }
  if (settings.paddingBottom) {
    classNames += `pb-${settings.paddingBottom} `;
  }
  if (settings.paddingLeft) {
    classNames += `pl-${settings.paddingLeft} `;
  }
  if (settings.paddingRight) {
    classNames += `pr-${settings.paddingRight} `;
  }
  if (settings.marginLeft) {
    classNames += `ml-${settings.marginLeft} `;
  }
  if (settings.marginRight) {
    classNames += `mr-${settings.marginRight} `;
  }
  if (settings.customCssClass) {
    classNames += settings.customCssClass;
  }
  return classNames;
};
export function formatToCurrency(value: number): string {
  return formatMoney(value, 2, ",", ".") + " EUR";
}

export function formatMoney(
  number: number,
  decPlaces: number = 2,
  decSep: string = ".",
  thouSep: string = ","
): string {
  decPlaces = isNaN(Math.abs(decPlaces)) ? 2 : Math.abs(decPlaces);
  const sign = number < 0 ? "-" : "";
  const roundedNumber = Math.abs(number).toFixed(decPlaces);
  const numberParts = roundedNumber.split(".");
  let integerPart = numberParts[0];
  const decimalPart = numberParts.length > 1 ? decSep + numberParts[1] : "";
  let result = "";

  // Adding thousands separator
  while (integerPart.length > 3) {
    result = thouSep + integerPart.slice(-3) + result;
    integerPart = integerPart.slice(0, -3);
  }

  result = sign + integerPart + result + decimalPart;
  return result;
}

export function URLEncode(params: Record<string, string>): string {
  return Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${params[key]}`) // Avoid encoding value part or customize it
    .join("&");
}
