import { useEffect, useState } from "react";
import { Popconfirm, message } from "antd";
import { DingtalkCircleFilled } from "@ant-design/icons";
import { insertBlock } from "@/api/siyuan";
import "./index.scss";

const SelectionButton = () => {
  const [buttonPosition, setButtonPosition] = useState(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const selectText = selection.toString();
      if (!selectText) {
        return;
      }
      setText(selectText);
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const rangeEnd = range.endOffset;
          const textNode = range.endContainer;
          const textLength = textNode.textContent.length;

          if (rangeEnd === textLength) {
            // If the selection ends at the end of the text node, position the button right after it
            const rangeAfter = document.createRange();
            rangeAfter.setStart(textNode, textLength);
            rangeAfter.setEnd(textNode, textLength);
            const rectAfter = rangeAfter.getBoundingClientRect();
            setButtonPosition({
              top: rectAfter.top + window.scrollY,
              left: rectAfter.left + window.scrollX,
            });
          } else {
            // Otherwise, position the button right after the selected text
            const rangeEndRect = range.cloneRange();
            rangeEndRect.setStart(textNode, rangeEnd - 1);
            rangeEndRect.setEnd(textNode, rangeEnd);
            const rectEnd = rangeEndRect.getBoundingClientRect();
            setButtonPosition({
              top: rectEnd.bottom + window.scrollY,
              left: rectEnd.right + window.scrollX,
            });
          }
        } else {
          // setButtonPosition(null);
        }
      } else {
        // setButtonPosition(null);
        // setText('')
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const onConfirm = async () => {
    const res = await insertBlock({
      message: text,
    });
    if (res.code === 0) {
      message.info("Save successfully");
    } else {
      message.error(res.msg || "Save failed");
    }
    setOpen(false);
    setText("");
  };

  return (
    <div>
      <Popconfirm
        style={{ width: "500px" }}
        title="Save these message?"
        description={() => <div className="save_message">{text}</div>}
        onConfirm={onConfirm}
        onCancel={() => setOpen(false)}
        okText="Yes"
        cancelText="No"
        open={open}
      >
        {text && (
          <DingtalkCircleFilled
            style={{
              fontSize: "24px",
              position: "absolute",
              top: buttonPosition.top,
              left: buttonPosition.left,
              zIndex: 1000,
            }}
            onClick={() => {
              setOpen(true);
            }}
          />
        )}
      </Popconfirm>
    </div>
  );
};

export default SelectionButton;
