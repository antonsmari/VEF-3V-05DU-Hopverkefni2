import { requireAndGetUser } from "@/lib/auth/requireUser";
import { getGroupMember, getGroupById, updateGroupDetails } from "@/db/repo/groupsRepo";
import { redirect } from "next/navigation";
import Form from "next/form";
export default async function UpdateGroup({
	params,
}: {
	params: Promise<{ id: string }>;
}) {

    const { id } = await params;
    // get the id code that is in the url

    const user = await requireAndGetUser()
    // get the user that is on the site

    const group = await getGroupById(Number(id));
    // get the group by the id code in the url

    const membership = await getGroupMember({
    // get the member inside the group so we can reference their role
        groupId: Number(id),
        userId: user.id
    })

    /*
    if (membership?.role !== "admin") {
    // thow an error if the group member is not an admin
        throw new Error("unautharized")
    }
    */

    if (membership.role !== "admin") {
    // redirect user to the group page if they do not have an admin role within the group
        redirect(`/group/${group.id}`)
    }

    async function editGroup(formData: FormData){
        "use server"

        const name = formData.get("name") as string;
        const description = formData.get("description") as string | null;
        const startDate = formData.get("start_date") as string;
        const endDate = formData.get("end_date") as string | null;
        const inviteCodeDisabled = formData.get("invite_code_disabled") === "on";
        // get data wether the invite code disabled checkbox is checked

        await updateGroupDetails({
            id: group.id,
            name: name,
            description: description ?? "",
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            inviteCodeDisabled
        })

        redirect(`/group/${group.id}`)
    }

    return(
        <div>
            <Form action={editGroup}>
                <label>Group Name</label>
                <input
                    id="name"
                    name="name"
                    type="name"
                    defaultValue={group.name}
                    required
                />
                <label>Description</label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={group.description}
                />
                <label>Start Date</label>
                <input
                    id="start_date"
                    name="start_date"
                    type="date"
                    defaultValue={group.startDate.toISOString().split('T')[0]}
                    required
                />
                <label>End Date</label>
                <input
                    id="end_date"
                    name="end_date"
                    type="date"
                    defaultValue={
                        group.endDate
                        ? group.endDate.toISOString().split('T')[0]
                        : ""
                    }
                />
                {/* if an invite code for the group exists, user is able to enable and disable it */}
                {group.inviteCode && (
                    <label>
                        <input
                            id="disable_invite_code"
                            name="disable_invite_code"
                            type="checkbox"
                            defaultChecked={group.inviteCodeDisabled ?? false}
                        />
                        Disable invite code
                    </label>
                )}
                <button type="submit">Submit</button>
            </Form>
        </div>
    )
}