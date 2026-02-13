import Form from "next/form";
import { createUser } from "@/db/repo/usersRepo";
import bcrypt from "bcryptjs";
import { requireUserId } from "@/lib/auth/requireUser";

export default async function Register() {
	//const id = await requireUserId();

	async function newUser(formData: FormData) {
		"use server";
		createUser({
			displayName: formData.get("name") as string,
			email: formData.get("email") as string,
			passwordHash: await bcrypt.hash(
				formData.get("password") as string,
				10,
			),
		});
	}
	
	return (
		<div className="form-page">
			<Form formMethod="post" action={newUser} className="form-card">

				<h2>Create Account</h2>

				<div className="form-group">
					<label htmlFor="name">Name</label>
					<input
						id="name"
						type="text"
						name="name"
						placeholder="Your name"
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						name="email"
						placeholder="Your email"
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						name="password"
						placeholder="Create a password"
						required
					/>
				</div>

				<div className="form-submit">
					<button type="submit">Sign Up</button>
				</div>

			</Form>
		</div>
	);
}
