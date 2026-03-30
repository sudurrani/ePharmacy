
var inputHRDepartmentID = '', hrDepartmentSelectedValue = 0;

var inputCurrencyID = '', currencyIDSelectedValue = 0;
function loadCurrencyDropdownList(inputID, selectedValue = 0) {

    selectedValue = (selectedValue == 0 || selectedValue == null)
        ? parseInt(localStorage.getItem('DefaultCurrencyID'))
        : selectedValue;
    if (localStorage.getItem('RefCurrency') == null || localStorage.getItem('RefCurrency') == undefined) {
        ajaxRequest({
            url: '/CoreSuite/GetAllCurrency', type: 'POST', data: {}, callBack: function (responseJSON) {
                var currencies = [];
                $.each(JSON.parse(responseJSON), function (index, item) {
                    currencies.push({
                        Value: item.ID,
                        Text: item.CurrencySymbol
                    });
                })

                bindJQueryDropdownList(currencies, $('#' + inputID), 'Select Currency', selectedValue);
                localStorage.setItem('RefCurrency', JSON.stringify(currencies));
            }
        });
    }
    else {

        bindJQueryDropdownList(JSON.parse(localStorage.getItem('RefCurrency')), $('#' + inputID), 'Select Currency', selectedValue);
    }

}
function loadHRDepartmentDropdownList(inputID, selectedValue = 0, companyID) {
    inputHRDepartmentID = inputID;
    hrDepartmentSelectedValue = selectedValue;
    ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPCoreSuite.dbo.RefDepartment', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1 AND CompanyID =' + companyID + '' }, callBack: loadHRDepartmentDropdownListCallBack });
}
var loadHRDepartmentDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputHRDepartmentID), 'Select Department', hrDepartmentSelectedValue);
}
function loadHRCategoryDropdownList(inputID, selectedValue = 0) {
    ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPHRSuite.dbo.HRRefCategory', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1' }, callBack: loadHRCategoryDropdownListCallBack, elementId: inputID, id: selectedValue });
}
var loadHRCategoryDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + options.elementId), 'Select Category', options.id);
}
function loadHRSectionDropdownList(inputID, selectedValue = 0) {
    ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPHRSuite.dbo.HRRefSection', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1' }, callBack: loadHRSectionDropdownListCallBack, elementId: inputID, id: selectedValue });
}
var loadHRSectionDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + options.elementId), 'Select Section', options.id);
}
function loadHRFunctionDropdownList(inputID, selectedValue = 0) {
    ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: '[BHAERPCoreSuite].[dbo].[RefFunction]', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1' }, callBack: loadHRFunctionDropdownListCallBack, elementId: inputID, id: selectedValue });
}
var loadHRFunctionDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + options.elementId), 'Select Function', options.id);
}
var inputHREmployeeID = '', hrEmployeeSelectedValue = 0;

function loadHREmployeeDropdownList(inputID, selectedValue = 0, departmentID = 0, companyID) {
    inputHREmployeeID = inputID;
    hrEmployeeSelectedValue = selectedValue;
    var condition = 'WHERE EMP.ID = DPT.EmployeeID AND EMP.IsActive = 1 AND DPT.IsActive =1 AND EMP.CompanyID = ' + companyID + '';
    if (departmentID != 0) {
        condition = 'WHERE DPT.DepartmentID = ' + departmentID + ' AND EMP.ID = DPT.EmployeeID AND EMP.IsActive = 1 AND DPT.IsActive =1 AND EMP.CompanyID = ' + companyID + ''
    }
    else {
        condition = 'WHERE EMP.ID = DPT.EmployeeID AND EMP.IsActive = 1 AND DPT.IsActive =1 AND EMP.CompanyID = ' + companyID + ''
    }
    ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPCoreSuite.dbo.Employee EMP,  BHAERPHRSuite.dbo.HREmploymentRecord DPT', Columns: 'EMP.ID Value, CONCAT(EMP.FirstName, \' \', EMP.LastName) Text', Condition: condition }, callBack: loadHREmployeeDropdownListCallBack });
}
var loadHREmployeeDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputHREmployeeID), 'Select Person ', hrEmployeeSelectedValue);
}

var inputRentIvoiceStatausID = '', statusSelectedValue = 0;
function loadRentInvoiceStatusDropdownList(inputID, selectedValue = 0) {
    inputRentIvoiceStatausID = inputID;
    statusSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.RentInvoiceStatus]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.RentInvoiceStatus]', Condition: 'where IsDeleted =0' }, callBack: loadRentInvoiceStatusDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.RentInvoiceStatus]')), $('#' + inputRentIvoiceStatausID), 'Select Rent Invoice Status', statusSelectedValue);
    }
}
var loadRentInvoiceStatusDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputRentIvoiceStatausID), 'Select Rent Invoice Status', statusSelectedValue);
        localStorage.setItem('[Setup.RentInvoiceStatus]', JSON.stringify(responseJSON.resultJSON));
    }
}
function loadNationalityDropdownList(inputID, selectedValue = 0) {
    if (localStorage.getItem('[RefNationality]') == null) {
        ajaxRequest({
            url: '/CoreSuite/GetNationalityAll', type: 'POST', data: {}, callBack: function (responseJSON) {
                bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + inputID), 'Select Nationality', selectedValue);
                localStorage.setItem('[RefNationality]', responseJSON);
            }
        });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[RefNationality]')), $('#' + inputID), 'Select Nationality', selectedValue);
    }
}
function loadCountryDropdownlist(inputID, selectedValue = 0, stateSelectedValue = 0, unitSelectedValue = 0) {
    bindJQueryDropdownList([], $('#StateID'), 'Select State', 0);
    bindJQueryDropdownList([], $('#CityID'), 'Select City', 0);
    //if (localStorage.getItem('[RefCountry]') == null) {
    ajaxRequest({
        url: '/CoreSuite/GetCountryAll', type: 'POST', data: {}, callBack: function (responseJSON) {
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + inputID), 'Select Country', selectedValue);
        }
    });
    //}
    //else {
    //    bindJQueryDropdownList(JSON.parse(localStorage.getItem('[RefCountry]')), $('#' + inputID), 'Select Country', selectedValue);
    //}
    if (selectedValue > 0) {
        loadStateDropdownlist('StateID', selectedValue, stateSelectedValue, unitSelectedValue);
    }
}

function loadStateDropdownlist(inputID, countryID = 0, selectedValue = 0, unitSelectedValue = 0) {
    ajaxRequest({
        url: '/CoreSuite/GetProvinceByCountry', type: 'POST', data: { CountryID: countryID }, callBack: function (responseJSON) {
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + inputID), 'Select State', selectedValue);

        }
    });
    if (selectedValue > 0) {
        loadCityDropdownlist(selectedValue, unitSelectedValue);
    }
}
function loadCityDropdownlist(stateID = 0, selectedValue = 0, inputID = null) {
    ajaxRequest({
        url: '/CoreSuite/GetCityByProvince', type: 'POST', data: { ProvinceID: stateID }, callBack: function (responseJSON) {
            bindJQueryDropdownList(JSON.parse(responseJSON), (inputID == null ? $('#CityID') : $(`#${inputID}`)), 'Select City', selectedValue);
        }
    });
}
function loadCityByCountryDropdownList(inputId, countryId, selectedValue, defaultText = 'Select City') {

    if (!countryId) {
        bindJQueryDropdownList([], $('#' + inputId), defaultText);
        return;
    }
    /*
    var query = `BHAERPCoreSuite.dbo.RefCity City
        INNER JOIN BHAERPCoreSuite.dbo.RefProvince RP ON RP.ID = City.RefProvinceID
        INNER JOIN BHAERPCoreSuite.dbo.RefCountry RC ON RC.ID = RP.RefCountryID`;
    var condition = `WHERE City.IsActive = 1 AND RC.ID = ${countryId}`;

    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: query, Columns: "City.ID Value, City.Description Text", Condition: condition }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputId), defaultText, selectedValue);
        }
    });
    */
    ajaxRequest({
        url: '/CoreSuite/GetCityByCountry', type: 'POST', data: { CountryID: countryId }, callBack: function (responseJSON) {
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#CityID'), 'Select City', selectedValue);
        }
    });
}
function loadProductTypeDropdownList(inputId = null, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPInventorySuite.dbo.PrdRefProductType', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, (inputId == null ? 'ProductTypeID' : inputId), (defaultText == null ? 'Select Type' : defaultText), selectedValue);
        }
    });
}
function loadCoreVendorDropdownList(inputId = null, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPCoreSuite.dbo.RefVendor', Columns: 'ID Value, Name Text', Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'VendorID' : inputId)), (defaultText == null ? 'Select Vendor' : defaultText), selectedValue);
        }
    });
}
function getProductTypes() {
    ajaxRequest({
        url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPInventorySuite.dbo.PrdRefProductType', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1'
        }, callBack: getProductTypesCallBack
    });
}

function loadRunDepreciationDatesDropdownList(inputId, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/GetStrings', type: 'POST', data: {
            Table: 'BHAERPFinancialSuite.dbo.AccRefFinancialYear', Columns: 'TOP(1) FromDate Value, ToDate Text', Condition: 'WHERE IsClosed = 0 AND IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList([], (inputId == null ? $('#RunDate') : $('#' + inputId)), (defaultText == null ? 'Select Date' : defaultText), selectedValue);

            if (responseJSON.resultJSON.length <= 0) {
                warningToastr('Accounts financial year record not exist', 'warning');
                return;
            }
            if (responseJSON.resultJSON.length == 1) {
                if (responseJSON.resultJSON[0].Value == null) {
                    warningToastr('Accounts financial year record not exist', 'warning');
                    return;
                }
            }
            let datesArray = [];
            var data = responseJSON.resultJSON;
            let startDate = new Date(data[0].Value);
            let endDate = new Date(data[0].Text);


            let toDate = endDate > new Date() ? new Date() : endDate;

            let months = datesMonthDifference(startDate, toDate);
            let currentYear = startDate.getFullYear();
            let startMonth = startDate.getMonth() + 1;
            var lastDayOfEndDate = new Date(endDate.getFullYear(), (endDate.getMonth() + 1), 0).getDate();

            for (var month = startMonth; month <= months; month++) {
                var firstOfNextMonth = new Date(currentYear, month, 1);
                var lastDayOfCurrentMonth = new Date(firstOfNextMonth - 1);

                datesArray.push({
                    Value: getFormattedDateDDMMYYYY(lastDayOfCurrentMonth),
                    Text: getFormattedDateDDMMYYYY(lastDayOfCurrentMonth)
                });
            }
            bindJQueryDropdownList(datesArray, (inputId == null ? $('#RunDate') : $('#' + inputId)), (defaultText == null ? 'Select Date' : defaultText), selectedValue);
        }
    });
}

function loadCompanyBranchesDropdownList(inputId = null, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPCoreSuite.dbo.RefCompanyBranch', Columns: "ID Value, CONCAT(BranchCode, ' -',BranchName) Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'BranchID' : inputId)), (defaultText == null ? 'Select Center' : defaultText), selectedValue);
        }
    });
}
function loadCompanyCostCenterWithDepartmentDropdownList(inputId = null, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPCoreSuite.dbo.RefCompanyCostCenter', Columns: "ID Value, CONCAT(Code,' - ',(SELECT Description FROM BHAERPCoreSuite.dbo.RefDepartment WHERE ID = DepartmentID AND IsActive = 1)) Text", Condition: 'WHERE IsActive = 1 '
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'BranchID' : inputId)), (defaultText == null ? 'Select Center' : defaultText), selectedValue);
        }
    });
}

function loadCustomerDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPCoreSuite.dbo.RefCustomer', Columns: "ID Value, CONCAT(Number,' - ',Name) Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'CustomerID' : inputId)), (defaultText == null ? 'Select Customer' : defaultText), selectedValue);
        }
    });

}

function loadInstrumentTypeDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/AccountsManagement/Dropdowns/Get', type: 'POST', data: {
            Table: 'RefInstrumentType', Columns: "ID Value, Description Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'CustomerID' : inputId)), (defaultText == null ? 'Select Instrument Type' : defaultText), selectedValue);
        }

    }, null, false);
}

function loadControlAccountTypesDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/AccountsManagement/AccountHead/GetControlAccountAll', type: 'POST', data: {}, callBack: function (responseJSON) {
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + (inputId == null ? 'ControlAccountTypeID' : inputId)), (defaultText == null ? 'Select Control Account Type' : defaultText), selectedValue);
        }
    }, null, false);
}
function loadCustomerControlAccountsDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/RealEstate/Tenant/GetCustomerControlAccounts', type: 'POST', data: {}, callBack: function (responseJSON) {
            customerControlAccountsArray = responseJSON.resultJSON;
            let $dropdown = $('#' + (inputId || 'ControlAccountID'));
            let defaultOptionText = defaultText || 'Select Control Account';

            bindJQueryDropdownList(customerControlAccountsArray, $dropdown, defaultOptionText, selectedValue);
        }
    });
}
function loadCompanyDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/CoreSuite/GetCompanyAll', type: "POST", data: {}, callBack: function (responseJSON) {
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + (inputId == null ? 'CompanyID' : inputId)), (defaultText == null ? 'Select Company' : defaultText), selectedValue);
        }
    });
}

function loadCompanyUserDropdownList(inputId, selectedValue, companyID = 0, defaultText = null) {
    ajaxRequest({
        url: '/CoreSuite/GetUserAllByCompanyID', type: "POST", data: { CompanyID: companyID }, callBack: function (responseJSON) {
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + (inputId == null ? 'UserID' : inputId)), (defaultText == null ? 'Select User' : defaultText), selectedValue);
        }
    });
}
function loadCashHeadDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/AccountsManagement/VoucherSetting/GetAccSubClassifiForCompanyCashHead', type: "POST", data: {}, callBack: function (responseJSON) {

            bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + (inputId == null ? 'CashHeadID' : inputId)), (defaultText == null ? 'Select Cash Head' : defaultText), selectedValue);
        }
    });
}
function loadTeamTypeDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/AccountsManagement/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPCoreSuite.dbo.RefTeamType', Columns: "ID Value, Description Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'TeamTypeID' : inputId)), (defaultText == null ? 'Select Team Type' : defaultText), selectedValue);
        }
    });
}
function loadGroupTypeDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/AccountsManagement/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPCoreSuite.dbo.[RefGroupType]', Columns: "ID Value, Description Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'GroupTypeID' : inputId)), (defaultText == null ? 'Select Team Type' : defaultText), selectedValue);
        }
    });
}
let _loadTaxGroupDropdownListArray = [];
function loadTaxGroupDropdownList(inputId, selectedValue, defaultText = null) {
    var query = `BHAERPCoreSuite.dbo.RefTaxGroup Grp, BHAERPCoreSuite.dbo.TaxGroupDetail GrpDetail`;
    var condition = `WHERE Grp.ID = GrpDetail.TaxGroupID AND Grp.IsActive = 1 AND GrpDetail.IsActive = 1`;
    let columns =
        `
            ID Value,
            (
                SELECT
                    Description,
                    Rate,
                    AccountHeadID
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS Text
        `;
    ajaxRequest({
        url: '/AccountsManagement/Dropdowns/Get', type: 'POST', data: {
            //Table: 'BHAERPCoreSuite.dbo.TaxGroupDetail', Columns: "ID Value, Description Text", Condition: 'WHERE IsActive = 1'
            Table: 'BHAERPCoreSuite.dbo.TaxGroupDetail', Columns: columns, Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                let dropdownSourceArray = [];
                $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {                    
                    let stringToJSON = JSON.parse(rowItem.Text);                    
                    dropdownSourceArray.push(
                        {
                            Value: rowItem.Value,
                            Text: stringToJSON.Description
                        });
                    _loadTaxGroupDropdownListArray.push(
                        {
                            Value: rowItem.Value,
                            Text: stringToJSON.Description,
                            JSON: stringToJSON
                        });                    
                });                
                bindJQueryDropdownList(dropdownSourceArray, $('#' + (inputId == null ? 'TaxAccountID' : inputId)), (defaultText == null ? 'Select Account' : defaultText), selectedValue);
            }
            
        }
    });
}

function loadCostCenterDropdownList(inputId, selectedValue, defaultText = null) {
    _costCenters = [];
    ajaxRequest({
        url: '/CoreSuite/GetCostCenterCode', type: 'POST', data: {}, callBack: function (responseJSON) {

            $.each(JSON.parse(responseJSON), function (index, item) {
                _costCenters.push({ Value: item.ID, Text: item.CostCenterCode })
            });
            bindJQueryDropdownList(_costCenters, $('#' + (inputId == null ? 'CostCenterID' : inputId)), (defaultText == null ? 'Select Cost Center' : defaultText), selectedValue);
        }
    });
}
function loadAccountTypeDropdownList(inputId, selectedValue, defaultText = null) {
    ajaxRequest({
        url: '/AccountsManagement/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPFinancialSuite.dbo.RefAccountType', Columns: "ID Value, Description Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'AccountTypeID' : inputId)), (defaultText == null ? 'Select Account Type' : defaultText), selectedValue);
        }
    });
}

function loadProductNumberDropdownList(inputId, selectedValue, defaultText = null, selectedText) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPInventorySuite.dbo.PrdProductItem', Columns: "ID Value, ItemNo Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'ProductID' : inputId)), (defaultText == null ? 'Select Item No' : defaultText), selectedValue, selectedText);
        }
    });
}
function loadProductNameDropdownList(inputId, selectedValue, defaultText = null, selectedText) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPInventorySuite.dbo.PrdProductItem', Columns: "ID Value, Description Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'ProductID' : inputId)), (defaultText == null ? 'Select Item No' : defaultText), selectedValue, selectedText);
        }
    });
}
function loadDivisionDropdownList(inputId, selectedValue, defaultText = null, selectedText) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPCoreSuite.dbo.RefBusinessDivision', Columns: "ID Value, Description Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'DivisionID' : inputId)), (defaultText == null ? 'Select Division' : defaultText), selectedValue, selectedText);
        }
    });
}
//function loadAccountHeadsDropdownList(inputId, selectedValue = 0) {
//    ajaxRequest({ url: '/AccountsManagement/JournalVoucher/GetAccountHeadForProduct', type: 'POST', data: {}, callBack: loadAccountHeadsDropdownListCallBack, id: selectedValue, inputIdAttr: inputId }, null, false);
//}
//var loadAccountHeadsDropdownListCallBack = function (responseJSON, options) {
//    bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + options.inputIdAttr), 'Select Account', options.id);
//}



function loadAccountHeadsDropdownList(inputFieldsAndSelectedValue = []) {
    ajaxRequest({
        url: '/AccountsManagement/JournalVoucher/GetAccountHeadForProduct', type: 'POST', data: {}, callBack:
            function (responseJSON) {


                $.each(inputFieldsAndSelectedValue, function (index, item) {

                    bindJQueryDropdownList(JSON.parse(responseJSON), $(`#${item.inputIdAttr}`), (item.defaulText == null ? 'Select Account' : item.defaulText), (item.selectedValue == null ? 0 : item.selectedValue));
                });

            }
    }, null, false);
}
function loadWarehouseDropdownList(inputId, selectedValue, defaultText = null, selectedText = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: `BHAERPInventorySuite.dbo.WarehouseLocation`,
            Columns: "ID Value, CONCAT(Code, ' - ',WarehouseName) Text",
            Condition: `WHERE IsActive = 1`
        },
        callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'WarehouseID' : inputId)), (defaultText == null ? 'Select Warehouse' : defaultText), selectedValue, selectedText);
        }

    });
}

