import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type InputSearchProps = {
  onChange: (text: string) => void;
  placeholder?: string;
  className?: string;
};

export default function InputSearch({
  onChange,
  placeholder,
  className,
}: InputSearchProps) {
  const [text, setText] = useState("");
  const [value] = useDebounce(text, 500);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <Input
      size="large"
      allowClear
      placeholder={placeholder}
      onChange={(e) => setText(e.target.value)}
      prefix={<SearchOutlined />}
      className={`w-full ${className}`}
    />
  );
}
