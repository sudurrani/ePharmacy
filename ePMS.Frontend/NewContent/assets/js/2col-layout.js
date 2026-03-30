// toogling sidnav of bha

const sidebarSwitch = document.getElementById("sidebarSwitch");
const sidebar = document.getElementById("p-sidenav");
const layout = document.getElementById("p-layout");

sidebarSwitch.addEventListener("change", () => {
  if (sidebarSwitch.checked) {
    // Show sidebar
    sidebar.classList.remove("hidden");
    layout.classList.remove("full");
  } else {
    // Hide sidebar
    sidebar.classList.add("hidden");
    layout.classList.add("full");
  }
});
function loadDoc(url, tab) {
    currentTab = tab;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(html => {
            document.getElementById("demo").innerHTML = html;

            if (tab === 'GeneralInfo') {
                if (!isGeneralInfoInitialized) {
                    if ($('#txtCompanyID').val() == 0) { $('#btnSaveGlobal').text('Save'); } else { $('#btnSaveGlobal').text('Updaet'); }
                    var input = document.querySelector("#txtPhone");
                    var hiddenInput = document.querySelector("#fullPhoneNumber");
                    var iti = window.intlTelInput(input, {
                        separateDialCode: true,  // Shows country code separately
                        initialCountry: "auto",  // Auto-detect based on user's location
                        geoIpLookup: function (callback) {
                            fetch("https://ipapi.co/json")
                                .then(response => response.json())
                                .then(data => callback(data.country_code))
                                .catch(() => callback("US"));
                        },
                        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
                    });
                    GetAllType(); checkvaliditydate();
                    Type();
                    GetAllModule();
                    GetAllCompanyType();
                    GetAllCompanyStatus();
                    GetAllWorkingDays();
                    GetAllCurrency();
                    GetAllAccountHead();
                    GetAllRegion();
                    GetSubRegionByRegion();
                    GetCountryBySubRegion();
                    GetRegCityByCountry();
                    $("#ddlRegCountryID").select2({ width: '368px' });
                    $("#ddlTypeID").select2();
                    $("#ddlCompModuleID").select2();
                    $("#ddlRegRegionID").select2({ width: '368px' });
                    $("#ddlSubRegionID").select2({ width: '368px' });
                    $("#ddlCompanyTypeID").select2();
                    $("#ddlCompStatusID").select2();
                    $("#ddlRegCityID").select2({ width: '368px' });
                        //hide fields
                    $("#intrntlRegion").hide();
                    $("#subregion").hide();
                    $("#contry").hide();
                    $("#city").hide();
                    $("#HeadofficePhone").hide();
                    $("#HeadOfficeAddress").hide();
                    $("#localregion").hide();
                    $("#localcity").hide();
                    $("#MailingRegion").hide();
                    $("#Mailingsubregion").hide();
                    $("#MailingCountry").hide();
                    $("#MailingCity").hide();
                    $("#Mailinglocalregion").hide();
                    $("#Mailinglocalcity").hide();
                    $("#ddlWorkingDaysID").select2({ width: '265px' });
                    $("#ddlCurrencyID").select2({ width: '265px' });
                    $("#ddlAccountHeadID").select2({ width: '265px' });
                }
            }
            if (tab === 'Branch') {
                $('#btnSaveGlobal').text('Update');
                GetAllUsers(0);
                GetAllRegion();
                GetAllCountries();
                GetSubRegionByBranchRegion();
                GetCityByCountryBranch();
                GetAllBranchAccountHead();
                $("#txtBranchCntctPrsn").select2({ width: '270px !important' });
                $("#ddlBranchRegionID").select2({ width: '270px !important' });
                $("#ddlBranchCityID").select2({ width: '270px !important' });
                $("#ddlBranchSubRgionID").select2({ width: '270px !important' });
                $("#ddlBranchCountryID").select2({ width: '270px !important' });

                $('#ddlBranchRegionID').change(function () {

                    var CountryID = $(this).val();
                    if (Number(CountryID) > 0) {
                        GetRefNoAll(PaymentTypeID);
                        GetSubRegionByBranchRegion();

                    }

                });
                $('#ddlBranchSubRgionID').change(function () {
                    var RegionID = $(this).val();
                    if (Number(RegionID) > 0) {
                        GetRefNoAll(PaymentTypeID);
                        GetBranchCountryByRegion();

                    }

                });


                $('#ddlBranchCountryID').change(function () {
                    var CountryID = $(this).val();
                    if (Number(CountryID) > 0) {
                        GetRefNoAll(PaymentTypeID);
                        GetCityByCountryBranch();

                    }

                });
            }
            if (tab === 'GroupStructure') {
                $('#btnSaveGlobal').text('Update');
                HideShowFieldHead();
                HideShowField();
                GetGroupCityByCountry();
                GetAllCompanies();
                GetAllRegion();
                GetAllCountries();
                GetSubRegionByRegion();
                GetGroupCountryBySubRegion();
                GetGroupCityByCountry();
                $("#ddlGroupSubRegionID").select2();
                $("#ddlBranchRegionID").select2();
                $("#ddlParentCompanyCountryID").select2();
                $("#ddlParentCompanyID").select2();
                $("#ddlHeadQuarterID").select2();
                $("#ddlGroupCountryID").select2();
                $("#ddlGroupCityID").select2();
            }
            if (tab === 'TaxCustom') {
                $('#btnSaveGlobal').text('Update');
                $(document).ready(function () {
                    debugger
                    $("#chkVATReg").change(function () {
                        debugger
                        if ($("#chkVATReg").prop("checked")) {
                            $("#txtVATRegNo").attr('required', true);
                            $("#txtVATRegNo").attr('disabled', false);
                            $("#txtVATRegNo").val('');

                        }

                        else {
                            $("#txtVATRegNo").attr('required', false);
                            $("#txtVATRegNo").attr('disabled', true);

                            $("#txtVATRegNo").val('');
                        }


                    });
                    $("#chkITaxReg").change(function () {
                        if ($("#chkITaxReg").prop("checked")) {
                            $("#txtITaxRegNo").attr('required', true);
                            $("#txtITaxRegNo").attr('disabled', false);
                            $("#txtITaxRegNo").val('');
                        }

                        else {
                            $("#txtITaxRegNo").attr('required', false);
                            $("#txtITaxRegNo").attr('disabled', true);
                            $("#txtITaxRegNo").val('');

                        }


                    });
                    $("#chkCustomReg").change(function () {
                        if ($("#chkCustomReg").prop("checked")) {
                            $("#txtCustomRegNo").attr('required', true);
                            $("#txtCustomRegNo").attr('disabled', false);
                            $("#txtCustomRegNo").val('');
                        }

                        else {
                            $("#txtCustomRegNo").attr('required', false);
                            $("#txtCustomRegNo").attr('disabled', true);
                            $("#txtCustomRegNo").val('');

                        }


                    });

                })
            }
            if (tab === 'CostCenter') {
                $('#btnSaveGlobal').text('Update');
            } if (tab === 'Organizational') {
            }

        })
        .catch(error => {
            console.error("Error loading partial view:", error);
            document.getElementById("demo").innerHTML = "<p>Error loading view.</p>";
        });

}
// Apply correct layout on load based on switch state


// ajax call of sidenav

//function loadDoc(url) {debugger
//    fetch(url)
//        .then(response => {
//            if (!response.ok) {
//                throw new Error("Network response was not ok");
//            }
//            return response.text();
//        })
//        .then(html => {
//            document.getElementById("demo").innerHTML = html;
//        })
//        .catch(error => {
//            console.error("Error loading partial view:", error);
//            document.getElementById("demo").innerHTML = "<p>Error loading view.</p>";
//        });
//}

//function loadDoc(strURL) {
//  const demo = document.getElementById("demo");
//  demo.innerHTML = "";
//  var xhttp = new XMLHttpRequest();
//  xhttp.onreadystatechange = function () {
//    if (this.readyState == 4 && this.status == 200) {
//      demo.innerHTML = this.responseText;

//      // const scripts = demo.querySelectorAll("script");
//      // scripts.forEach((script) => {
//      //   const newScript = document.createElement("script");
//      //   newScript.textContent = script.textContent;
//      //   document.head.appendChild(newScript);
//      // });
//    }
//    const scripts = demo.querySelectorAll("script");
//    scripts.forEach((script) => {
//      const newScript = document.createElement("script");
//      if (script.src) {
//        newScript.src = script.src;
//      } else {
//        newScript.textContent = script.textContent;
//      }
//      document.head.appendChild(newScript);
//    });
//    // Load CSS <link> elements
//    const links = demo.querySelectorAll('link[rel="stylesheet"]');
//    links.forEach((link) => {
//      const newLink = document.createElement("link");
//      newLink.rel = "stylesheet";
//      newLink.href = link.href;
//      document.head.appendChild(newLink);
//    });
//  };
//  xhttp.open("GET", strURL, true);
//  xhttp.send();
//}
// active state of sidenav
document.querySelectorAll(".active-sidnavmenu").forEach((item) => {
  item.addEventListener("click", function () {
    // Remove active from all
    document
      .querySelectorAll(".active-sidnavmenu")
      .forEach((el) => el.classList.remove("active"));

    // Add active to clicked one
    this.classList.add("active");
  });
});




function bha_selector() {
  document.querySelectorAll(".bha-selector").forEach((select) => {
    const box = select.querySelector(".bha-sel-box");
    const optionsContainer = select.querySelector(".bha-sel-options");
    const searchBox = select.querySelector(".bha-sel-search");
    const optionsList = select.querySelectorAll(".bha-sel-option");
    const icon = box.querySelector("i");
    if (box)
      box.addEventListener("click", () => {
        optionsContainer.classList.toggle("active");
        icon.classList.toggle("bi-chevron-down");
        icon.classList.toggle("bi-chevron-up");
      });

    optionsList.forEach((option) => {
      if (option)
        option.addEventListener("click", () => {
          box.childNodes[0].nodeValue = option.textContent + " ";
          optionsContainer.classList.remove("active");
          if (searchBox) searchBox.value = "";
          optionsList.forEach((opt) => (opt.style.display = "block"));
          icon.classList.add("bi-chevron-down");
          icon.classList.remove("bi-chevron-up");
        });
    });

    if (searchBox)
      searchBox.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        optionsList.forEach((option) => {
          if (option.textContent.toLowerCase().includes(value)) {
            option.style.display = "block";
          } else {
            option.style.display = "none";
          }
        });
      });

    document.addEventListener("click", (e) => {
      if (!select.contains(e.target)) {
        optionsContainer.classList.remove("active");
        icon.classList.add("bi-chevron-down");
        icon.classList.remove("bi-chevron-up");
      }
    });
  });
}
