import { useEffect, useState } from "react";
import { Popover, Form, Input, Button } from "antd";
import { DingtalkCircleFilled } from "@ant-design/icons";
import { insertBlock } from "@/api/siyuan";
// import './index.scss';

const PreviewContent = (props) => {
  const { message } = props;
  const [loading, setLoading] = useState(false)
  const onFinish = async (values) => {
    setLoading(true);
    await insertBlock({message})
    setLoading(false)
  }

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onValuesChange={(changeValues, values) => {
        console.log('change:', changeValues, values)
      }}
      initialValues={{
        message,
        originUrl: location.href,
        saveServer: 'http://127.0.0.1:6806'
      }}
    >
      <Form.Item
        label="Message"
        name="message"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Origin"
        name="originUrl"
        tooltip="data origin"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Server"
        name="server"
        tooltip="This is your notebook url, will send these text to your notebook"
      >
        <Input />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const SelectionButton = () => {
  const [buttonPosition, setButtonPosition] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const selectText = selection.toString();
      if (!selectText) {
        // click will clear the text
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

  return (
    <div>
      {text && (
        <Popover
          className=""
          title="Preview info"
          content={() => <PreviewContent message={text} />}
          trigger="click"
        >
          <DingtalkCircleFilled
            style={{
              fontSize: "24px",
              position: "absolute",
              top: buttonPosition.top,
              left: buttonPosition.left,
              zIndex: 1000,
            }}
          />
        </Popover>
      )}
    </div>
  );
};

export default SelectionButton;
