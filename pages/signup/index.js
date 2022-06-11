import { useState } from "react";
import router from "next/router";
import { Form, Button } from "react-bootstrap";

export default function Signup() {
  const [state, setState] = useState({ user: "", password: "" });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://mynoteblog.herokuapp.com/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    const data = await res.json();
    if (data.error) return alert(data.msg);
    return alert(data.msg);
  };

  return (
    <div className="row">
      <div className="col-md-4"></div>
      <div className="col-md-4">
        <h1 className="text-center my-4">SignUp</h1>
        <Form className="col-md-4 w-100" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User</Form.Label>
            <Form.Control
              type="text"
              name="user"
              autoFocus
              placeholder="User..."
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password..."
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            SignUp
          </Button>
          <Button
            variant="light"
            className="w-100"
            onClick={() => router.push("/login")}
          >
            LogIn
          </Button>
        </Form>
      </div>
      <div className="col-md-4"></div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  if (token) {
    const resVefify = await fetch("https://mynoteblog.herokuapp.com/user/verify", {
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
