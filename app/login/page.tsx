import Form from "next/form";
import { getUserByEmail } from "@/db/repo/usersRepo";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createDbSession } from "@/lib/auth/session";

export default function Login() {
	async function loginUser(formData: FormData) {
		// run function when loginform has been submitted
		"use server";

		const email = formData.get("email") as string;
		// get the email that was submitted in the form
		const password = formData.get("password") as string;
		// get the password that was submitted in the form

		const user = await getUserByEmail(email);
		// check if submitted email is in the list of registered users

		if (!user) {
			throw new Error("No registered user found with this email");
		}

		const validPassword = await bcrypt.compare(
			password,
			user.passwordHash,
			// check if the password of registered user matches the submitted password
		);

		if (!validPassword) {
			throw new Error("Invalid Password");
			// if the password does not match, an error message is sent
		}

		await createDbSession(user.id);
		// create a session for the logged in user

		redirect("/user/dashboard");
	}

	return (
		<div className="form-page">
			<Form formMethod="post" action={loginUser} className="form-card">

				<h2>Log In</h2>

				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						name="email"
						placeholder="Enter your email"
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						name="password"
						placeholder="Enter your password"
						required
					/>
				</div>

				<div className="form-submit">
					<button type="submit">Log In</button>
				</div>

			</Form>
		</div>
	);
}
