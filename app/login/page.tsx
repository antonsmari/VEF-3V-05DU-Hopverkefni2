import Form from "next/form";
export default function Login() {
	return (
		<div>
			<Form action="">
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
