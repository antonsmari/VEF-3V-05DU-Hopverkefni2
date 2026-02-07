import Form from "next/form";
import { requireAndGetUser } from "@/lib/auth/requireUser";
// library that fetches the user that is logged in
// important to have so that the logged in user is the only one that can see their information
import { getUserById, updateUserPasswordHash } from "@/db/repo/usersRepo";
import { updateUserDisplayName } from "@/db/repo/usersRepo";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export default async function AccountSettings() {

    "use server"

    const user = await requireAndGetUser();
    // get the user that is logged in
    const userInfo = await getUserById(user.id);
    // get user log in information by user id

    async function updateAccount(formData: FormData) {
    // function is called once the Form is submitted

        "use server"

        const updateName = formData.get("name") as string;
        const updatePassword = formData.get("password") as string;
        
        await updateUserDisplayName(user.id, updateName);
        // call the function in usersRepo that updates changes the users display name,
        // the function takes 2 variables, the id of the user we want to change the display name for and the new name that is being updated as
        await updateUserPasswordHash(user.id, updatePassword);
        
        redirect("/user/dashboard/accountsettings");
        // redirect used to reload the site with updated changes
    }

    return(
        <div>
            <div><b>Username: </b>{userInfo.displayName}</div>
            {/* display logged in users current username */}
            <div><b>Email: </b>{userInfo.email}</div>
            {/* display logged in users current email*/}
            <div><b>Password: </b>{userInfo.passwordHash}</div>
            {/* display logged in users current password */}

            <h2>Update account settings</h2>

            <Form action={updateAccount}>
                <label htmlFor="name">Name:</label>
				<input 
                    id="name" 
                    type="text" 
                    name="name"
                    defaultValue={userInfo.displayName}
                    placeholder="Name"
                />
                {/* logged in user's current name 
                is set as default value to make sure nothing is 
                empty if the user decides to not change this field */}

				<label htmlFor="password">Password:</label>
				<input
					id="password"
					type="password"
					name="password"
                    defaultValue={userInfo.passwordHash}
					placeholder="Password"
				/>

				<button type="submit">Update</button>
            </Form>
        </div>
    )
}