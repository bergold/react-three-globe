import { Coordinate } from "./coord";
import { Arc, ArcProps } from "./layers/arc";
import { Globe, GlobeProps } from "./layers/globe";
import { Marker, MarkerProps } from "./layers/marker";
import { ThreeGlobe, ThreeGlobeProps, ThreeGlobeRef } from "./scene";

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
