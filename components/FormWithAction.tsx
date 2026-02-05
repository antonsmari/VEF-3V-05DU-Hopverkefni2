"use client";

import Form from "next/form";
import { useActionState, useEffect, ReactNode, useRef } from "react";
import { useToast } from "@/components/ToastProvider";

type ActionState = { error: string | null; count: number };

export function FormWithAction({
	action,
	children,
}: {
	action: (formData: FormData) => Promise<void>;
	children: ReactNode;
}) {
	const { showToast } = useToast();

	const [state, formAction] = useActionState(
		async (prevState: ActionState, formData: FormData) => {
			try {
				await action(formData);
				return { error: null, count: prevState.count + 1 };
			} catch (error) {
				return {
					error:
						error instanceof Error
							? error.message
							: "Unknown error",
					count: prevState.count + 1,
				};
			}
		},
		{ error: null, count: 0 } as ActionState,
	);

	useEffect(() => {
		if (state.error) {
			showToast(state.error, "error");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.count]);

	return (
		<Form formMethod="post" action={formAction}>
			{children}
		</Form>
	);
}
