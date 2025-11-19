// This file used for
declare module 'culori' {
  export interface Color {
    mode: string;
    r?: number;
    g?: number;
    b?: number;
    h?: number;
    s?: number;
    l?: number;
    c?: number;
    a?: number;
    alpha?: number;
  }

  export function parse(color: string): Color | undefined;
  export function formatHex(color: Color): string;
  export function wcagContrast(color1: Color, color2: Color): number;
  export function differenceCiede2000(): (color1: Color, color2: Color) => number;
  export function filterDeficiencyProt(severity?: number): (color: Color) => Color | undefined;
  export function filterDeficiencyDeuter(severity?: number): (color: Color) => Color | undefined;
  export function filterDeficiencyTrit(severity?: number): (color: Color) => Color | undefined;
  export function converter(mode: string): (color: Color) => Color;
}
