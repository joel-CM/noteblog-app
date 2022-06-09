import { useEffect, useState } from "react";
import router from "next/router";
import Cookie from "universal-cookie";
import { Card, Dropdown } from "react-bootstrap";
import { FaUserAlt, FaBook } from "react-icons/fa";
import { GrAddCircle } from "react-icons/gr";

export default function Home({ token, notes }) {
  const cookie = new Cookie();
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(cookie.get("user"));
  }, []);

  const handleLogOut = () => {
    cookie.remove("token");
    cookie.remove("user");
    router.push("/");
  };

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center">
        <span className="mx-4 d-flex align-items-center">
          <GrAddCircle
            className="mx-4"
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={() => router.push("/create")}
          />
          <FaUserAlt className="mx-2" />
          {user?.name}
        </span>
        <Dropdown>
          <Dropdown.Toggle variant="light"></Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogOut}>LogOut</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <h1 className="text-center pb-4 d-flex align-items-center justify-content-center">
        <FaBook className="mx-2" />
        Your Notes
      </h1>
      <div className="row gap-2 justify-content-center">
        {notes.length > 0 &&
          notes.map((note) => (
            <Card key={note._id} className="col-md-3">
              <Card.Body>
                <Card.Title>{note.title}</Card.Title>
                <Card.Text>
                  {note.description.length > 100
                    ? note.description.slice(0, 100) + "..."
                    : note.description}
                  <span
                    className="text-primary mx-2"
                    style={{ cursor: "pointer" }}
                  >
                    detail
                  </span>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        {!notes.length && <h4 className="text-center">No notes yet</h4>}
      </div>
    </div>
  );
}

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

  const res = await fetch("http://localhost:3001/note", {
    method: "GET",
    headers: {
      token,
    },
  });
  const data = await res.json();

  return {
    props: { token, notes: data },
  };
}
