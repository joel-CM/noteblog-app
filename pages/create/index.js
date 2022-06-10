import { useEffect } from "react";
import router from "next/router";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function Create({ token, idNote, infoNote, update }) {
  const [note, setNote] = useState({ title: "", description: "" });

  useEffect(() => {
    if (update) {
      setNote({
        title: infoNote.title,
        description: infoNote.description,
      });
    }
  }, []);

  const handleChange = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = null;
      if (!update) {
        res = await fetch("http://localhost:3001/note/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(note),
        });
      } else {
        res = await fetch("http://localhost:3001/note/" + idNote, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(note),
        });
      }
      const data = await res.json();
      if (!data.error) {
        setNote({ title: "", description: "" });
        return router.push("/home?msg=" + data.msg);
      } else {
        return alert(data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4"></div>
      <div className="col-md-4">
        <h1 className="text-center my-4">
          {update ? "Update Note" : "Create Note"}
        </h1>
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
            {update ? "Update" : "Create"}
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

// ---------- SSR
export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const resVefify = await fetch("http://localhost:3001/user/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  const verify = await resVefify.json();
  if (verify.error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const update = ctx.query.edit ? true : false;
  let idNote = null;
  let infoNote = null;
  if (update) {
    idNote = ctx.query.edit;
    const res = await fetch("http://localhost:3001/note/" + idNote, {
      headers: { token },
    });
    infoNote = await res.json();
  }
  return {
    props: { token, idNote, update, infoNote },
  };
}
