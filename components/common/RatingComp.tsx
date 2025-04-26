import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Rating,
  Button,
  Box,
  Slide,
} from "@mui/material";

interface RatingCompProps {
  text: string;
  variant: "text" | "outlined" | "contained";
  doctor: { name: string; title: string };
  setDoctorRating: (value: number | null) => void;
}

const RatingComp: React.FC<RatingCompProps> = ({
  text,
  variant,
  doctor,
  setDoctorRating,
}) => {
  const [open, setOpen] = useState(false);

  // Rating state for multiple categories
  const [ratings, setRatings] = useState({
    communication: 0,
    understanding: 0,
    solutions: 0,
    commitment: 0,
  });

  const handleRatingChange =
    (name: string) => (_: any, value: number | null) => {
      setRatings((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = () => {
    setOpen(false);
    const averageRating =
      (ratings.communication +
        ratings.understanding +
        ratings.solutions +
        ratings.commitment) /
      4;
    setDoctorRating(averageRating);
  };

  const renderRatingField = (label: string, name: string) => (
    <Box textAlign="center" mb={2}>
      <Typography variant="body1">{label}</Typography>
      <Rating
        value={ratings[name as keyof typeof ratings]}
        size="large"
        precision={0.5}
        onChange={handleRatingChange(name)}
      />
    </Box>
  );

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        {text}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Slide}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" className="text-blue-600 font-semibold">
              {doctor.name}
            </Typography>
            <Typography variant="body1">Title: {doctor.title}</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          {renderRatingField("Communication", "communication")}
          {renderRatingField("Understanding", "understanding")}
          {renderRatingField("Providing Solutions", "solutions")}
          {renderRatingField("Commitment", "commitment")}
        </DialogContent>

        <Box display="flex" justifyContent="flex-end" gap={2} p={2}>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={Object.values(ratings).some((rating) => rating === 0)}
          >
            Submit
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default RatingComp;
