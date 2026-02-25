import { RegisterForm } from "./RegisterForm";
import { createUser } from "@/db/repo/usersRepo";
import bcrypt from "bcryptjs";
import { ToastError } from "@/lib/errors/ToastError";
import { z } from "zod";

const registerSchema = z.object({
	name: z.string().min(1, "Name is required").trim(),
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default async function Register() {
	async function newUser(formData: FormData) {
		"use server";

		const data = {
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const result = registerSchema.safeParse(data);

		if (!result.success) {
			throw new ToastError(result.error?.issues[0].message);
		}

		createUser({
			displayName: formData.get("name") as string,
			email: formData.get("email") as string,
			passwordHash: await bcrypt.hash(
				formData.get("password") as string,
				10,
			),
		});
	}

	return <RegisterForm action={newUser} />;
}
