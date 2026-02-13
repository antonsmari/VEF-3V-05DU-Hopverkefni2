import { requireAndGetUser } from "@/lib/auth/requireUser";
import Image from "next/image";
import Link from "next/link";

export default async function(){
    const user = await requireAndGetUser()
    
    return(
        <div>
            <div><b>Name:</b>{user.displayName}</div>

            {/* Displays default image if the user's image is null */}
                <Image
                    src={
                        user.image
                        ? `/images/profile_pic/${user.image}.png`
                        : `/images/profile_pic/default.png`
                    }
                    width={500}
                    height={500}
                    alt="profile_picture"
                />

            {/* only displayed if user pronouns is not null */}
            {user.pronouns && (
                <div><b>Pronous: </b>{user.pronouns}</div>
            )}

            {/* only displayed if user description is not null */}
            {user.description && (
                <div><b>Description: </b>{user.description}</div>
            )}

            <Link href="/user/dashboard/profile/settings">Update Profile</Link>
        </div>
    );
}