import { getGroupById, updateGroupDetails, getGroupMember } from "@/db/repo/groupsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import Link from "next/link";
import Form from "next/form";

export default async function ViewInviteCode({
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

    const group = await getGroupById(Number(id))

    async function activateInviteCode() {
        "use server"
        updateGroupDetails({
            id: group.id,
            inviteCodeDisabled: false
        })
    }
    
    return (
        <div>
            {/* if invite code is missing */}
            {!group.inviteCode && (
                <div>
                    <p>The group does not have an invite code</p>
                    <Link href={`/group/${group.id}/generate`}></Link>
                </div>
            )}

            {/* if an invite code exists but is disabled */}
            {group.inviteCode && group.inviteCodeDisabled && (
                <Form action={activateInviteCode}>
                    <p>your invite code seems to be disabled, you can activate it though</p>
                    <button type="submit">Activate Invite Code</button>
                </Form>
            )}

            {/* if an invite code exists and is active admin will be able to see it */}
            {group.inviteCode && (
                <div>
                    <h2>Invite link</h2>
                    <p>Share this to invite members to your group</p>
                    <div>evently-jet.vercel.app/group/${group.id}/invite/${group.inviteCode}</div>
                    <h2>Invite Code</h2>
                    <p>Code users can paste in the join group page to join your group</p>
                    <div>{group.inviteCode}</div>
                    <Link href={`/group/${group.id}/invite/generate`}>
                        <button>Generate New Invite Code</button>
                    </Link>
                </div>
            )}
        </div>
    )
}