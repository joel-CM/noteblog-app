import { useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "react-bootstrap";
import { FaBook } from "react-icons/fa";
import HomeLayout from "../../components/HomeLayout";

export default function Home({ notes }) {
  const router = useRouter();

  useEffect(() => {
    if (router.query.error || router.query.msg) {
      alert(router.query.error || router.query.msg);
      router.replace("/home", undefined, { shallow: true });
    }
  }, []);

  return (
    <HomeLayout>
      <h1 className="text-center py-4 d-flex align-items-center justify-content-center">
        <FaBook className="mx-2" />
        Your Notes
      </h1>
      <div className="row justify-content-center">
        {notes.length > 0 &&
          notes.map((note) => (
            <Card key={note._id} className="col-md-4">
              <Card.Body>
                <Card.Title>
                  {note.title.length > 50
                    ? note.title.slice(0, 50) + "..."
                    : note.title}
                </Card.Title>
                <Card.Text>
                  {note.description.length > 100
                    ? note.description.slice(0, 100) + "..."
                    : note.description}
                  <span
                    className="text-primary mx-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/home/note/${note._id}`)}
                  >
                    detail
                  </span>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        {!notes.length && <h4 className="text-center">No notes yet</h4>}
      </div>
    </HomeLayout>
  );
}

// -------- SSR
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

  const resVefify = await fetch("https://mynoteblog.herokuapp.com/user/verify", {
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

  const res = await fetch("https://mynoteblog.herokuapp.com/note", {
    method: "GET",
    headers: {
      token,
    },
  });
  const notes = await res.json();

  return {
    props: { notes },
  };
}
