import { Select, Box, Chip, MenuItem } from "@mui/material";

interface MultiSelectProps {
  uniqueKey: string;
  question: { [key: string]: { [key: string]: string } };
  options: {
    text: string;
    value: string;
  }[];
}

export default function MultiSelect({
  uniqueKey,
  question,
  options,
}: MultiSelectProps) {
  return (
    <Select
      id={`${uniqueKey}.answer`}
      className=""
      defaultValue={question.answers.value.split(",") || []}
      {...register(`${uniqueKey}.answer`)}
      multiple
      renderValue={(selected: string) => (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {selected.split(",").map((value) => (
            <Chip key={value} label={value} sx={{ color: "white" }} />
          ))}
        </Box>
      )}
    >
      {question.answers.value.split(",").map((p) => {
        return <MenuItem value={p}>{p}</MenuItem>;
      })}
    </Select>
  );
}
