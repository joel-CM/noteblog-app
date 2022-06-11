const updateNote = async (idNote, newNote, token) => {
  const res = await fetch(`${process.env.api}/note/${idNote}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify(newNote),
  });
  const data = await res.json();
  return data;
};

export default updateNote;
