import router from "next/router";
import verifyToken from "../../../functions/verifyToken";
import getNote from "../../../functions/getNote";
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

  const verify = await verifyToken(token);
  if (verify.error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const idNote = ctx.query.note;
  const note = await getNote(idNote, token);

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
