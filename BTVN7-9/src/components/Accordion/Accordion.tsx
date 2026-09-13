import { ReactNode, useState } from "react";
import {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
} from "./AccordionContext";

interface AccordionProps {
  children: ReactNode;
  /** id của panel mở sẵn khi mới render, mặc định không panel nào mở */
  defaultOpenId?: string | null;
}

// Root: quản lý state "panel nào đang mở" và cấp phát qua Context.
// Chỉ cho phép 1 panel mở tại một thời điểm: mở panel mới sẽ tự đóng panel cũ.
function Accordion({ children, defaultOpenId = null }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  children: ReactNode;
}

// Item: bọc mỗi cặp Header/Panel, cấp id của chính nó qua Context riêng
// để Header/Panel bên trong không cần nhận id qua props.
function AccordionItem({ id, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div className="accordion-item">{children}</div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionHeaderProps {
  children: ReactNode;
}

// Header: đọc id từ ItemContext, đọc/toggle trạng thái mở từ AccordionContext.
function AccordionHeader({ children }: AccordionHeaderProps) {
  const { id } = useAccordionItemContext();
  const { openId, toggle } = useAccordionContext();
  const isOpen = openId === id;

  return (
    <button
      type="button"
      className={`accordion-header${isOpen ? " is-open" : ""}`}
      aria-expanded={isOpen}
      onClick={() => toggle(id)}
    >
      <span>{children}</span>
      <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
    </button>
  );
}

interface AccordionPanelProps {
  children: ReactNode;
}

// Panel: chỉ render nội dung khi panel của chính item này đang mở.
function AccordionPanel({ children }: AccordionPanelProps) {
  const { id } = useAccordionItemContext();
  const { openId } = useAccordionContext();
  const isOpen = openId === id;

  if (!isOpen) return null;

  return <div className="accordion-panel">{children}</div>;
}

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;

export { Accordion };
