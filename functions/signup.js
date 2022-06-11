const signup = async (state) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });
  const data = await res.json();
  return data;
};

export default signup;
