var _currenciesArray = [];
var _customersArray = [];
$(document).ready(function () {
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {

        let id = urlParams.get('ID');
        getAndDecryptID(id);
    }
    $('#DivisionID').on('select2:select', function () {
        loadServiceLineByDivisionDropdownList('ServiceLineID', 0, $(this).val(), null);
    });
    $('#ServiceLineID').on('select2:select', function () {
        loadServiceGroupByServiceLineDropdownList('ServiceGroupID', 0, $(this).val(), null);
    });
    $('#ServiceGroupID').on('select2:select', function () {
        loadServiceCategoryByServiceGroupDropdownList('ServiceCategoryID', 0, $(this).val(), null);
    });
    $('#ServiceCategoryID').on('select2:select', function () {
        loadServiceSubcategoryDropdownList('ServiceSubcategoryID', 0, $(this).val(), null);
    });

});
var getAndDecryptIDCallBack = function (response) {
    getByID(response);
}
function getByID(id) {
    ajaxRequest({ url: '/Services/ServiceItem/GetByID', type: 'POST', data: { ID: id }, callBack: getByIDCallBack });
}
var getByIDCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        setResponseToFormInputs(responseJSON.resultJSON.Header);
        loadCountryDropdownlist('OriginCountryID', responseJSON.resultJSON.Header.OriginCountryID, 0, 0);
        /*
        loadAccountHeadsDropdownList('IncomeAccountHeadID', responseJSON.resultJSON.Header.IncomeAccountHeadID);
        loadAccountHeadsDropdownList('CostAccountHeadID', responseJSON.resultJSON.Header.CostAccountHeadID);
        loadAccountHeadsDropdownList('DeferredIncomeAccountHeadID', responseJSON.resultJSON.Header.DeferredIncomeAccountHeadID);
        loadAccountHeadsDropdownList('ReceivableAccountHeadID', responseJSON.resultJSON.Header.ReceivableAccountHeadID);
        loadAccountHeadsDropdownList('IntercompanyAccountHeadID', responseJSON.resultJSON.Header.IntercompanyAccountHeadID);
        loadAccountHeadsDropdownList('AccruedIncomeAccountHeadID', responseJSON.resultJSON.Header.AccruedIncomeAccountHeadID);
        */
        let inputFieldsAndSelectedValue = [
            { inputIdAttr: 'IncomeAccountHeadID', selectedValue: responseJSON.resultJSON.Header.IncomeAccountHeadID, defaulText: null },
            { inputIdAttr: 'CostAccountHeadID', selectedValue: responseJSON.resultJSON.Header.CostAccountHeadID, defaulText: null },
            { inputIdAttr: 'DeferredIncomeAccountHeadID', selectedValue: responseJSON.resultJSON.Header.DeferredIncomeAccountHeadID, defaulText: null },
            { inputIdAttr: 'ReceivableAccountHeadID', selectedValue: responseJSON.resultJSON.Header.ReceivableAccountHeadID, defaulText: null },
            { inputIdAttr: 'IntercompanyAccountHeadID', selectedValue: responseJSON.resultJSON.Header.IntercompanyAccountHeadID, defaulText: null },
            { inputIdAttr: 'AccruedIncomeAccountHeadID', selectedValue: responseJSON.resultJSON.Header.AccruedIncomeAccountHeadID, defaulText: null },
        ];
        loadAccountHeadsDropdownList(inputFieldsAndSelectedValue);

        loadDivisionDropdownList('DivisionID', responseJSON.resultJSON.Header.DivisionID, null);
        loadServiceLineByDivisionDropdownList('ServiceLineID', responseJSON.resultJSON.Header.ServiceLineID, responseJSON.resultJSON.Header.DivisionID, null);
        loadServiceGroupByServiceLineDropdownList('ServiceGroupID', responseJSON.resultJSON.Header.ServiceGroupID, responseJSON.resultJSON.Header.ServiceLineID, null);
        loadServiceCategoryByServiceGroupDropdownList('ServiceCategoryID', responseJSON.resultJSON.Header.ServiceCategoryID, responseJSON.resultJSON.Header.ServiceGroupID, null);
        loadServiceSubcategoryDropdownList('ServiceSubcategoryID', responseJSON.resultJSON.Header.ServiceSubcategoryID, responseJSON.resultJSON.Header.ServiceCategoryID, null);

        ajaxRequest({
            url: '/Services/ServiceItem/GetDropdowns', type: 'POST', data: {}, callBack: function (dropdownsJSON) {
                if (dropdownsJSON.IsSuccess) {
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ServiceTypes, $('#ServiceTypeID'), 'Select Service Type', responseJSON.resultJSON.Header.ServiceTypeID, null, { text: 'Add New Service Type', function: 'newSetupServiceType' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ServiceChargeBases, $('#ChargeBasisID'), 'Select Charge Basis', responseJSON.resultJSON.Header.ChargeBasisID, null, { text: 'Add New Charge Basis', function: 'newSetupServiceChargeBasis' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectTimeUnits, $('#DurationUnitID'), 'Select Duration Unit', responseJSON.resultJSON.Header.DurationUnitID, null,{ text: 'Add New Estimation Unit', function: 'newSetupProjectTimeUnit' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ServiceUoMs, $('#UoMID'), 'Select UoM', responseJSON.resultJSON.Header.UoMID, null, { text: 'Add New Service UoM', function: 'newSetupServiceUoM' });                    
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ServiceVariants,$('#VariantID'),'Select Variant',(responseJSON.resultJSON.Variants && responseJSON.resultJSON.Variants.length > 0) ? responseJSON.resultJSON.Variants[0].VariantID: null,null);

                    _customersArray = dropdownsJSON.resultJSON.Customers;
                    _serviceVariantAttributesArrays = dropdownsJSON.resultJSON.ServiceVariantAttributes;

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

                            $.each(responseJSON.resultJSON.Variants, function (index, item) {

                                //ajaxRequest({
                                //    url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ServiceVariantAttribute]', Condition: 'WHERE IsDeleted = 0 AND ServiceVariantID = ' + item.VariantID + '' },
                                //    callBack: function (variantResponse) {
                                //        if (variantResponse.IsSuccess) {


                                //_variantAttributesArray = variantResponse.resultJSON;
                                _variantAttributesArray = _serviceVariantAttributesArrays.filter(row => row.ServiceVariantID == item.VariantID);
                                variantSchema.AttributesID['options'] = _variantAttributesArray;
                                item.AttributesID = item.AttributesID.split(",").map(s => s.trim());
                                addTableRowsBySchema(variantSchema, 'VariantTableTbody', item);
                                //        }
                                //    }
                                //});

                            });
                            customerSchema.CustomerID['options'] = _customersArray;
                            customerSchema.CurrencyID['options'] = _currenciesArray;
                            if (responseJSON.resultJSON.Customers.length > 0) {
                                $.each(responseJSON.resultJSON.Customers, function (index, item) {
                                    addTableRowsBySchema(customerSchema, 'CustomerTableTbody', item);
                                    resetTableActions('CustomerTableTbody', 'addCustomerRow', null);
                                });
                            }
                            else {
                                addTableRowsBySchema(customerSchema, 'CustomerTableTbody', { ID: 0, CustomerID: 0, CurrencyID: 5 });
                                resetTableActions('CustomerTableTbody', 'addCustomerRow', null);
                            }
                            let _taxGroupDetailArray = [];
                            taxSetupSchema.TaxGroupID['options'] = _taxGroupsArray;
                            taxSetupSchema.TaxTypeID['options'] = _taxTypesArray;

                            if (responseJSON.resultJSON.TaxSetups.length > 0) {
                                $.each(responseJSON.resultJSON.TaxSetups, function (index, item) {

                                    ajaxRequest({ url: '/CompanyManagement/TaxGroup/GetTaxGroupDetailByTaxGroup', type: 'POST',data: { ID: item.TaxGroupID },callBack: function (taxGroupDetailJSON) {
                                             _taxGroupDetailArray = [];
                                            let taxGroupDetails = JSON.parse(taxGroupDetailJSON);

                                            $.each(taxGroupDetails, function (i, itemDetail) {
                                                _taxGroupDetailArray.push({
                                                    Value: itemDetail.ID,
                                                    Text: itemDetail.Description
                                                });
                                            });
                                           
                                            let isMatched = taxGroupDetails.some(d => d.ID == item.TaxDetailID);

                                            if (isMatched) {
                                                taxSetupSchema.TaxDetailID['options'] = _taxGroupDetailArray;
                                                addTableRowsBySchema(taxSetupSchema, 'TaxSetupTableTbody', item);
                                                resetTableActions('TaxSetupTableTbody', 'addTaxSetupRow', null);
                                            } 
                                        }
                                    });

                                });
                            }
                            else {
                                addTableRowsBySchema(taxSetupSchema, 'TaxSetupTableTbody', { ID: 0, TaxGroupID: 0, TaxDetailID: 0, TaxTypeID: 0 });
                                resetTableActions('TaxSetupTableTbody', 'addTaxSetupRow', null);
                            }

                         
                        }
                    });

                }
            }
        }, null, false);


    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}
function redirectToAdd(id) {
    redirectToAction("/Services/ServiceItem/Add?ID=", id, null);
}