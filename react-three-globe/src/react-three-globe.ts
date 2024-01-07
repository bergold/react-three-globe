import { Globe, GlobeProps } from "./layers/globe";
import { Marker, MarkerProps } from "./layers/marker";
import { ThreeGlobe, ThreeGlobeProps, ThreeGlobeRef } from "./scene";

const Root = ThreeGlobe;
type RootProps = ThreeGlobeProps;
type RootRef = ThreeGlobeRef;

export { Globe, Marker, Root };

export type { GlobeProps, MarkerProps, RootProps, RootRef };
