import React from "react";

/**
 * Credit: https://github.com/pmndrs/tunnel-rat
 */

/**
 * On the server, React emits a warning when calling `useLayoutEffect`.
 * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
 * We use this safe version which suppresses the warning by replacing it with a noop on the server.
 *
 * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */
const useIsomorphicLayoutEffect = globalThis?.document
	? React.useLayoutEffect
	: () => {};

type OutValue = readonly (readonly [string, React.ReactNode])[];

const TunnelVersionContext = React.createContext(0);
const TunnelInContext = React.createContext<{
	register: (key: string, children: React.ReactNode) => () => void;
	incVersion: () => void;
} | null>(null);
const TunnelOutContext = React.createContext<OutValue | null>(null);

export function TunnelContainer({ children }: { children: React.ReactNode }) {
	const [current, setCurrent] = React.useState<OutValue>([]);
	const [version, setVersion] = React.useState(0);

	const inContextValue = React.useMemo(
		() => ({
			register: (key: string, children: React.ReactNode) => {
				setCurrent((current) => [...current, [key, children]]);
				return () => {
					setCurrent((current) => current.filter((c) => c[0] !== key));
				};
			},
			incVersion: () => setVersion((version) => version + 1),
		}),
		[],
	);

	return (
		<>
			<TunnelInContext.Provider value={inContextValue}>
				<TunnelVersionContext.Provider value={version}>
					<TunnelOutContext.Provider value={current}>
						{children}
					</TunnelOutContext.Provider>
				</TunnelVersionContext.Provider>
			</TunnelInContext.Provider>
		</>
	);
}

export function TunnelOut() {
	const tunnel = React.useContext(TunnelOutContext);
	if (!tunnel) {
		throw new Error(
			"<TunnelOut> must be used inside a <TunnelContainer> component",
		);
	}
	return tunnel.map(([key, children]) => (
		<React.Fragment key={key}>{children}</React.Fragment>
	));
}

export function TunnelIn({ children }: { children: React.ReactNode }) {
	const key = React.useId();
	const version = React.useContext(TunnelVersionContext);
	const tunnel = React.useContext(TunnelInContext);

	if (!tunnel) {
		throw new Error(
			"<TunnelIn> must be used inside a <TunnelContainer> component",
		);
	}

	/* When this component mounts, we increase the store's version number.
    This will cause all existing rats to re-render (just like if the Out component
    were mapping items to a list.) The re-rendering will cause the final 
    order of rendered components to match what the user is expecting. */
	useIsomorphicLayoutEffect(() => {
		tunnel.incVersion();
	}, []);

	/* Any time the children _or_ the store's version number change, insert
    the specified React children into the list of rats. */
	useIsomorphicLayoutEffect(
		() => tunnel.register(key, children),
		[children, version],
	);

	return null;
}
