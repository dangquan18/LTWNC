import { Accordion } from "./components/Accordion";
import { ProductPagination } from "./components/ProductPagination";
import { products } from "./data/products";
import "./style.css";

export default function App() {
  return (
    <main className="app">
      <h1>Bài tập về nhà — Buổi 7-9</h1>

      <section>
        <h2>1. Compound Component: Accordion</h2>
        <Accordion defaultOpenId="faq-1">
          <Accordion.Item id="faq-1">
            <Accordion.Header>Accordion là gì?</Accordion.Header>
            <Accordion.Panel>
              Accordion là một danh sách các panel có thể mở/đóng, dùng
              Compound Component Pattern kết hợp Context API để chia sẻ state
              giữa Header và Panel mà không cần truyền props qua nhiều tầng.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="faq-2">
            <Accordion.Header>Chỉ mở 1 panel tại một thời điểm?</Accordion.Header>
            <Accordion.Panel>
              Đúng vậy. Khi mở một panel mới, panel đang mở trước đó sẽ tự
              động đóng lại vì state openId chỉ lưu một id duy nhất.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="faq-3">
            <Accordion.Header>usePagination dùng để làm gì?</Accordion.Header>
            <Accordion.Panel>
              usePagination&lt;T&gt; là custom hook generic, nhận vào mảng dữ
              liệu bất kỳ và số item/trang, trả về trang hiện tại, tổng số
              trang và các hàm điều hướng next/prev/goToPage.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </section>

      <section>
        <h2>2. Custom hook: usePagination&lt;Product&gt;</h2>
        <ProductPagination products={products} itemsPerPage={5} />
      </section>
    </main>
  );
}
