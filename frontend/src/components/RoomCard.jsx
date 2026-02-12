export default function RoomCard({ room, onClick }) {
  return (
    <div style={styles.card} onClick={onClick}>
      <h3>{room.subject}</h3>
      <p>Unit: {room.unit}</p>
      <p>Code: {room.code}</p>
    </div>
  );
}

const styles = {
  card: {
    padding: "15px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer"
  }
};
