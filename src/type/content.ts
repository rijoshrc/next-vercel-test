export type Content = {
  contentType: string;
  id: string;
};

export type BlockItem = {
  content: any;
  settings?: any;
};

export type BlockContent = {
  properties: { items: { items: BlockItem[] } };
} & Content;

export type BlockSettingsProperties = {
  hideSection: boolean;
  customCssClass?: string;
  anchorName?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  removePaddingTop: boolean;
  removePaddingBottom: boolean;
  addMarginTop?: string;
  addMarginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  removeMarginTop: boolean;
  removeMarginBottom: boolean;
};

export type BlockSettings = {
  properties: BlockSettingsProperties;
} & Content;

export type ContentBlock = {
  content: BlockContent;
  settings: BlockSettings;
};
