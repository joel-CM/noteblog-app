import { useEffect } from "react";
import { useRouter } from "next/router";
import verifyToken from "../../functions/verifyToken";
import getNotes from "../../functions/getNotes";
import { FaBook } from "react-icons/fa";
import HomeLayout from "../../components/HomeLayout";
import Card from "../../components/Card";

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
          notes.map((note) => <Card key={note._id} note={note} />)}
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

  const verify = await verifyToken(token);
  if (verify.error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const notes = await getNotes(token);
  return {
    props: { notes },
  };
}
