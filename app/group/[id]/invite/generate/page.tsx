import { generateGroupInviteCode, getGroupMember } from "@/db/repo/groupsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import { redirect } from "next/navigation";

export default async function generateInvite({
	params,
}: {
	params: Promise<{ id: string }>;
    // the id string is in the url
}) {

    const { id } = await params;

    const user = await requireAndGetUser();
    // get the user that is viewing the site
    
    const membership = await getGroupMember({
    // get the member inside the group so we can reference their membership
         groupId: Number(id),
        userId: user.id
    })

    if (membership?.role !== "admin") {
    // thow an error if the group member is not an admin
        throw new Error("unautharized")
    }

    const groupId = Number(id);
    // get the group id that is marked as an id params in the url
    if (Number.isNaN(groupId)) {
        redirect("/user/dashboard");
    }

    const group = await generateGroupInviteCode(groupId)
    // get the group with the groupId and add an invite code to it
    if (!group){
        redirect("user/dashboard")
        // if a group with groupId is not found, user is redirected to user dashboard
    }

    redirect(`/group/${group.id}/invite/viewInvite`)
}