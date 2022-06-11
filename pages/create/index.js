import { useEffect } from "react";
import router from "next/router";
import verifyToken from "../../functions/verifyToken";
import getNote from "../../functions/getNote.js";
import createNote from "../../functions/createNote";
import updateNote from "../../functions/updateNote";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function Create({ token, idNote, note: infoNote, updating }) {
  const [note, setNote] = useState({ title: "", description: "" });

  useEffect(() => {
    if (updating) {
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
      let res = null;

      if (!updating) {
        res = await createNote(note, token);
      } else {
        res = await updateNote(idNote, note, token);
      }

      if (res.error) return alert(res.msg);
      setNote({ title: "", description: "" });
      return router.push(`/home?msg=${res.msg}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4"></div>
      <div className="col-md-4">
        <h1 className="text-center my-4">
          {updating ? "Update Note" : "Create Note"}
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
            {updating ? "Update" : "Create"}
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

  const verify = await verifyToken(token);
  if (verify.error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const updating = ctx.query.edit ? true : false;
  if (!updating) {
    console.log("creando una nueva nota");
    return {
      props: { token, updating },
    };
  }

  const idNote = ctx.query.edit;
  const note = await getNote(idNote, token);
  if (!note) {
    return {
      redirect: {
        destination: `/home?msg=${note.msg}`,
        permanent: false,
      },
    };
  }

  return {
    props: { token, idNote, updating, note },
  };
}
