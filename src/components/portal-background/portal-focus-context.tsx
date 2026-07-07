import { createContext, useContext, useMemo, useState } from "react";

type PortalFocusContextValue = {
	isFocused: boolean;
	setFocused: (isFocused: boolean) => void;
};

const PortalFocusContext = createContext<PortalFocusContextValue | null>(
	null,
);

export function PortalFocusProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isFocused, setFocused] = useState(false);
	const value = useMemo(() => ({ isFocused, setFocused }), [isFocused]);

	return (
		<PortalFocusContext.Provider value={value}>
			{children}
		</PortalFocusContext.Provider>
	);
}

export function usePortalFocus() {
	const context = useContext(PortalFocusContext);
	if (!context) {
		throw new Error("usePortalFocus must be used within a PortalFocusProvider");
	}
	return context;
}
