using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ePMS.Frontend.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            /*
            Session["CurrencyID"] = 3.ToString();
            Session["CompanyID"] = 40155.ToString();
            Session["UserID"] = 40122.ToString();

            Session["ProjectID"] = 40122.ToString();

            Session["UserName"] = "Shahid Ullah".ToString();

            Session["Uname"] = "Shahid Ullah".ToString();

            Session["UserID"] = 40122.ToString();

            Session["UserID"] = 40122.ToString();
            */
            return View();
        }
        public ActionResult Dashboard()
        {
            /*
            Session["CurrencyID"] = 3.ToString();
            Session["CompanyID"] = 40155.ToString();
            Session["UserID"] = 40122.ToString();

            Session["ProjectID"] = 40122.ToString();

            Session["UserName"] = "Shahid Ullah".ToString();

            Session["Uname"] = "Shahid Ullah".ToString();

            Session["UserID"] = 40122.ToString();

            Session["UserID"] = 40122.ToString();
            */
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}