import Form from "next/form";
import { createGroup } from "@/db/repo/groupsRepo";
export default function GroupCreate() {

    async function newGroup(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        //const description = formData.get("description") as string | null;
        //const startDate = formData.get("start_date") as string | null;
        //const endDate = formData.get("end_date") as string | null;
        //CAUSED AN ERROR, MIGHT ADD LATER

        const userId = 1
        // for now will update later

        await createGroup({
            name: title,
            //description: description,
            //startDate: startDate,
            //endDate: endDate,
            createdByUserId: userId
        });

    }

    return (
        <div>
            <Form action={newGroup} formMethod="POST">
                <label htmlFor="title">Title for the group event</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                />

                <label htmlFor="description">Description (optional)</label>
                <textarea
                    id="description"
                    name="description"
                />

                <label htmlFor="start_date">Start date</label>
                <input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required
                />

                <label htmlFor="end_date">End date (optional)</label>
                <input
                    id="end_date"
                    name="end_date"
                    type="date"
                />

                <button type="submit">Submit</button>
            </Form>
        </div>
    )
}