"use client";

import Form from "next/form";
import { useActionState, useEffect, ReactNode } from "react";
// I felt the need to create a component for the toast so it would be easier to understand when reading the code
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
							: "An unexpected error occurred",
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
		// this counter is used so the toast will show properly,
		// otherwise if the same error happens twice in a row,
		// the toast will not show the second time because the state does not change
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.count]);

	return (
		<Form formMethod="post" action={formAction} className="form-card">
			{children}
		</Form>
	);
}
