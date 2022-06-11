const login = async (state) => {
  const res = await fetch(`${process.env.api}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });
  const data = await res.json();
  return data;
};

export default login;
