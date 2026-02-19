import { getUserById } from "@/db/repo/usersRepo";
import { getUserDebt } from "@/db/repo/userDebtsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import Image from "next/image";

export default async function({
	params,
}: {
	params: Promise<{ friendId: string }>;

}){
    const {friendId} = await params;


    const userFriend = await getUserById(Number(friendId));
    // get friend user by their Id

    const userLoggedIn = await requireAndGetUser();

    const debtUser = await getUserDebt({
        debtorId: Number(friendId),
        debteeId: userLoggedIn.id
    })

    const debtFriend = await getUserDebt({
       debtorId: userLoggedIn.id,
       debteeId: Number(friendId)
    })

    return(
        <div>
            <div className="profile-image">
            {/* Displays default image if the user's image is null */}
                <Image
                    src={
                        userFriend.image
                        ? `/images/profile_pic/${userFriend.image}.png`
                        : `/images/profile_pic/default.png`
                    }
                    width={500}
                    height={500}
                    alt="profile_picture"
                />
                {/* only displayed if user pronouns is not null */}
                {userFriend.pronouns && (
                    <h3>{userFriend.pronouns}</h3>
                )}
            </div>
            
            <div className="profile-info">
                <h2>{userFriend.displayName}</h2>
            
                {/* only displayed if user description is not null */}
                {userFriend.description && (
                    <p>{userFriend.description}</p>
                )}
            </div>
            {debtUser ? (
                <p>you owe {userFriend.displayName}: {debtUser.amount} kr</p>
            )
            : debtFriend ? (
                <p>{userFriend.displayName} owes you: {debtFriend.amount} kr</p>
            ) : (
                <p>You do not owe eahother</p>
            )}
            
        </div>
    )
}