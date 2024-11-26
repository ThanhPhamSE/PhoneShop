namespace WebAPI.ViewModel.ProductDetail
{
    public class AddReviewRequest
    {
        public Guid UserId { get; set; }  // Id của người dùng
        public int Rating { get; set; }    // Đánh giá từ 1 đến 5
        public string Comment { get; set; }  // Bình luận của người dùng
    }

}
