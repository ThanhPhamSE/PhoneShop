using WebAPI.Models;

namespace WebAPI.ViewModel.ProductDetail
{
    public class ReviewViewModel
    {
        public Guid ReviewId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }  // Thông tin người dùng (ví dụ: tên người dùng)
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }  // Thông tin sản phẩm (ví dụ: tên sản phẩm)
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime ReviewDate { get; set; }
    }

}
