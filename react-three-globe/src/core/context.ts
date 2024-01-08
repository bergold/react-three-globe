import { createContext, useContext } from "react";

import type { ThreeGlobeProps } from "./scene";

type GlobeContextState = {
	projection: ThreeGlobeProps["projection"];
};
const GlobeContext = createContext<GlobeContextState | null>(null);

export const GlobeContextProvider = GlobeContext.Provider;

export function useGlobeContext(debugName: string) {
	const ctx = useContext(GlobeContext);
	if (!ctx)
		throw new Error(
			`<${debugName}> must be used within the <ThreeGlobe> component`,
		);
	return ctx;
}
