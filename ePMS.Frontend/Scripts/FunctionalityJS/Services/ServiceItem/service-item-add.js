var _customersArray = [];
var _currenciesArray = [];
var isCustomerTab = false;
var isTaxSetupTab = false;
$(document).ready(function () { 
    loadDivisionDropdownList('DivisionID', 0, null);
    getNumber();
    $('#DivisionID').on('select2:select', function () {
        loadServiceLineByDivisionDropdownList('ServiceLineID',0, $(this).val(), null);
    });
    $('#ServiceLineID').on('select2:select', function () {
        loadServiceGroupByServiceLineDropdownList('ServiceGroupID',0, $(this).val(), null);
    });
    $('#ServiceGroupID').on('select2:select', function () {
        loadServiceCategoryByServiceGroupDropdownList('ServiceCategoryID', 0, $(this).val(), null);
    });
    $('#ServiceCategoryID').on('select2:select', function () {
        loadServiceSubcategoryDropdownList('ServiceSubcategoryID', 0, $(this).val(), null);
    });
    /*
    loadAccountHeadsDropdownList('IncomeAccountHeadID', 0);
    loadAccountHeadsDropdownList('CostAccountHeadID', 0);
    loadAccountHeadsDropdownList('DeferredIncomeAccountHeadID', 0);
    loadAccountHeadsDropdownList('ReceivableAccountHeadID', 0);
    loadAccountHeadsDropdownList('IntercompanyAccountHeadID', 0);
    loadAccountHeadsDropdownList('AccruedIncomeAccountHeadID', 0);
    */
    let inputFieldsAndSelectedValue = [
        { inputIdAttr: 'IncomeAccountHeadID', selectedValue: 0, defaulText: null },
        { inputIdAttr: 'CostAccountHeadID', selectedValue: 0, defaulText: null },
        { inputIdAttr: 'DeferredIncomeAccountHeadID', selectedValue: 0, defaulText: null },
        { inputIdAttr: 'ReceivableAccountHeadID', selectedValue: 0, defaulText: null },
        { inputIdAttr: 'IntercompanyAccountHeadID', selectedValue: 0, defaulText: null },
        { inputIdAttr: 'AccruedIncomeAccountHeadID', selectedValue: 0, defaulText: null },
    ];
    loadAccountHeadsDropdownList(inputFieldsAndSelectedValue);
    loadCountryDropdownlist('OriginCountryID', 0);
    ajaxRequest({
        url: '/Services/ServiceItem/GetDropdowns', type: 'POST', data: {}, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON.ServiceTypes, $('#ServiceTypeID'), 'Select Service Type', 0, null, { text: 'Add New Service Type', function: 'newSetupServiceType' });
                bindJQueryDropdownList(responseJSON.resultJSON.ServiceChargeBases, $('#ChargeBasisID'), 'Select Charge Basis', 0, null, { text: 'Add New Charge Basis', function:'newSetupServiceChargeBasis'});
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectTimeUnits, $('#DurationUnitID'), 'Select Duration Unit', 0, null, { text: 'Add New Estimation Unit', function: 'newSetupProjectTimeUnit' });
                bindJQueryDropdownList(responseJSON.resultJSON.ServiceUoMs, $('#UoMID'), 'Select UoM', 0, null, { text: 'Add New Service UoM', function: 'newSetupServiceUoM' });
                bindJQueryDropdownList(responseJSON.resultJSON.ServiceVariants, $('#VariantID'), 'Select Variant', 0, null);                
                _serviceVariantAttributesArrays = responseJSON.resultJSON.ServiceVariantAttributes;
                _customersArray = responseJSON.resultJSON.Customers;
                _customersArray.unshift({ Value: 0, Text: 'Select Customer' });
                //_currenciesArray = responseJSON.resultJSON.Currencies;
                ajaxRequest({
                    url: '/CoreSuite/GetAllCurrency', type: 'POST', data: {}, callBack: function (currencyResponse) {
                        var currencies = [];
                        $.each(JSON.parse(currencyResponse), function (index, item) {
                            currencies.push({
                                Value: item.ID,
                                Text: item.CurrencySymbol
                            });
                        })
                        _currenciesArray = currencies;
                        _currenciesArray.unshift({ Value: 0, Text: 'Select Currency' });
                    }
                });               

            }
        }
    }, null, false);
    $('#Customer').click(function () {       
            if (!isCustomerTab) {
                customerSchema.CustomerID['options'] = _customersArray;
                customerSchema.CurrencyID['options'] = _currenciesArray;
                addTableRowsBySchema(customerSchema, 'CustomerTableTbody', { ID: 0, CustomerID: 0, CurrencyID: 5 });
                resetTableActions('CustomerTableTbody', 'addCustomerRow', null);
                isCustomerTab = true;
            }
        
    });
    $('#TaxSetup').click(function () {
              
            if (!isTaxSetupTab) {
                taxSetupSchema.TaxGroupID['options'] = _taxGroupsArray;
                taxSetupSchema.TaxTypeID['options'] = _taxTypesArray;
                addTableRowsBySchema(taxSetupSchema, 'TaxSetupTableTbody', { ID: 0, TaxGroupID: 0, TaxDetailID: 0, TaxTypeID: 0 });
                resetTableActions('TaxSetupTableTbody', 'addTaxSetupRow', null);
                isTaxSetupTab = true;
        }
    });
});
function getNumber() {
    ajaxRequest({ url: '/Services/ServiceItem/GetNumber', type: 'POST', data: {}, callBack: getNumberCallBack }, null, false);
}
var getNumberCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#No').val(responseJSON.resultJSON.Number);
        $('#No').prop('readonly', true);
    }
    else {
        $('#No').prop('readonly', false);
    }
}