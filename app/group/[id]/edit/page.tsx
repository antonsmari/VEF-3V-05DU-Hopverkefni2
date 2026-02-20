import { requireAndGetUser } from "@/lib/auth/requireUser";
import { getGroupMember, getGroupById } from "@/db/repo/groupsRepo";
import { redirect } from "next/navigation";
export default async function updateGroup({
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

    return(
        <div>
            here the group will be edited
        </div>
    )
}