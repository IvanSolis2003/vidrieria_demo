import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Faq = { id: string; pregunta: string; respuesta: string };

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <div>
      {faqs.map((f) => (
        <Accordion key={f.id} disableGutters elevation={0} variant="outlined" sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{f.pregunta}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {f.respuesta}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
