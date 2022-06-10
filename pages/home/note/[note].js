import router from "next/router";
import HomeLayout from "../../../components/HomeLayout";
import { Card, Button } from "react-bootstrap";

export default function Note({ note }) {
  return (
    <HomeLayout>
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">{note.title}</Card.Title>
          <Card.Text className="text-center">{note.description}</Card.Text>
          <Button
            type="button"
            variant="warning"
            onClick={() => router.push("/create?edit=" + note._id)}
          >
            Update Note
          </Button>
        </Card.Body>
      </Card>
    </HomeLayout>
  );
}

// ------- SSR
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

  const idNote = ctx.query.note;
  const res = await fetch(`http://localhost:3001/note/${idNote}`, {
    headers: {
      token,
    },
  });
  const note = await res.json();

  if (note.error) {
    return {
      redirect: {
        destination: `/home?error=${note.msg}`,
        permanent: false,
      },
    };
  }

  return {
    props: { note },
  };
}
// backtick ``
