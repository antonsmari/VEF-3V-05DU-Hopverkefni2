import Form from "next/form";
import { createGroup } from "@/db/repo/groupsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import { redirect } from "next/navigation";

export default function GroupCreate() {
    async function newGroup(formData: FormData){
    // function that is called when the form is submitted
        "use server"
        
        const user = await requireAndGetUser()
        // function that gets the user that is in the session

        const name = formData.get("title") as string;
        const description = formData.get("description") as string | null;
        // this field has the option to be empty
        const startDate = formData.get("start_date") as string;
        const endDate = formData.get("end_date") as string;

        const group = await createGroup({
        // call the function that creates a group and feed it the values from the form
            name: name,
            createdByUserId: user.id,
            description: description ?? "",
            // if description field is null return an empty string
            startDate: new Date(startDate),
            // convert the startDate to a Date object, the repo takes date objects
            endDate: endDate ? new Date(endDate) : null
            // if endDate field is empty assign it as null
        });

        redirect("/group/${group.id}");
        // redirect to the page for the group we just created
    }

    return (
        <div className="form-page">
            <Form action={newGroup} formMethod="POST" className="form-card">

                <h2>Create Group</h2>

                <div className="form-group">
                    <label htmlFor="title">Group Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Event name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Describe your event"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                        id="start_date"
                        name="start_date"
                        type="date"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="end_date">End Date (Optional)</label>
                    <input
                        id="end_date"
                        name="end_date"
                        type="date"
                    />
                </div>

                <div className="form-submit">
                    <button type="submit">Create Group</button>
                </div>

            </Form>
        </div>
    );
}