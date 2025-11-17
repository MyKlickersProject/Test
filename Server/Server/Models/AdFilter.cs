namespace Server.Models
{
    public enum DistanceFilterKm
    {
        None = 0,
        Five = 5,
        Ten = 10,
        Twenty = 20
    }

    public class AdFilter
    {
        public string? TitleContains { get; set; }

        public string? DescriptionContains { get; set; }

        public string? ContactName { get; set; }

        public string? Category { get; set; }

        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        public DateTime? CreatedFrom { get; set; }

        public DateTime? CreatedTo { get; set; }

        public double? CenterLatitude { get; set; }
        public double? CenterLongitude { get; set; }
        public DistanceFilterKm Distance { get; set; } = DistanceFilterKm.None;
    }
}