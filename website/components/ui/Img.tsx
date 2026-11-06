import Image, { type ImageProps } from "next/image";
import { UPLOAD_PREFIX } from "@winefriend/shared/constants";

/**
 * next/image wrapper. Images uploaded through the admin panel are already resized and
 * compressed in the browser, so they are served as-is instead of through the optimizer.
 */
export function Img(props: ImageProps) {
  const isUpload = typeof props.src === "string" && props.src.startsWith(UPLOAD_PREFIX);
  return <Image {...props} alt={props.alt} unoptimized={isUpload || props.unoptimized} />;
}
