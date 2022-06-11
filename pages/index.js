import Link from "next/link";
import verifyToken from "../functions/verifyToken";
import { Button } from "react-bootstrap";

export default function Index() {
  return (
    <div className="container">
      <h1 className="text-center py-4">Welcome to Note Blog</h1>
      <div className="d-flex justify-content-center">
        <Link href="/signup">
          <Button className="mx-1">
            <a>SignUp</a>
          </Button>
        </Link>
        <Link href="/login">
          <Button className="mx-1">
            <a>LogIn</a>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;

  if (!token) {
    return {
      props: {},
    };
  }

  const verify = await verifyToken(token);
  if (verify.error) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: "/home",
      permanent: false,
    },
  };
}
