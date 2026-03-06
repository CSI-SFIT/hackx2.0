import type { ReactNode } from "react";
import type { WaveTileColor, WaveTileTexture } from "@/ui/components/basic/wave-tiles";

export type PageName =
  | "Home"
  | "About"
  | "Problems"
  | "Timeline"
  | "Sponsors"
  | "FAQs"
  | "Contact";

export type PageCubeDef = {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  color?: WaveTileColor;
  texture?: WaveTileTexture;
  content?: ReactNode;
};

export type PageDefinition = {
  layout: PageCubeDef[];
};

export type NavItem = {
  label: PageName;
  color?: WaveTileColor;
  texture?: WaveTileTexture;
};
