// MODULE: QUẢN LÝ ĐƠN HÀNG
// Thực thể: Customer, Product, OrderItem, Order




//ENUM 
// Trạng thái vòng đời của một đơn hàng 
enum OrderStatus {
  PENDING = "PENDING", // vừa tạo, chưa xác nhận
  CONFIRMED = "CONFIRMED", // đã xác nhận, chờ giao
  SHIPPING = "SHIPPING", // đang giao
  DELIVERED = "DELIVERED", // đã giao thành công
  CANCELLED = "CANCELLED", // đã huỷ
}

// Phương thức thanh toán
enum PaymentMethod {
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  E_WALLET = "E_WALLET",
}

// Danh mục sản phẩm
enum ProductCategory {
  ELECTRONICS = "ELECTRONICS",
  FASHION = "FASHION",
  FOOD = "FOOD",
  HOME = "HOME",
  OTHER = "OTHER",
}

// INTERFACE CHÍNH 

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; 
  stock: number; 
  description?: string;
}

/**
 * OrderItem quan hệ N-1 với Product (nhiều OrderItem trỏ về 1 Product)
 * qua productId thay vì nhúng nguyên object Product, tránh trùng lặp dữ liệu.
 * priceAtOrder lưu lại giá tại thời điểm đặt hàng, để không bị ảnh hưởng
 * nếu sau này Product.price thay đổi (rất quan trọng cho lịch sử đơn hàng).
 */
interface OrderItem {
  id: string;
  productId: Product["id"]; // Indexed Access Type: luôn đồng bộ kiểu id với Product
  quantity: number;
  priceAtOrder: number;
}

/**
 * Order quan hệ N-1 với Customer (qua customerId) và 1-N với OrderItem
 * (qua mảng items). Đây là thực thể tổng hợp (aggregate root) của module.
 */
interface Order {
  id: string;
  customerId: Customer["id"];
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

//GENERIC DÙNG CHUNG

// Bọc chuẩn cho mọi response API, tái sử dụng cho mọi loại data T 
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Kết quả phân trang, dùng chung cho danh sách Order / Product / Customer 
interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Repository generic cho CRUD, ràng buộc T phải có field "id: string"
 * (generic constraint) để đảm bảo các hàm getById/update/delete hợp lệ.
 * Nhờ generic, không phải viết lại interface Repository cho từng thực thể.
 */
interface Repository<T extends { id: string }> {
  getById(id: string): T | undefined;
  getAll(): T[];
  create(data: Omit<T, "id">): T;
  update(id: string, data: Partial<Omit<T, "id">>): T | undefined;
  delete(id: string): boolean;
}

// ÁP DỤNG UTILITY TYPES 

// 1) Omit: DTO tạo Customer mới — id và createdAt do server sinh, client không gửi lên
type CreateCustomerDto = Omit<Customer, "id" | "createdAt">;

// 2) Partial + Omit: DTO cập nhật Product — cho sửa một vài field tuỳ ý, không bắt buộc đủ
type UpdateProductDto = Partial<Omit<Product, "id">>;

// 3) Pick: Thông tin rút gọn của Order để hiển thị danh sách, không cần load cả items
type OrderSummary = Pick<Order, "id" | "status" | "createdAt">;

// 4) Omit kết hợp Intersection: DTO tạo đơn hàng mới
//    - item con không cần id/priceAtOrder vì server sẽ tự tính giá tại thời điểm đặt
type CreateOrderItemDto = Omit<OrderItem, "id" | "priceAtOrder">;
type CreateOrderDto = Omit<
  Order,
  "id" | "items" | "status" | "createdAt" | "updatedAt"
> & {
  items: CreateOrderItemDto[];
};

// 5) Readonly: Hoá đơn (invoice) đã chốt, không cho sửa sau khi xuất
type OrderInvoice = Readonly<Order>;

// ---------------- VÍ DỤ SỬ DỤNG (minh hoạ generic hoạt động) ----------------

declare const orderRepository: Repository<Order>;
declare const productRepository: Repository<Product>;
declare const customerRepository: Repository<Customer>;

// Lấy danh sách đơn hàng dạng rút gọn, có phân trang, bọc trong ApiResponse chuẩn
declare function getOrders(
  page: number,
  pageSize: number
): Promise<ApiResponse<PaginatedResult<OrderSummary>>>;

export {
  OrderStatus,
  PaymentMethod,
  ProductCategory,
  Customer,
  Product,
  OrderItem,
  Order,
  ApiResponse,
  PaginatedResult,
  Repository,
  CreateCustomerDto,
  UpdateProductDto,
  OrderSummary,
  CreateOrderItemDto,
  CreateOrderDto,
  OrderInvoice,
};

/* GIẢI THÍCH LỰA CHỌN THIẾT KẾ
1. Quan hệ dữ liệu:
   - Customer 1—N Order: Order chỉ lưu customerId (không nhúng cả object
     Customer) để tránh trùng lặp dữ liệu và dễ đồng bộ khi Customer đổi thông tin.
   - Order 1—N OrderItem: items là mảng OrderItem[] nằm trực tiếp trong Order,
     vì OrderItem không có ý nghĩa tồn tại độc lập ngoài một đơn hàng cụ thể.
   - OrderItem N—1 Product: chỉ lưu productId + priceAtOrder (giá chốt tại
     thời điểm đặt), không lưu nguyên Product, để lịch sử đơn hàng không bị
     thay đổi khi giá sản phẩm cập nhật sau này.

2. Vì sao dùng generic:
   - ApiResponse<T>, PaginatedResult<T>, Repository<T> được viết một lần và
     tái sử dụng cho cả 4 thực thể, tránh lặp code (không có "any").
   - Repository<T extends { id: string }> dùng generic constraint để đảm bảo
     mọi entity truyền vào đều có id, nhờ đó các phương thức CRUD an toàn kiểu.

3. Vì sao dùng Utility Types (đã dùng 5, yêu cầu tối thiểu 2):
   - Omit: loại field do hệ thống tự sinh (id, createdAt, status...) khỏi các
     DTO tạo mới, tránh client tự gán các field nhạy cảm này.
   - Partial: cho phép DTO cập nhật chỉ gửi những field muốn sửa.
   - Pick: tạo bản rút gọn (OrderSummary) cho các màn hình danh sách, tránh
     kéo theo toàn bộ items nặng nề không cần thiết.
   - Readonly: khoá cứng OrderInvoice sau khi chốt, ngăn sửa đổi ngoài ý muốn.

   => Tất cả DTO đều được "dẫn xuất" từ 4 interface gốc thay vì viết tay lại,
      giúp khi sửa interface gốc thì các DTO tự động cập nhật theo, giảm rủi ro
      lệch dữ liệu giữa các phần của hệ thống.
*/