import Form from "next/form";
export default function Register() {
	return (
		<div>
			<Form action="">
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
