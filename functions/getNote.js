const getNote = async (idNote, token) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/note/${idNote}`, {
    headers: { token },
  });
  const note = await res.json();
  return note;
};

export default getNote;
