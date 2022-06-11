const getNotes = async (token) => {
  const res = await fetch(`${process.env.api}/note`, {
    method: "GET",
    headers: {
      token,
    },
  });
  const notes = await res.json();
  return notes;
};

export default getNotes;
