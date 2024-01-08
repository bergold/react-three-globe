import { Coordinate } from "./core/coord";
import { ThreeGlobe, ThreeGlobeProps, ThreeGlobeRef } from "./core/scene";
import { Arc, ArcProps } from "./layers/arc";
import { Globe, GlobeProps } from "./layers/globe";
import { Marker, MarkerProps } from "./layers/marker";

const Root = ThreeGlobe;
type RootProps = ThreeGlobeProps;
type RootRef = ThreeGlobeRef;

export {
	//
	Arc,
	Globe,
	Marker,
	Root,
};

export type {
	ArcProps,
	Coordinate,
	GlobeProps,
	MarkerProps,
	RootProps,
	RootRef,
};
