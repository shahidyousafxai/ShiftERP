import { RichTextEditor } from "@mantine/rte";
import "./styles.css";

function RichTextInput({ value, setValue }) {
  return (
    <RichTextEditor
      id="rte"
      className="w-full max-h-[230px] overflow-auto"
      sticky={true}
      value={value}
      onChange={setValue}
      controls={[
        ["bold", "underline", "italic", "unorderedList", "orderedList", "link"],
      ]}
    />
  );
}

export default RichTextInput;
