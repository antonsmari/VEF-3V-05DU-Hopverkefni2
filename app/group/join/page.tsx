import { getGroupByInviteCode } from "@/db/repo/groupsRepo";
import Form from "next/form";
import { redirect } from "next/navigation";

export default async function JoinGroup() {

    async function findGroup(formData: FormData) {
        "use server"

        const code = formData.get("invite_code") as string;
        // get the code that the user typed in the form

        const group = await getGroupByInviteCode(code);
        // get the group with the invite code the user typed

        if (!group) {
        // if a group with the invite code the user typed in does not exist throw an error message
            throw new Error("Invalid or disabled invite code")
        }

        redirect(`/group/${group.id}/invite/${code}`)
    }
    return (
        <div>
            <h1>Join Group</h1>
            <Form action={findGroup}>
                <label>Type in the group invite code</label>
                <input
                    id="invite_code"
                    name="invite_code"
                    type="text"
                    required
                />
                <button type="submit">Submit</button>
            </Form>
            the join group page
        </div>
    )
}