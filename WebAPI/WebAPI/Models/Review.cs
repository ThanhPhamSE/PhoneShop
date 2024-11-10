namespace WebAPI.Models
{
    public class Review
    {
        public Guid ReviewId { get; set; }
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime ReviewDate { get; set; }

        public User User { get; set; }
        public Product Product { get; set; }
    }
}
