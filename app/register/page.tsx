import Form from 'next/form';
export default function Register(){
  return(
    <div>
      <Form action="">
        <input type='text'>Username:</input>
        <input type='password'>Password:</input>
        <button type="submit">Submit</button>
      </Form>
    </div>
  )
}