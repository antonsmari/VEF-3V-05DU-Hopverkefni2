import Form from 'next/form';
export default function Login(){
  return (
      <div>
          <Form action="">
            <input type='text'>Name:</input>
            <input type='email'>Email:</input>
            <input type='password'>Password:</input>
            <button type="submit">Submit</button>
          </Form>
      </div>
    )
}