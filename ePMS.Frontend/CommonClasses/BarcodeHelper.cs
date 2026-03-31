using System.Drawing;
using ZXing;


namespace ePMS.Frontend.CommonClasses
{
    public class BarcodeHelper
    {
        public static Bitmap GenerateBarcode(string data, BarcodeFormat format, int height = 100, int width = 300, int margin = 10, bool isPureBarcode = false)
        {

            var writer = new BarcodeWriter
            {
                Format = format,
                Options = new ZXing.Common.EncodingOptions
                {
                    Height = height,
                    Width = width,
                    Margin = margin,
                    PureBarcode = isPureBarcode
                }

            };

            return writer.Write(data);
        }
    }
}