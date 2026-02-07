import Form from "next/form";
import { createUser } from "@/db/repo/usersRepo";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
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

		redirect("/user/dashboard")
	}
	return (
		<div>
			<Form formMethod="post" action={newUser}>
				{/* put register information in a session of logged in users*/}
				{/* reroutes to an enviroment for a logged in user*/}
				<label htmlFor="name">Name:</label>
				<input id="name" type="text" name="name" placeholder="Name" />

				<label htmlFor="email">Email:</label>
				<input
					id="email"
					type="email"
					name="email"
					placeholder="Email"
				/>

				<label htmlFor="password">Password:</label>
				<input
					id="password"
					type="password"
					name="password"
					placeholder="Password"
				/>

				<button type="submit">Submit</button>
			</Form>
		</div>
	);
}
