export interface Review {
    reviewId: string;
    userId: string;
    userName: string; // Thông tin người dùng (ví dụ: tên người dùng)
    productId: string;
    productName: string;// Thông tin sản phẩm (ví dụ: tên sản phẩm)
    rating: number;
    comment: string;
    reviewDate: string;
}
