using VaultMessenger.Core.Services;

namespace VaultMessenger.Services;

public class FileService : IFileService
{
    public Task<byte[]> ReadFileAsync(string filePath) => File.ReadAllBytesAsync(filePath);
    public Task<bool> WriteFileAsync(string filePath, byte[] data)
    {
        File.WriteAllBytes(filePath, data);
        return Task.FromResult(true);
    }
    
    public Task<bool> DeleteFileAsync(string filePath)
    {
        if (File.Exists(filePath)) File.Delete(filePath);
        return Task.FromResult(true);
    }
    
    public Task<string> SaveEncryptedFileAsync(byte[] data, string fileName)
    {
        var path = Path.Combine(GetAppDataPath(), "files", fileName);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        File.WriteAllBytes(path, data);
        return Task.FromResult(path);
    }
    
    public Task<byte[]> LoadEncryptedFileAsync(string filePath) => File.ReadAllBytesAsync(filePath);
    
    public string GetAppDataPath() => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "VaultMessenger");
}
