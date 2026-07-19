import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h3" color="primary" gutterBottom>
          Imperio
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Aluminio · PVC · Vidrios
        </Typography>
      </Box>
    </Container>
  );
}
