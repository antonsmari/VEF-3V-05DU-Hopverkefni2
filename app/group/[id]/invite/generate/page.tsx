import { generateGroupInviteCode } from "@/db/repo/groupsRepo";
import { redirect } from "next/navigation";

export default async function generateInvite({
	params,
}: {
	params: Promise<{ id: string }>;
    // the id string is in the url
}) {

    const { id } = await params;

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
    const inviteUrl = `localhost:3000/group/${groupId}/invite/${group.inviteCode}`;
    // build the invite link where the invite code is the last to make it specific to each group

    return(
        <div>
            <h2>Invite link</h2>
            <p>Share this to invite members to your group</p>
            <div>{inviteUrl}</div>
        </div>
    )
}