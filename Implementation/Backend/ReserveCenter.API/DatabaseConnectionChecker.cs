using Microsoft.Data.SqlClient;

namespace ReserveCenter.API;

public static class DatabaseConnectionChecker
{
    public static bool TestConnection(string? connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return false;
        }

        try
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();
            return connection.State == System.Data.ConnectionState.Open;
        }
        catch
        {
            return false;
        }
    }

    public static void PrintConnectionStatus(string? connectionString)
    {
        var isConnected = TestConnection(connectionString);
        Console.Clear();
        Console.WriteLine("===============================================================");
        Console.WriteLine(isConnected.ToString().ToLowerInvariant());
        Console.WriteLine("===============================================================");

    }
}
