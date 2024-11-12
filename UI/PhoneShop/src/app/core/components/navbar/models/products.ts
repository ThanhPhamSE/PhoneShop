export interface Product {
    productId: string;  // GUID kiểu string (thay vì GUID kiểu Guid trong C#)
    productName: string;
    title: string;
    description: string;
    color: string;
    costPrice: number;  // Giá gốc (type decimal tương ứng với number trong Angular)
    sellPrice: number;  // Giá bán (type decimal tương ứng với number trong Angular)
    stock: number;  // Số lượng còn lại
    imageUrl: string;  // Đường dẫn tới ảnh sản phẩm
    brandId: string;  // ID của thương hiệu (kiểu GUID, sẽ dùng kiểu string trong Angular)
    brandName: string;  // Tên thương hiệu

    // Mức giá sản phẩm (tính toán dựa trên giá bán)
    priceRange?: string;  // Có thể có giá trị là "Cao", "Trung bình", hoặc "Rẻ"
}
