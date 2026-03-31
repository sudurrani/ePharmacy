using System;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class ColumnWidthAttribute : Attribute
    {
        public string Width { get; }

        public ColumnWidthAttribute(string width)
        {
            Width = width;
        }
    }

}