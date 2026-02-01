using Xunit;
using VaultMessenger.Core.Services;

namespace VaultMessenger.Tests;

public class CryptographyServiceTests
{
    [Fact]
    public void GenerateRandomBytes_ReturnsCorrectLength()
    {
        var service = new CryptographyService();
        var bytes = service.GenerateRandomBytes(32);
        Assert.Equal(32, bytes.Length);
    }
}
