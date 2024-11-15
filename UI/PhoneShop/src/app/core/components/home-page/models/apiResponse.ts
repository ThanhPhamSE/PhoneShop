import { Product } from "./products";

export interface ApiResponse {
    products: Product[];
    status: number;      // Mã trạng thái của API (ví dụ: 200, 404, ...)
    exception: any;      // Dữ liệu exception nếu có (nếu API trả về lỗi)
    isCanceled: boolean; // Trạng thái nếu request bị hủy
    totalCount: number;  // Tổng số lượng sản phẩm (dùng cho phân trang)
    totalPages: number;  // Tổng số trang (mới thêm vào)

}