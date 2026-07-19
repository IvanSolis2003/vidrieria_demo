import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type Props = {
  nombre: string;
  slug: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
};

export default function CategoriaCard({ nombre, slug, descripcion, imagenUrl }: Props) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea component={Link} href={`/cotizar?categoria=${slug}`}>
        <CardMedia
          component="img"
          height="180"
          image={imagenUrl ?? "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop"}
          alt={nombre}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {nombre}
          </Typography>
          {descripcion && (
            <Typography variant="body2" color="text.secondary">
              {descripcion}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button component={Link} href={`/cotizar?categoria=${slug}`} variant="contained" fullWidth>
          Cotizar este producto
        </Button>
      </CardActions>
    </Card>
  );
}
