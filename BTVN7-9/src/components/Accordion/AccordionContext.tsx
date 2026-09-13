import { createContext, useContext } from "react";

// Context của toàn bộ Accordion: chỉ lưu id panel đang mở (single-open)
// và hàm toggle để Header con tự đóng/mở mà không cần truyền props qua nhiều tầng.
interface AccordionContextValue {
  openId: string | null;
  toggle: (id: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(
      "Accordion.Header/Accordion.Panel phải được đặt bên trong <Accordion>"
    );
  }
  return ctx;
}

// Context riêng của từng Item: chỉ lưu id của item đó, để Header/Panel con
// biết mình đang thuộc panel nào mà không cần nhận props "id" thủ công.
interface AccordionItemContextValue {
  id: string;
}

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null
);

export function useAccordionItemContext(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(
      "Accordion.Header/Accordion.Panel phải được đặt bên trong <Accordion.Item>"
    );
  }
  return ctx;
}
