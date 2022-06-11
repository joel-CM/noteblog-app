const createNote = async (note, token) => {
  console.log("->" + token);
  const res = await fetch(`${process.env.api}/note/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify(note),
  });
  const data = await res.json();
  return data;
};

export default createNote;
