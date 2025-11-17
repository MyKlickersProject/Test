

using Server.Models;

namespace Server.Repositories
{
    public static class AdsSearchExtensions
    {
        public static double DistanceInKm(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371.0;
            double dLat = Math.PI * (lat2 - lat1) / 180.0;
            double dLon = Math.PI * (lon2 - lon1) / 180.0;

            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(Math.PI * lat1 / 180.0) *
                Math.Cos(Math.PI * lat2 / 180.0) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        }
    }
}
