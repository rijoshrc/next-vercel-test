export default function optimizedImage(
  imageUrl: string,
  width: number = 700,
  quality: number = 10,
  replace: boolean = false
) {
  if (replace) {
    imageUrl = imageUrl.replace(/([?&])width=\d+/g, `$1width=${width}`);
    imageUrl = imageUrl.replace(/([?&])quality=\d+/g, `$1quality=${quality}`);

    return imageUrl;
  }

  return imageUrl + `?quality=${quality}&width=${width}`;
}
