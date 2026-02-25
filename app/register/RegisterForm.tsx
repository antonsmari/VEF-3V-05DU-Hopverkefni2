"use client";

import { FormWithAction } from "@/components/FormWithAction";
import { useState } from "react";

export function RegisterForm({
	action,
}: {
	action: (formData: FormData) => Promise<void>;
}) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	return (
		<div className="form-page">
			<FormWithAction action={action}>
				<h2>Create Account</h2>

				<div className="form-group">
					<label htmlFor="name">Name</label>
					<input
						id="name"
						type="text"
						name="name"
						placeholder="Your name"
						value={formData.name}
						onChange={(e) =>
							setFormData({ ...formData, name: e.target.value })
						}
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
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
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
						value={formData.password}
						onChange={(e) =>
							setFormData({
								...formData,
								password: e.target.value,
							})
						}
						required
					/>
				</div>

				<div className="form-submit">
					<button type="submit">Sign Up</button>
				</div>
			</FormWithAction>
		</div>
	);
}
