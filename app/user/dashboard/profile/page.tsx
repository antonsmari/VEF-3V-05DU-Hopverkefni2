import { requireAndGetUser } from "@/lib/auth/requireUser";
import Image from "next/image";
import Link from "next/link";

export default async function(){
    const user = await requireAndGetUser()

    return(
        <div>
            <div><b>Name:</b>{user.displayName}</div>

            {/* Only displayed if user image is not null */}
            {user.image && (
                <Image
                    src={`/images/profile_pic/${user.image}.png`}
                    width={500}
                    height={500}
                    alt=""
                />
            )};

            {/* only displayed if user pronouns is not null */}
            {user.pronouns && (
                <div><b>Pronous: </b>{user.pronouns}</div>
            )}

            {user.description && (
                <div><b>Description: </b>{user.description}</div>
            )}

            <Link href="/user/dashboard/profile/settings">Update Profile</Link>
        </div>
    );
}