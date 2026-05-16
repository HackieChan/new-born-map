declare module 'react-simple-maps' {
  import { ComponentType, ReactNode } from 'react';

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      rotate?: [number, number, number];
      center?: [number, number];
      scale?: number;
    };
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onMoveStart?: (position: any) => void;
    onMove?: (position: any) => void;
    onMoveEnd?: (position: any) => void;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: GeographyType[] }) => ReactNode;
  }

  interface GeographyType {
    rsmKey: string;
    id: string;
    type: string;
    properties: Record<string, any>;
    geometry: GeoJSON.Geometry;
  }

  interface GeographyProps {
    geography: GeographyType;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
  }

  interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
}

declare module 'world-atlas/countries-110m.json' {
  const topology: any;
  export default topology;
}
