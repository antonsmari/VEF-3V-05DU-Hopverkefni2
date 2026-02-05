"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
	} | null>(null);

	const showToast = (
		message: string,
		type: "error" | "success" = "error",
	) => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 5000);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{toast && (
				<div className={`toast toast-${toast.type}`}>
					{toast.message}
				</div>
			)}
			{children}
		</ToastContext.Provider>
	);
}
