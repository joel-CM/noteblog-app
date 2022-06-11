import { useState } from "react";
import router from "next/router";
import verifyToken from "../../functions/verifyToken";
import login from "../../functions/login";
import Cookie from "universal-cookie";
import { Form, Button } from "react-bootstrap";

export default function Login() {
  const cookie = new Cookie();
  const [state, setState] = useState({ user: "", password: "" });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(state);
    if (data.error) return alert(data.msg);
    cookie.set("token", data.token, { path: "/" });
    cookie.set("user", data.user, { path: "/" });
    router.push("/home");
  };

  return (
    <div className="row">
      <div className="col-md-4"></div>
      <div className="col-md-4">
        <h1 className="text-center my-4">LogIn</h1>
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
            LogIn
          </Button>
          <Button
            variant="light"
            className="w-100"
            onClick={() => router.push("/signup")}
          >
            SignUp
          </Button>
        </Form>
      </div>
      <div className="col-md-4"></div>
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
