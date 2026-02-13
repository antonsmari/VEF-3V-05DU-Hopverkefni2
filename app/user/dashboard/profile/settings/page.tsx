import Form from "next/form";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import { updateUserProfile } from "@/db/repo/usersRepo";
import { redirect } from "next/navigation";

export default async function userSettings(){
    const user = await requireAndGetUser();
        // get user that is in session
    async function updateProfile(formData: FormData){
        "use server"

        const name = formData.get("name") as string;
        const image = formData.get("profile_pic") as string;
        const pronouns = formData.get("pronouns") as string;
        const description = formData.get("description") as string;

        await updateUserProfile({
            id: user.id,
            displayName: name,
            description: description ?? "",
            pronouns: pronouns ?? "",
            image: image
        });

        redirect("/user/dashboard/")
    }
    
    return(
        <div>
            <Form action={updateProfile}>
                <label>Name: </label>
                <input
                    id="name"
                    name="name"
                    type="name"
                    defaultValue={user.displayName}
                />
                <label>Choose an image</label>
                <select id="profile_pic" name="profile_pic" defaultValue={user.image ?? ("default")}>
                    <option value="default">Default</option>
                    <option value="ninjago1">ninjago1</option>
                    <option value="ninjago2">ninjago2</option>
                    <option value="ninjago3">ninjago3</option>
                </select>
                <label>Pronouns</label>
                <input 
                    id="pronouns"
                    name="pronouns"
                    type="text"
                    defaultValue={user.pronouns}
                />
                <label>Description</label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={user.description}
                />
                <button type="submit">Submit</button>
            </Form>


        </div>
    )
}