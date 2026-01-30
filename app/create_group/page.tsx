import Form from "next/form";
export default function CreateGroup() {
  return(
    <div>
      <Form action="" formMethod="POST">
        <label>Title the group event</label>
        <input type="text" required/>
        <label>Description (optional)</label>
        <textarea/>
        <label>Start date</label>
        <input type="date" required/>
        <label>End date (optional)</label>
        <button type="submit">Submit</button>
      </Form>
    </div>
  )
}