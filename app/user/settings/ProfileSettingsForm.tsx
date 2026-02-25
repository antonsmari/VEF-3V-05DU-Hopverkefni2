"use client";

import Image from "next/image";
import { FormWithAction } from "@/components/FormWithAction";
import { useState } from "react";

export default function ProfileSettingsForm({
	user,
	updateProfile,
}: {
	user: {
		id: number;
		displayName: string;
		image: string | null;
		pronouns: string | null;
		description: string | null;
	};
	updateProfile: (formData: FormData) => Promise<void>;
}) {
	const [selectedImage, setSelectedImage] = useState(user.image ?? "default");

	return (
		<div className="form-page">
			<FormWithAction action={updateProfile}>
				<h1>User Settings</h1>

				<div className="profile-image-preview">
					<Image
						src={
							selectedImage
								? `/images/profile_pic/${selectedImage}.png`
								: `/images/profile_pic/default.png`
						}
						width={220}
						height={220}
						alt="profile_picture"
					/>
				</div>

				<div className="form-group">
					<label>Name: </label>
					<input
						id="name"
						name="name"
						type="name"
						defaultValue={user.displayName}
					/>
				</div>

				<div className="form-group">
					<label>Choose an image</label>
					<select
						id="profile_pic"
						name="profile_pic"
						value={selectedImage}
						onChange={(e) => setSelectedImage(e.target.value)}
					>
						<option value="default">Default</option>
						<option value="ninjago1">ninjago1</option>
						<option value="ninjago2">ninjago2</option>
						<option value="ninjago3">ninjago3</option>
					</select>
				</div>

				<div className="form-group">
					<label>Pronouns</label>
					<input
						id="pronouns"
						name="pronouns"
						type="text"
						defaultValue={user.pronouns ?? ""}
					/>
				</div>

				<div className="form-group">
					<label>Description</label>
					<textarea
						id="description"
						name="description"
						defaultValue={user.description ?? ""}
					/>
				</div>
				<button type="submit">Submit</button>
			</FormWithAction>
		</div>
	);
}
