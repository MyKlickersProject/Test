
using System.Text.Json;
using Server.Models;

namespace Server.Repositories
{
    public class AdsRepository
    {
        private readonly string _filePath;
        private List<Ad> _cache = new List<Ad>();
        private readonly int current_user = 1234;

        public AdsRepository(IWebHostEnvironment env)
        {
            _filePath = Path.Combine(env.ContentRootPath, "Data", "ads.json");

            if (!File.Exists(_filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
                File.WriteAllText(_filePath, "[]");
            }

            _cache = LoadFile();
        }

        private List<Ad> LoadFile()
        {
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<Ad>>(json) ?? new List<Ad>();
        }

        private void SaveFile()
        {
            var json = JsonSerializer.Serialize(_cache, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }

        public List<Ad> GetAll() =>
            _cache.Where(a => a.State).ToList();

        public Ad? GetById(int id) =>
            _cache.FirstOrDefault(a => a.Id == id && a.State);

        public Ad Add(Ad ad)
        {
            ad.Id = _cache.Any() ? _cache.Max(a => a.Id) + 1 : 1;
            ad.State = true;
            ad.InsertDate = DateTime.UtcNow;
            ad.InsertUser = current_user;

            _cache.Add(ad);
            SaveFile();
            return ad;
        }

        public bool Update(int id, Ad updated)
        {
            var index = _cache.FindIndex(a => a.Id == id);
            if (index == -1) return false;

            updated.Id = id;
            updated.UpdateDate = DateTime.UtcNow;
            updated.UpdateUser = current_user;

            _cache[index] = updated;
            SaveFile();
            return true;
        }

        public bool Delete(int id)
        {
            var ad = _cache.FirstOrDefault(a => a.Id == id);
            if (ad == null) return false;

            ad.State = false;
            ad.UpdateUser = current_user;
            ad.UpdateDate = DateTime.UtcNow;

            SaveFile();
            return true;
        }

        public List<Ad> Search(AdFilter filter)
        {
            IEnumerable<Ad> ads = _cache.Where(a => a.State);

            if (!string.IsNullOrWhiteSpace(filter.TitleContains))
                ads = ads.Where(a => a.Title.Contains(filter.TitleContains, StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrWhiteSpace(filter.DescriptionContains))
                ads = ads.Where(a => a.Description.Contains(filter.DescriptionContains, StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrWhiteSpace(filter.Category))
                ads = ads.Where(a => a.Category.Equals(filter.Category, StringComparison.OrdinalIgnoreCase));

            if (filter.MinPrice.HasValue)
                ads = ads.Where(a => a.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                ads = ads.Where(a => a.Price <= filter.MaxPrice.Value);

            if (filter.CreatedFrom.HasValue)
                ads = ads.Where(a => a.CreatedAt >= filter.CreatedFrom.Value);

            if (filter.CreatedTo.HasValue)
                ads = ads.Where(a => a.CreatedAt <= filter.CreatedTo.Value);

            if (filter.CenterLatitude.HasValue &&
                filter.CenterLongitude.HasValue &&
                filter.Distance != DistanceFilterKm.None)
            {
                ads = ads.Where(a =>
                    AdsSearchExtensions.DistanceInKm(
                        filter.CenterLatitude.Value,
                        filter.CenterLongitude.Value,
                        a.Latitude,
                        a.Longitude
                    ) <= (double)filter.Distance);
            }

            return ads.ToList();
        }
    }
}
