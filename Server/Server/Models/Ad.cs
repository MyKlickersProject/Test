

using System.Text.Json.Serialization;

namespace Server.Models
{
    public class Ad
    {
        public int Id { get; set; }

        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Category { get; set; } = "";

        public decimal Price { get; set; }

        public string ContactName { get; set; } = "";
        public string ContactPhone { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? ImagePath { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public bool State { get; set; } = true;

        public int? InsertUser { get; set; }
        public int? UpdateUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public DateTime? UpdateDate { get; set; }

        [JsonIgnore]
        public IFormFile? Image { get; set; }
    }
}
