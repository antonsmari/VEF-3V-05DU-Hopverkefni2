import Form from "next/form";
import { createUser} from "@/db/repo/usersRepo";
import bcrypt from "bcryptjs";
export default function Register() {
	async function newUser(formData:FormData) {
		"use server";
		createUser({
			displayName: formData.get("name") as string,
			email: formData.get("email") as string,
			passwordHash: await bcrypt.hash(formData.get("password") as string, 10),
		});

	}
	return (
		<div>
			<Form action={newUser}>
            /* put register information in a session of logged in users*/
            /* reroutes to an enviroment for a logged in user*/
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
