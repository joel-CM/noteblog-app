const verifyToken = async (token) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/user/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  return data;
};

export default verifyToken;
