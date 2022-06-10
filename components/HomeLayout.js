import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "universal-cookie";
import { Dropdown } from "react-bootstrap";
import { GrAddCircle } from "react-icons/gr";
import { FaUserAlt } from "react-icons/fa";

export default function HomeLayout(props) {
  const cookie = new Cookie();
  const router = useRouter();
  const [user, setUser] = useState({});
  const [path, setPath] = useState("");

  useEffect(() => {
    setUser(cookie.get("user"));
    setPath(router.pathname);
  }, []);

  const handleLogOut = () => {
    cookie.remove("token");
    cookie.remove("user");
    router.push("/");
  };

  const deleteNote = async () => {
    const idNote = router.query.note;
    const res = await fetch("http://localhost:3001/note/" + idNote, {
      method: "DELETE",
      headers: { token: cookie.get("token") },
    });
    const data = await res.json();
    router.push("/home?msg=" + data.msg);
  };

  return (
    <div className="container">
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
          <Dropdown.Toggle variant="light" />

          <Dropdown.Menu>
            {path !== "/home" && (
              <>
                <Dropdown.Item onClick={() => router.push("/home")}>
                  Home
                </Dropdown.Item>
                <Dropdown.Item onClick={deleteNote}>Delete Note</Dropdown.Item>
              </>
            )}
            <Dropdown.Item onClick={handleLogOut}>LogOut</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {props.children}
    </div>
  );
}
