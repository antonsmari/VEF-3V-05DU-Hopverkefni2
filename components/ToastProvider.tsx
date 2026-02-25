"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
	useMemo,
	useEffect,
} from "react";
import { usePathname } from "next/navigation";

type ToastContextType = {
	showToast: (message: string, type?: "error" | "success") => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast must be used within ToastProvider");
	return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toast, setToast] = useState<{
		message: string;
		type: "error" | "success";
		id: number;
	} | null>(null);

	const showToast = useCallback(
		(message: string, type: "error" | "success" = "error") => {
			setToast({ message, type, id: Date.now() });
		},
		[],
	);

	const closeToast = useCallback(() => {
		setToast(null);
	}, []);

	const pathname = usePathname();

	useEffect(() => {
		Promise.resolve().then(() => {
			setToast(null);
		});
	}, [pathname]);

	const value = useMemo(() => ({ showToast }), [showToast]);

	return (
		<ToastContext.Provider value={value}>
			{toast && (
				<div className={`toast toast-${toast.type}`}>
					<span>{toast.message}</span>
					<button
						onClick={closeToast}
						className="toast-close"
						aria-label="Close"
					>
						×
					</button>
				</div>
			)}
			{children}
		</ToastContext.Provider>
	);
}
