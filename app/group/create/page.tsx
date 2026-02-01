import Form from "next/form";
export default function GroupCreate() {
    return (
        <div>
            <Form action="" formMethod="POST">
                <label htmlFor="title">Title for the group event</label>
                <input id="title" type="text" required/>

                <label htmlFor="description">Description (optional)</label>
                <textarea id="description"></textarea>

                <label htmlFor="start_date">Start date</label>
                <input id="start_date" type="date" required/>

                <label htmlFor="end_date">End date (optional)</label>
                <input id="end_date" type="date" />

                <button type="submit">Submit</button>
            </Form>
        </div>
    )
}