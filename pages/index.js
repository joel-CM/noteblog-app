import { useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import Cookie from "universal-cookie";
import { Button } from "react-bootstrap";

export default function Index() {
  const cookie = new Cookie();

  return (
    <div className="container">
      <h1 className="text-center py-4">
        Welcome to Note Blog {process.env.name}
      </h1>
      <div className="d-flex justify-content-center">
        <Link href="/signup">
          <Button className="mx-1">
            <a>signup</a>
          </Button>
        </Link>
        <Link href="/login">
          <Button className="mx-1">
            <a>login</a>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  if (token) {
    const resVefify = await fetch(
      "https://mynoteblog.herokuapp.com/user/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );
    const verify = await resVefify.json();
    if (!verify.error) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  }

  return {
    props: {},
  };
}
