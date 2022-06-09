import { useState } from "react";
import router from "next/router";
import { Form, Button } from "react-bootstrap";

export default function Create({ token }) {
  const [note, setNote] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/note/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify(note),
      });
      const data = await res.json();
      if (!data.error) {
        setNote({ title: "", description: "" });
        return alert(data.msg);
      }
      return alert(data.msg);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4"></div>
      <div className="col-md-4">
        <h1 className="text-center my-4">Create Note</h1>
        <Form className="w-100" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={note.title}
              placeholder="Title..."
              autoFocus
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={note.description}
              rows={3}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Create
          </Button>
          <Button
            variant="light"
            className="w-100 mb-4"
            onClick={() => router.push("/home")}
          >
            Back to home
          </Button>
        </Form>
      </div>
      <div className="col-md-4"></div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  if (!token) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return {
    props: { token },
  };
}
