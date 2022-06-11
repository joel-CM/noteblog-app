const deleteNote = async (idNote, token) => {
  const res = await fetch(`${process.env.api}/note/${idNote}`, {
    method: "DELETE",
    headers: { token },
  });
  const data = await res.json();
  return data;
};

export default deleteNote;
