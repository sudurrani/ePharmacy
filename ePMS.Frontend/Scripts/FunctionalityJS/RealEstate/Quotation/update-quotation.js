var getAndDecryptIDCallBack = function (responseJOSN) {
    $('#ID').val(responseJOSN);
    ajaxRequest({ url: '/RealEstate/Quotation/GetQuotationById', type: 'POST', data: { ID: responseJOSN }, callBack: getQuotationByIdCallBack });
}
var getQuotationByIdCallBack = function (responseJSON) {
    formData = responseJSON.resultJSON;
    setResponseToFormInputs(responseJSON.resultJSON);
    //loadCustomerDropdownList('CustomerID', responseJSON.resultJSON.CustomerID);
    loadTenantDropdownList('CustomerID', responseJSON.resultJSON.CustomerID)
    loadCurrencyDropdownList('CurrencyID', 0);
    //getQuotaionDetailByQuotaionID();
    getQuotationRentDetail([]);
    loadQuotationStatusDropdownList(responseJSON.resultJSON.StatusID);


}
function getQuotationRentDetail(quotationDetailArray) {
    ajaxRequest({ url: '/RealEstate/Quotation/GetQuotationRentDetail', type: 'POST', data: { quotationID: $('#ID').val(), quotationDetailJSON: quotationDetailArray }, callBack: getQuotationRentDetailCallBack });
}
var getQuotationRentDetailCallBack = function (responseJSON, options) {
    _quotationRentDetailsArray = responseJSON.resultJSON;
    _allCheckedUnitRentDetailsArray = _quotationRentDetailsArray

    _quotationRentDetailsGetterArray = responseJSON.resultJSON;
    //generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, null, 0, null, ["Amount", "SecurityDepositAmount"]);
    $('#tblQuotationDataContainer').css('display', '');




    //checkedTableAllRows();
    getQuotationAdditionalCharges();
}
function getQuotationAdditionalCharges() {
    //write ajax and get quotation additional cahrges as like lease agreement
    ajaxRequest({ url: '/RealEstate/Quotation/GetAdditionalCharges', type: 'POST', data: { ID: $('#ID').val() }, callBack: getQuotationAdditionalChargesCallBack });
}
var getQuotationAdditionalChargesCallBack = function (responseJSON) {
    var numericFields = ["Amount", "SecurityDepositAmount"];

    //| Tenant Taxes Code                
    $.each(_quotationRentDetailsArray, function (rentIndex, rentValue) {
        var thID = '', dataKey = null, th = '',
            addedTenantTaxes = rentValue.TenantTaxes ? JSON.parse(rentValue.TenantTaxes) : [];
        if (rentValue.TenantTaxes) {

            $.each(addedTenantTaxes, function (taxIndex, taxItem) {
                $('#tblQuotationData>thead tr').each(function (rowIndex, rowItem) {
                    thID = "th" + taxItem.Code.replace(/\s/g, '_');
                    dataKey = taxItem.Code.replace(/\s/g, '_');
                    if ($(this).find('th#' + thID + '').length <= 0) {
                        th = `<th style="width:8px;" id=` + thID + ` class="text-right">` + taxItem.Code + `</th>`;
                        $('#tblQuotationData>thead>tr').append(th);
                    }
                    _quotationRentDetailsArray[rentIndex][dataKey] = taxItem.Amount;
                    numericFields.push(dataKey);

                });
            });
        }
        //Add those Tenant Taxes which are added after creation of this Quotation
        if (_tenantTaxesDetailArray.length > 0) {
            $.each(_tenantTaxesDetailArray, function (taxIndex, taxItem) {
                if ((addedTenantTaxes.filter(row => row.PropertyTaxSetupID == taxItem.ID)).length <= 0) {
                    $('#tblQuotationData>thead tr').each(function (rowIndexEachLoop, rowValue) {
                        thID = "th" + taxItem.Code.replace(/\s/g, '_');
                        dataKey = taxItem.Code.replace(/\s/g, '_');
                        if ($(this).find('th#' + thID + '').length <= 0) {
                            th = `<th style="width:8px;" id=` + thID + ` class="text-right">` + taxItem.Code + `</th>`;
                            $('#tblQuotationData>thead>tr').append(th);
                        }
                        _quotationRentDetailsArray[rentIndex][dataKey] = (_quotationRentDetailsArray[rentIndex].Amount * parseFloat(removeAllCommas(taxItem.Rate))) / 100;
                        numericFields.push(dataKey);

                    });
                }
            });

            //generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, null, 0, null, numericFields);
            //checkedTableAllRows();
        }

    })
    /*
    if (_tenantTaxesDetailArray.length > 0) {

        var th = '';
        $.each(_tenantTaxesDetailArray, function (taxIndex, taxItem) {
            var thID = '';
            $('#tblQuotationData>thead tr').each(function (rowIndexEachLoop, rowValue) {
                thID = "th" + taxItem.Code.replace(/\s/g, '_');
                dataKey = taxItem.Code.replace(/\s/g, '_');
                if ($(this).find('th#' + thID + '').length <= 0) {
                    th = `<th style="width:8px;" id=` + thID + ` class="text-right">` + taxItem.Code + `</th>`;
                    $('#tblQuotationData>thead>tr').append(th);
                }
                currentCheckedUnitRentDetailsObject[dataKey] = (tdAmountValue * parseFloat(removeAllCommas(taxItem.Rate))) / 100;
                moneyFields.push(dataKey);

            });

        });

        //generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, null, 0, null, numericFields);
        //checkedTableAllRows();
    }
    */
    //| Tenant Taxes Code End

    _quotationAdditionalChargesArray = responseJSON.resultJSON;

    $.each(_quotationAdditionalChargesArray, function (additionalIndex, additionalItem) {
        var thID = '';
        $('#tblQuotationData>thead tr').each(function (rowIndexEachLoop, rowValue) {
            thID = "th" + additionalItem.Name.replace(/\s/g, '_');
            dataKey = additionalItem.Name.replace(/\s/g, '_');
            if ($(this).find('th#' + thID + '').length <= 0) {
                th = `<th style="width:8px;;" id=` + thID + ` class="text-right">` + additionalItem.Name + `</th>`;
                $('#tblQuotationData>thead>tr').append(th);
            }
            for (let index = 0; index < _allCheckedUnitRentDetailsArray.length; index++) {
                //_allCheckedUnitRentDetailsArray[index][dataKey] = additionalItem.TotalAmount;
                _allCheckedUnitRentDetailsArray[index][dataKey] = additionalItem.Amount;
                // Commented above line - using Amount to exclude VAT
                numericFields.push(dataKey);
            }
        });
    });

    generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, null, 0, null, numericFields);
    checkedTableAllRows();
}
function checkedTableAllRows() {
    $('#tblQuotationData tr').each(function (rowIndexEachLoop, rowValue) {
        $('#tblQuotationDatatdCheckbox' + rowIndexEachLoop + '').prop('checked', true);
    });
}
