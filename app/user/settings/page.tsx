import Image from "next/image";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import { updateUserProfile } from "@/db/repo/usersRepo";
import { redirect } from "next/navigation";
import { FormWithAction } from "@/components/FormWithAction";
import ProfileSettingsForm from "./ProfileSettingsForm";

export default async function userSettings() {
	const user = await requireAndGetUser();
	// get user that is in session
	async function updateProfile(formData: FormData) {
		"use server";

		const name = formData.get("name") as string;
		const image = formData.get("profile_pic") as string;
		const pronouns = formData.get("pronouns") as string;
		const description = formData.get("description") as string;

		await updateUserProfile({
			id: user.id,
			displayName: name,
			description: description ?? "",
			pronouns: pronouns ?? "",
			image: image,
		});

		redirect("/user/dashboard/");
	}

	return <ProfileSettingsForm user={user} updateProfile={updateProfile} />;
}
