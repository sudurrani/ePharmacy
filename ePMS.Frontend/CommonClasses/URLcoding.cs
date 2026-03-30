using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Text;

namespace BHAERP.CommonClasses
{
    public class URLcoding
    {
        public static string Encode(string SimpleValue)
        {
            string EncryptionKey = "V3TJHQBNT20212";
            byte[] clearBytes = System.Text.Encoding.Unicode.GetBytes(SimpleValue);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    SimpleValue = Convert.ToBase64String(ms.ToArray());
                }
            }
            return SimpleValue;
        }
        public static string Decode(string CipherValue)
        {
            try
            {
                string EncryptionKey = "V3TJHQBNT20212";
                CipherValue = CipherValue.Replace(" ", "+");
                byte[] cipherBytes = Convert.FromBase64String(CipherValue);
                using (Aes encryptor = Aes.Create())
                {
                    Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                    encryptor.Key = pdb.GetBytes(32);
                    encryptor.IV = pdb.GetBytes(16);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(cipherBytes, 0, cipherBytes.Length);
                            cs.Close();
                        }
                        CipherValue = Encoding.Unicode.GetString(ms.ToArray());
                    }
                }
                return CipherValue;
            }
            catch (Exception)
            {
                return "";
            }
        }

    }


}