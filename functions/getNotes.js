const getNotes = async (token) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/note`, {
    method: "GET",
    headers: {
      token,
    },
  });
  const notes = await res.json();
  return notes;
};

export default getNotes;
