import router from "next/router";
import { Card } from "react-bootstrap";

export default function noteCard({ note }) {
  return (
    <Card key={note._id} className="col-md-4">
      <Card.Body>
        <Card.Title>
          {note.title.length > 50
            ? note.title.slice(0, 50) + "..."
            : note.title}
        </Card.Title>
        <Card.Text>
          {note.description.length > 100
            ? note.description.slice(0, 100) + "..."
            : note.description}
          <span
            className="text-primary mx-2"
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/home/note/${note._id}`)}
          >
            detail
          </span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
