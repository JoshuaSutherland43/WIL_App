declare module 'haversine' {
  export type Unit = 'mile' | 'km' | 'meter' | 'nmi';
  export interface Options {
    unit?: Unit;
    format?: string;
    threshold?: number;
  }
  export interface PointLike {
    latitude: number;
    longitude: number;
  }
  export default function haversine(start: PointLike, end: PointLike, options?: Options): number;
}
