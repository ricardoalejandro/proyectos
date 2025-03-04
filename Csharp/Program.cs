using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;

public class EncryptionHelper
{
    public static string GenerateAesKey()
    {
        using (Aes aesAlgorithm = Aes.Create())
        {
            aesAlgorithm.Mode = CipherMode.ECB;
            aesAlgorithm.Padding = PaddingMode.PKCS7;
            aesAlgorithm.KeySize = 256;
            aesAlgorithm.GenerateKey();
            return Convert.ToBase64String(aesAlgorithm.Key);
        }
    }

    public static string EncryptWithRsa(string data, string publicKey)
    {
        byte[] publicKeyBytes = Convert.FromBase64String(publicKey);
        using (var rsa = RSA.Create())
        {
            rsa.ImportSubjectPublicKeyInfo(publicKeyBytes, out _);
            byte[] encryptedData = rsa.Encrypt(Encoding.UTF8.GetBytes(data), RSAEncryptionPadding.Pkcs1);
            return Convert.ToBase64String(encryptedData);
        }
    }

    public static string EncryptWithAes(string data, string aesKey)
    {
        using (var aesAlgorithm = Aes.Create())
        {
            aesAlgorithm.Key = Convert.FromBase64String(aesKey);
            aesAlgorithm.Mode = CipherMode.ECB;
            aesAlgorithm.Padding = PaddingMode.PKCS7;
            var encryptor = aesAlgorithm.CreateEncryptor();
            using (var ms = new MemoryStream())
            {
                using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                {
                    using (var sw = new StreamWriter(cs))
                    {
                        sw.Write(data);
                    }
                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }
    }
}

public class TokenRequest
{
    public string requestId { get; set; }
    public string payload { get; set; }
}

public class AuthenticationPayload
{
    public string username { get; set; }
    public string password { get; set; }
    public string encryptKey { get; set; }
    public string refreshToken { get; set; }
}

public class InvoicePayload
{
    public string RequestId { get; set; }
    public string RequestDateTime { get; set; }
    public string EncryptedInvoice { get; set; }
}

class Program
{
    static void Main()
    {
        StringBuilder output = new StringBuilder();

        string aesKey = EncryptionHelper.GenerateAesKey();
        output.AppendLine("Generated AES Key: " + aesKey);

        // Clave pública proporcionada
        string publicKey = 
            "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmq7EwCHjHpOdivEgmx9o" +
            "w/OH5iF40h6IV2VPxkoFXxAZ8JNlr2V3iX5ETEllOL3QyZbEw4tJbg4OaAKwlq2Z" +
            "XYlaX6XoFw4/nWjVc4+Hd0D/x4CNNkP/u8ikSFeNqK1F28lQ16qrpC1vybxqc8Bw" +
            "+A+Cm51f94YzMXjIkKO2G9PE/pMrSnD3WVisrvOTF8GgP3QbZKZGl7p2DEWKnsC3" +
            "SQWxSu0HCP5kPtY8QkvheCDEqho/tEHLfVdzIFyhM4fYgEw318Xox6xeSefXrUpX" +
            "kWQZCGrdjT0OZ9O5ok6YFatc99x/LI3OOAl2yQnpjNSM2Q/yMIgdljWWhtjWqkqE" +
            "K1B65SHKw0XM/vp67Vb4y7K4dTWfHyBr3fg5C60OB3sSP5Pq6UrtrIewugA9V5G4" +
            "UMCg/a3ITSIF0F7jla0AuF6Tx844qh0SAHm0m583QDVezbJ2k7dYbJcyxffecot0" +
            "SnFaEolC1DycVkC8TuXr8fRqbKGHN85PR33bqWu5vou/OkYqp+XC6GH6+l2z0yg2" +
            "bkMGr7IjfuYf+2EeSsBaHhs0lgdNHQQUiqFOArtlVpo4Wkq4rQilHDj+U+uT5Cjr" +
            "ABW89gpKmFkvJklpLBCjoumDsBZFdaKsCPLE2y+QoHWsXdbM6kHMILqdsXzse9+x" +
            "YuCV3Yvw1wtw8jam5lCVztMCAwEAAQ==";

        output.AppendLine("Public Key: " + publicKey);

        AuthenticationPayload authPayload = new AuthenticationPayload
        {
            username = "J0421904",
            password = "Sonatushar1978$",
            encryptKey = aesKey,
            refreshToken = "false"
        };

        string jsonAuthPayload = JsonConvert.SerializeObject(authPayload, Formatting.Indented);
        output.AppendLine("JSON Authentication Payload: " + jsonAuthPayload);

        string encryptedAuthPayload = EncryptionHelper.EncryptWithRsa(jsonAuthPayload, publicKey);
        output.AppendLine("Encrypted Authentication Payload: " + encryptedAuthPayload);

        string requestId = DateTime.Now.ToString("yyyyMMddHHmmss");

        TokenRequest tokenRequest = new TokenRequest
        {
            requestId = requestId,
            payload = encryptedAuthPayload
        };

        string jsonTokenRequest = JsonConvert.SerializeObject(tokenRequest, Formatting.Indented);
        output.AppendLine("Final JSON Token Request: " + jsonTokenRequest);

        // Guardar el resultado en un archivo de texto
        string fileName = $"TokenRequest_{requestId}.txt";
        string filePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), fileName);
        File.WriteAllText(filePath, output.ToString());

        // Mover el archivo a la carpeta de descargas
        string downloadsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads", fileName);
        File.Move(filePath, downloadsPath, true);

        Console.WriteLine($"OK - {fileName}");
    }
}
