import { useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import Cookie from "universal-cookie";
import { Button } from "react-bootstrap";

export default function Index() {
  const cookie = new Cookie();

  // useEffect(() => {
  //   const token = cookie.get("token");
  //   if (token) {
  //     router.push("/home");
  //   }
  // }, []);

  return (
    <div className="container">
      <h1 className="text-center py-4">Welcome to Note Blog</h1>
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
    const resVefify = await fetch("http://localhost:3001/user/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
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
