var selectedUnitID = 0;
var _quotationDetailArray = [], _tenantTaxesDetailArray = [];
var _quotationRentDetailsSetterArray = [];
var _quotationRentDetailsGetterArray = [];
var _quotationRentDetailsArray = [];
var _currentCheckedUnitRentDetailsArray = [];
var _allCheckedUnitRentDetailsArray = [];
var _quotationAdditionalChargesArray = [];
var _isFromUpdate = false;
var quotationNumber = '';
var isQuotationFormChanged = false;
var isFromCloseButton = false;
var unitSelectionIDs = 0;
$(document).ready(function () {
    getTenantTaxes();
    $('#CustomerID').on('select2:select', function (e) {
        getTenantDetailByID($(this).val());
    });
    $('#PropertyID').on('change', function () {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyUnit]', Columns: 'ID Value, UnitNo Text', Condition: 'WHERE IsDeleted = 0 AND UnitTypes = \'Leasable\' AND PropertyID =' + $('#PropertyID').val() }, callBack: loadLeasablePropertyUnitDropdownListCallBack });
    })
    $('#UnitID').on('select2:select', function (e) {
        unitSelectionIDs = $(this).val();
        var quotationDate = $("#QuotationDate").val();
        if (quotationDate == 0) {
            infoToastr("First enter Quotation Date", 'info');
            $('#UnitID').val(0).change();
            return;
        }
        else {
            if ($("#StatusID option:selected").text() !== "Issued") {
                $.ajax({
                    url: '/RealEstate/LeaseAgreement/CheckUnitAvailableFrom', type: 'POST', data: { UnitIDs: [{ ID: $('#UnitID').val() }], StartDate: $('#QuotationDate').val() },
                    async: false,
                    success: function (responseJSON) {
                        if (responseJSON.IsSuccess && responseJSON.resultJSON.length > 0) {
                            let availableFromMessage = responseJSON.resultJSON.map(x => {
                                return `Unit (${x.UnitNo}) is available from (${getFormattedDate(x.AvailableFrom)})`;
                            }).join(', ');

                            $('#errorMessage').text(availableFromMessage).show();
                            infoToastr(availableFromMessage);
                            //$('#UnitID').val(0).change();
                        } else {
                            $('#errorMessage').hide();
                        }
                    }
                });
            }
            ajaxRequest({
                url: '/RealEstate/Quotation/CheckExistanceForUnit', type: 'POST', data: { StartDate: $('#QuotationDate').val(), Units: [{ ID: $('#UnitID').val() }] }, callBack: function (responseJSON) {
                    if (responseJSON.IsSuccess && responseJSON.resultJSON.length > 0) {
                        quotationNumber = responseJSON.resultJSON[0].QuotationNumber;
                        infoToastr(quotationNumber + ' ' + 'exist valid until' + ' ' + quotationDate + ' ' + 'with same Unit');
                        $("#unitRentDetailTableContainer").css("display", "none");
                        $('#UnitID').val(0).change();
                        return;
                    }
                    else {
                        getUnitRentDetail($('#UnitID').val());
                        //$("#unitRentDetailTableContainer").css("display", "block");
                    }
                }
            });
        }
    });
    $('#btnSave').on('click', function () {
        _quotationRentDetailsArray = getAddedUnitRentDetailArray();
        var inputJSON = {};

        if (!customValidateForm('quotationForm')) return;

        inputJSON = getFormDataAsJSONObject('quotationForm');
        inputJSON['PropertyID'] = $('#PropertyID').val();
        inputJSON['UnitID'] = $('#UnitID').val();
        inputJSON['QuotationDetailList'] = _quotationDetailArray;
        inputJSON['QuotationRentDetails'] = _quotationRentDetailsArray;

        if (_quotationRentDetailsArray.length <= 0) {
            infoToastr('At least one unit with rent detail should be added', 'info');
            return;
        }
        $.each(_quotationAdditionalChargesArray, function (rowIndex, rowValue) {
            if (_quotationAdditionalChargesArray[rowIndex].ID > 0) {
                _quotationAdditionalChargesArray[rowIndex]['AdditionalChargesID'] = rowValue.ID;
                _quotationAdditionalChargesArray[rowIndex].ID = 0;
            }
        });

        inputJSON['QuotationAdditionalCharges'] = _quotationAdditionalChargesArray;

        let unitIDs = [];
        $.each(_quotationRentDetailsArray, function (rowIndexRentDetail, rowItemRentdetail) {
            unitIDs.push({ ID: rowItemRentdetail.UnitID });
        });

        let tenantTaxes = [];
        $.each(_quotationRentDetailsArray, function (rentIndex, rentValue) {
            let rentTenantTaxes = [];
            $.each(_tenantTaxesDetailArray, function (taxIndex, taxValue) {


                let tenantTax =
                {
                    ID: 0,
                    LeaseTermID: rentValue.LeaseTermID,
                    UnitID: rentValue.UnitID,
                    QuotationID: 0,
                    PropertyTaxSetupID: taxValue.ID,
                    AccountHeadID: taxValue.AccountHeadID,
                    Amount: (parseFloat(removeAllCommas(rentValue.Amount)) * parseFloat(removeAllCommas(taxValue.Rate))) / 100,
                    Rate: taxValue.Rate

                    , Code: taxValue.Code //Add this only for retrieving purpose it has nothing todo with QuotationTenantTaxes table
                };

                tenantTaxes.push(tenantTax);
                rentTenantTaxes.push(tenantTax);
            })
            _quotationRentDetailsArray[rentIndex]['TenantTaxes'] = JSON.stringify(rentTenantTaxes);
        });
        inputJSON['QuotationTenantTaxes'] = tenantTaxes;

        const startDate = $('#QuotationDate').val();
        const statusSelectedText = $("#StatusID option:selected").text();

        let isExist = true;
        if (statusSelectedText !== "Issued" && unitIDs.length > 0 && startDate) {
            $.ajax({
                url: '/RealEstate/LeaseAgreement/CheckUnitAvailableFrom', type: 'POST', data: { UnitIDs: unitIDs, StartDate: startDate },
                success: function (responseJSON) {
                    if (responseJSON.IsSuccess && responseJSON.resultJSON.length > 0) {
                        let availableFromMessage = responseJSON.resultJSON.map(x => {
                            return `Unit (${x.UnitNo}) is available from (${getFormattedDate(x.AvailableFrom)})`;
                        }).join(', ');
                        $('#errorMessage').text(availableFromMessage).show();
                    } else {
                        $('#errorMessage').hide();
                    }
                }
            });
        }
        $.ajax({
            url: '/RealEstate/Quotation/CheckExistanceForUnit', type: 'POST', data: { ID: $('#ID').val(), StartDate: startDate, Units: unitIDs },
            async: false,
            success: function (responseJSON) {
                if (responseJSON.IsSuccess && responseJSON.resultJSON.length > 0) {
                    let unitNos = responseJSON.resultJSON.map(x => x.UnitNo).join(', ');
                    quotationNumber = responseJSON.resultJSON[0].QuotationNumber;

                    infoToastr(`${quotationNumber} exists valid until ${startDate} with same Unit(${unitNos})`);
                    isExist = false;
                }
            }
        });

        if (!isExist)
            return;
        ajaxRequest({
            url: "/RealEstate/Quotation/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack
        });
        $('#errorMessage').hide();
    });

    var addUnitRentDetailTableID = '';
    var addedUnitRentDetailTableSequence = 0;
    $('#btnAddRowToTblQuotation').on('click', function () {
        _currentCheckedUnitRentDetailsArray = [];
        //if ($('#CurrencyID').val() == 0) {
        //    infoToastr('Currency is required', 'info');
        //    return;
        //}
        var isUnitFoundWithSamePaymentFrequency = false;
        var paymentFrequencyName = '';
        // Loop through each row in the table (except the header row)

        let moneyFields = ["Amount", "SecurityDepositAmount"];
        $('#unitRentDetailTable tbody tr').each(function (unitRentDetailTableRowIndex, unitRentDetailTableRowValue) {
            currentCheckedUnitRentDetailsObject = {};
            var isCheckedBox = $(this).find('td').find('input:checkbox#unitRentDetailTabletdCheckbox' + unitRentDetailTableRowIndex + '').is(':checked'); //$('#tdCheckbox' + rowIndexEachLoop + '').prop('checked');        
            if (isCheckedBox) {
                let tdAmountValue = removeAllCommas($(this).find('td.tdAmount').text());
                currentCheckedUnitRentDetailsObject['ID'] = 0;// $(this).find('td.tdID').text();
                currentCheckedUnitRentDetailsObject['LeaseTermID'] = $(this).find('td.tdLeaseTermID').text();
                currentCheckedUnitRentDetailsObject['LeaseTermName'] = $(this).find('td.tdLeaseTermName').text();
                currentCheckedUnitRentDetailsObject['Amount'] = tdAmountValue;
                currentCheckedUnitRentDetailsObject['PaymentFrequencyID'] = $(this).find('td.tdPaymentFrequencyID').text();
                currentCheckedUnitRentDetailsObject['PaymentFrequencyName'] = $(this).find('td.tdPaymentFrequencyName').text();
                currentCheckedUnitRentDetailsObject['PaymentTermID'] = $(this).find('td.tdPaymentTermID').text();
                currentCheckedUnitRentDetailsObject['PaymentTermName'] = $(this).find('td.tdPaymentTermName').text();
                currentCheckedUnitRentDetailsObject['SecurityDepositAmount'] = removeAllCommas($(this).find('td.tdSecurityDepositAmount').text());
                currentCheckedUnitRentDetailsObject['SecurityDepositEquivalentID'] = $(this).find('td.tdSecurityDepositEquivalentID').text();
                currentCheckedUnitRentDetailsObject['SecurityDepositEquivalentName'] = $(this).find('td.tdSecurityDepositEquivalentName').text();
                currentCheckedUnitRentDetailsObject['NoOfPayments'] = $(this).find('td.tdNoOfPayments').text();
                currentCheckedUnitRentDetailsObject['UnitID'] = $(this).find('td.tdUnitID').text();
                currentCheckedUnitRentDetailsObject['FrequencyDays'] = $(this).find('td.tdFrequencyDays').text();
                currentCheckedUnitRentDetailsObject['CurrencyID'] = $(this).find('td.tdCurrencyID').text();
                //currentCheckedUnitRentDetailsObject['Currency'] = $('#CurrencyID option:selected').text();
                currentCheckedUnitRentDetailsObject['Currency'] = $(this).find('td.tdCurrency').text();

                currentCheckedUnitRentDetailsObject['PropertyID'] = $('#PropertyID').val();
                currentCheckedUnitRentDetailsObject['PropertyName'] = $('#PropertyID option:selected').text();
                currentCheckedUnitRentDetailsObject['UnitID'] = $('#UnitID').val();
                currentCheckedUnitRentDetailsObject['UnitName'] = $('#UnitID option:selected').text();
                currentCheckedUnitRentDetailsObject['UnitType'] = $('#txtUnitType').val();
                currentCheckedUnitRentDetailsObject['Description'] = $('#txtDescription').val();
                currentCheckedUnitRentDetailsObject['Rent'] = $('#txtRent').val();
                //currentCheckedUnitRentDetailsObject['CurrencyID'] = $('#CurrencyID').val();
                currentCheckedUnitRentDetailsObject['Frequency'] = $('#txtFrequency').val();

                _currentCheckedUnitRentDetailsArray.push(currentCheckedUnitRentDetailsObject);

                //| Tenant Taxes Code                
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
                //| Tenant Taxes Code End

                var addRentDetailForPropertyAndUnit = _allCheckedUnitRentDetailsArray.filter(row => row.PropertyID == $('#PropertyID').val()
                    && row.UnitID == $('#UnitID').val()
                    && parseInt(row.PaymentFrequencyID) == parseInt($(this).find('td.tdPaymentFrequencyID').text())
                );
                if (addRentDetailForPropertyAndUnit.length > 0) {
                    isUnitFoundWithSamePaymentFrequency = true;
                    paymentFrequencyName = $(this).find('td.tdPaymentFrequencyName').text();
                    return;
                }
            }

        });
        addUnitRentDetailTableID = 'unitRentDetailTable' + addedUnitRentDetailTableSequence;
        addedUnitRentDetailTableSequence = addedUnitRentDetailTableSequence + 1
        var quotationDetailObject = {};
        if (_currentCheckedUnitRentDetailsArray.length == 0) {
            infoToastr('One lease term should be selected for the unit', 'info');
        }
        else {
            if (!isUnitFoundWithSamePaymentFrequency) {
                _quotationDetailArray.push(quotationDetailObject);
                if (_currentCheckedUnitRentDetailsArray.length > 0) {
                    $.each(_currentCheckedUnitRentDetailsArray, function (rowIndex, rowItem) {
                        rowItem['Property'] = $('#PropertyID option:selected').text();
                        rowItem['Unit'] = $('#UnitID option:selected').text();
                        _allCheckedUnitRentDetailsArray.push(rowItem);
                    })

                    //| Additional Charges
                    $.each(_quotationAdditionalChargesArray, function (additionalIndex, additionalItem) {
                        dataKey = additionalItem.Name.replace(/\s/g, '_');
                        $.each(_allCheckedUnitRentDetailsArray, function (rowIndex, rowItem) {

                            if (rowItem[dataKey]) {
                                //rowItem[dataKey] = additionalItem.TotalAmount;
                                rowItem[dataKey] = additionalItem.Amount; // Commented above line - using Amount to exclude VAT
                            }
                            else {
                                //_allCheckedUnitRentDetailsArray[rowIndex][dataKey] = additionalItem.TotalAmount;
                                _allCheckedUnitRentDetailsArray[rowIndex][dataKey] = additionalItem.Amount; // Commented above line - using Amount to exclude VAT
                            }
                            moneyFields.indexOf(dataKey) === -1 ? moneyFields.push(dataKey) : console.log(dataKey + ' already exist in moneyFields array');
                        })

                    });
                    //| Additional Charges                    
                    generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, null, 0, null, moneyFields);
                    $('#tblQuotationData tbody tr').each(function (rowIndex) {
                        $(this).append(`
                          <td>
                             <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeQuotationRow($(this),${rowIndex});"></i>
                         </td>
                     `);
                    });
                    //generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, 0,0, null, ["Amount", "SecurityDepositAmount"]);
                    $('#tblQuotationDataContainer').css('display', '');
                }
                _quotationRentDetailsSetterArray = [];
                //$('#unitRentDetailTable').css('display', 'none');
                //$('#btnAddRowToTblQuotation').css('display', 'none');
                $('#unitRentDetailTableContainer').css('display', 'none');
                $('#PropertyID').val(0).change();
                $('#UnitID').val(0).change();
                //$('#CurrencyID').val(0).change();
            }
            else {
                infoToastr('Payment detail already exist for Property(' + $('#PropertyID option:selected').text() + '), Unit No(' + $('#UnitID option:selected').text() + ') and Payment Freq(' + paymentFrequencyName + ')', 'info');
            }
        }

    });

    //New the above code is repeated due to conflict add & Update

    $('#btnAddRowToTblQuotationUpdate').on('click', function () {
        _currentCheckedUnitRentDetailsArray = [];
        //if ($('#CurrencyID').val() == 0) {
        //    infoToastr('Currency is required', 'info');
        //    return;
        //}
        var isUnitFoundWithSamePaymentFrequency = false;
        var paymentFrequencyName = '';
        // Loop through each row in the table (except the header row)

        let moneyFields = ["Amount", "SecurityDepositAmount"];
        $('#unitRentDetailTable tbody tr').each(function (unitRentDetailTableRowIndex, unitRentDetailTableRowValue) {
            currentCheckedUnitRentDetailsObject = {};
            var isCheckedBox = $(this).find('td').find('input:checkbox#unitRentDetailTabletdCheckbox' + unitRentDetailTableRowIndex + '').is(':checked'); //$('#tdCheckbox' + rowIndexEachLoop + '').prop('checked');        
            if (isCheckedBox) {
                let tdAmountValue = removeAllCommas($(this).find('td.tdAmount').text());
                currentCheckedUnitRentDetailsObject['ID'] = 0;// $(this).find('td.tdID').text();
                currentCheckedUnitRentDetailsObject['LeaseTermID'] = $(this).find('td.tdLeaseTermID').text();
                currentCheckedUnitRentDetailsObject['LeaseTermName'] = $(this).find('td.tdLeaseTermName').text();
                currentCheckedUnitRentDetailsObject['Amount'] = tdAmountValue;
                currentCheckedUnitRentDetailsObject['PaymentFrequencyID'] = $(this).find('td.tdPaymentFrequencyID').text();
                currentCheckedUnitRentDetailsObject['PaymentFrequencyName'] = $(this).find('td.tdPaymentFrequencyName').text();
                currentCheckedUnitRentDetailsObject['PaymentTermID'] = $(this).find('td.tdPaymentTermID').text();
                currentCheckedUnitRentDetailsObject['PaymentTermName'] = $(this).find('td.tdPaymentTermName').text();
                currentCheckedUnitRentDetailsObject['SecurityDepositAmount'] = removeAllCommas($(this).find('td.tdSecurityDepositAmount').text());
                currentCheckedUnitRentDetailsObject['SecurityDepositEquivalentID'] = $(this).find('td.tdSecurityDepositEquivalentID').text();
                currentCheckedUnitRentDetailsObject['SecurityDepositEquivalentName'] = $(this).find('td.tdSecurityDepositEquivalentName').text();
                currentCheckedUnitRentDetailsObject['NoOfPayments'] = $(this).find('td.tdNoOfPayments').text();
                currentCheckedUnitRentDetailsObject['UnitID'] = $(this).find('td.tdUnitID').text();
                currentCheckedUnitRentDetailsObject['FrequencyDays'] = $(this).find('td.tdFrequencyDays').text();
                currentCheckedUnitRentDetailsObject['CurrencyID'] = $(this).find('td.tdCurrencyID').text();
                //currentCheckedUnitRentDetailsObject['Currency'] = $('#CurrencyID option:selected').text();
                currentCheckedUnitRentDetailsObject['Currency'] = $(this).find('td.tdCurrency').text();

                currentCheckedUnitRentDetailsObject['PropertyID'] = $('#PropertyID').val();
                currentCheckedUnitRentDetailsObject['PropertyName'] = $('#PropertyID option:selected').text();
                currentCheckedUnitRentDetailsObject['UnitID'] = $('#UnitID').val();
                currentCheckedUnitRentDetailsObject['UnitName'] = $('#UnitID option:selected').text();
                currentCheckedUnitRentDetailsObject['UnitType'] = $('#txtUnitType').val();
                currentCheckedUnitRentDetailsObject['Description'] = $('#txtDescription').val();
                currentCheckedUnitRentDetailsObject['Rent'] = $('#txtRent').val();
                //currentCheckedUnitRentDetailsObject['CurrencyID'] = $('#CurrencyID').val();
                currentCheckedUnitRentDetailsObject['Frequency'] = $('#txtFrequency').val();

                _currentCheckedUnitRentDetailsArray.push(currentCheckedUnitRentDetailsObject);

                //| Tenant Taxes Code                
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
                //| Tenant Taxes Code End

                var addRentDetailForPropertyAndUnit = _allCheckedUnitRentDetailsArray.filter(row => row.PropertyID == $('#PropertyID').val()
                    && row.UnitID == $('#UnitID').val()
                    && parseInt(row.PaymentFrequencyID) == parseInt($(this).find('td.tdPaymentFrequencyID').text())
                );
                if (addRentDetailForPropertyAndUnit.length > 0) {
                    isUnitFoundWithSamePaymentFrequency = true;
                    paymentFrequencyName = $(this).find('td.tdPaymentFrequencyName').text();
                    return;
                }
            }

        });
        addUnitRentDetailTableID = 'unitRentDetailTable' + addedUnitRentDetailTableSequence;
        addedUnitRentDetailTableSequence = addedUnitRentDetailTableSequence + 1
        var quotationDetailObject = {};
        if (_currentCheckedUnitRentDetailsArray.length == 0) {
            infoToastr('One lease term should be selected for the unit', 'info');
        }
        else {
            if (!isUnitFoundWithSamePaymentFrequency) {
                _quotationDetailArray.push(quotationDetailObject);
                if (_currentCheckedUnitRentDetailsArray.length > 0) {
                    $.each(_currentCheckedUnitRentDetailsArray, function (rowIndex, rowItem) {
                        rowItem['Property'] = $('#PropertyID option:selected').text();
                        rowItem['Unit'] = $('#UnitID option:selected').text();
                        _allCheckedUnitRentDetailsArray.push(rowItem);
                    })

                    //| Additional Charges
                    $.each(_quotationAdditionalChargesArray, function (additionalIndex, additionalItem) {
                        dataKey = additionalItem.Name.replace(/\s/g, '_');
                        $.each(_allCheckedUnitRentDetailsArray, function (rowIndex, rowItem) {

                            if (rowItem[dataKey]) {
                                //rowItem[dataKey] = additionalItem.TotalAmount;
                                rowItem[dataKey] = additionalItem.Amount; // Commented above line - using Amount to exclude VAT
                            }
                            else {
                                //_allCheckedUnitRentDetailsArray[rowIndex][dataKey] = additionalItem.TotalAmount;
                                _allCheckedUnitRentDetailsArray[rowIndex][dataKey] = additionalItem.Amount; // Commented above line - using Amount to exclude VAT
                            }
                            moneyFields.indexOf(dataKey) === -1 ? moneyFields.push(dataKey) : console.log(dataKey + ' already exist in moneyFields array');
                        })

                    });
                    //| Additional Charges                    
                    generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, null, 0, null, moneyFields);
                   
                    //generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, 0,0, null, ["Amount", "SecurityDepositAmount"]);
                    $('#tblQuotationDataContainer').css('display', '');
                }
                _quotationRentDetailsSetterArray = [];
                //$('#unitRentDetailTable').css('display', 'none');
                //$('#btnAddRowToTblQuotation').css('display', 'none');
                $('#unitRentDetailTableContainer').css('display', 'none');
                $('#PropertyID').val(0).change();
                $('#UnitID').val(0).change();
                //$('#CurrencyID').val(0).change();
            }
            else {
                infoToastr('Payment detail already exist for Property(' + $('#PropertyID option:selected').text() + '), Unit No(' + $('#UnitID option:selected').text() + ') and Payment Freq(' + paymentFrequencyName + ')', 'info');
            }
        }

    });

    //End Of Code 


    $('#quotationForm input, #quotationForm select, #quotationForm textarea').on('change input', function () {
        isQuotationFormChanged = true;
    });
    $('#btnCloseQuotation').on("click", function () {
        if (!isQuotationFormChanged) {
            window.location.href = '/RealEstate/Quotation/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
        } else {
            swal.fire({
                title: "Confirmation",
                text: 'You have unsaved changes do you want save draft ?',
                type: 'info',
                cancelButtonColor: '#F04249',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                dangerMode: true,
            }).then((result) => {
                if (result.value) {
                    isFromCloseButton = true;
                    $('#btnSave').trigger('click');
                }
                else {
                    window.location.href = '/RealEstate/Quotation/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
                }
            });
        }
    });
});
//var getCustomerByIDCallBack = function (responseJSON) {
//    setResponseToFormInputs(responseJSON.resultJSON, ['ID']);
//}

//14/03/2024 Now this function will use because Customer is now Tenant/Customer.
function getTenantDetailByID(tenantID = 0) {
    ajaxRequest({ url: '/RealEstate/Tenant/GetTenantById', type: 'POST', data: { ID: tenantID }, callBack: getTenantDetailByIDCallBack });
}
var getTenantDetailByIDCallBack = function (responseJSON) {
    if (responseJSON.resultJSON != null) {
        $('#Email').val(responseJSON.resultJSON.Email);
        $('#PrimaryMobileNo').val(responseJSON.resultJSON.PrimaryMobileNo);
        $('#SecondaryMobileNo').val(responseJSON.resultJSON.SecondaryMobileNo);
        $('#AddressLine1').val(responseJSON.resultJSON.AddressLine1);
    }
}


// it will populate the Property Drop down 
function loadPropertyDropdownList() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Property]', Columns: 'ID Value, Name Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadPropertyDropdownListCallBack });
}
var loadPropertyDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#PropertyID'), 'Select Property');

}
var loadLeasablePropertyUnitDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#UnitID'), 'Select Unit', selectedUnitID);

}
var saveRecordCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#ID').val(responseJSON.resultJSON);
        successToastr(`Quotation ${$('#QuotationNumber').val()} saved successfully`, 'success');
        if (isFromCloseButton) {
            window.location.href = '/RealEstate/Quotation/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
        }
    }
    else {
        errorToastr(responseJSON.Message, responseJSON.Type);
    }
}
function getUnitRentDetail(unitID) {
    ajaxRequest({ url: '/RealEstate/Unit/GetUnitRentDetailById', type: 'POST', data: { unitID: unitID }, callBack: getUnitRentDetailCallBack });
}
var getUnitRentDetailCallBack = function (responseJOSN) {
    if (responseJOSN.IsSuccess) {
        if (responseJOSN.resultJSON.length > 0) {

            generateHTMLTableRowsFromJSONWithCheckbox(responseJOSN.resultJSON, 'unitRentDetailTable', null, null, 0, 0, null, ["Amount", "SecurityDepositAmount"]);
            _quotationRentDetailsSetterArray = responseJOSN.resultJSON;
            $('#unitRentDetailTableContainer').css('display', '');
            //$('#btnAddRowToTblQuotation').css('display', '');
        }
        else {
            $('#unitRentDetailTableContainer').css('display', 'none');
            //$('#btnAddRowToTblQuotation').css('display', 'none');
        }

    }
    else {
        errorToastr(responseJSON.Message, "error");
    }


}
function getAddedUnitRentDetailArray() {
    debugger
    _quotationRentDetailsArray = [];

    //table  each loop
    $('#tblQuotationData tbody tr').each(function (quotationdataRowIndex, quotationdataRowValue) {
        currentCheckedUnitRentDetailsObject = {};
        var istblQuotationDataCheckboxChecked = $(this).find('td').find('input:checkbox#tblQuotationDatatdCheckbox' + quotationdataRowIndex + '').is(':checked');

        if (istblQuotationDataCheckboxChecked) {
            currentCheckedUnitRentDetailsObject['ID'] = $(this).find('td.tdID').text();
            currentCheckedUnitRentDetailsObject['LeaseTermID'] = $(this).find('td.tdLeaseTermID').text();
            currentCheckedUnitRentDetailsObject['LeaseTermName'] = $(this).find('td.tdLeaseTermName').text();
            currentCheckedUnitRentDetailsObject['Amount'] = removeAllCommas($(this).find('td.tdAmount').text());
            currentCheckedUnitRentDetailsObject['PaymentFrequencyID'] = $(this).find('td.tdPaymentFrequencyID').text();
            currentCheckedUnitRentDetailsObject['PaymentFrequencyName'] = $(this).find('td.tdPaymentFrequencyName').text();
            currentCheckedUnitRentDetailsObject['PaymentTermID'] = $(this).find('td.tdPaymentTermID').text();
            currentCheckedUnitRentDetailsObject['PaymentTermName'] = $(this).find('td.tdPaymentTermName').text();
            currentCheckedUnitRentDetailsObject['SecurityDepositAmount'] = removeAllCommas($(this).find('td.tdSecurityDepositAmount').text());
            currentCheckedUnitRentDetailsObject['SecurityDepositEquivalentID'] = $(this).find('td.tdSecurityDepositEquivalentID').text();
            currentCheckedUnitRentDetailsObject['SecurityDepositEquivalentName'] = $(this).find('td.tdSecurityDepositEquivalentName').text();
            currentCheckedUnitRentDetailsObject['NoOfPayments'] = $(this).find('td.tdNoOfPayments').text();
            currentCheckedUnitRentDetailsObject['UnitID'] = $(this).find('td.tdUnitID').text();
            currentCheckedUnitRentDetailsObject['CurrencyID'] = $(this).find('td.tdCurrencyID').text();
            currentCheckedUnitRentDetailsObject['Currency'] = $(this).find('td.tdCurrency').text();
            currentCheckedUnitRentDetailsObject['FrequencyDays'] = $(this).find('td.tdFrequencyDays').text();
            _quotationRentDetailsArray.push(currentCheckedUnitRentDetailsObject);


        }
    });
    return _quotationRentDetailsArray;

}
function getTenantTaxes() {
    ajaxRequest({ url: '/RealEstate/PropertyTax/GetByPayer', type: 'POST', data: { Payer: 'Tenant' }, callBack: getTenantTaxesCallBack });
}
var getTenantTaxesCallBack = function (responseJSON) {

    _tenantTaxesDetailArray = responseJSON.resultJSON;
    $('#tenantTaxesContainer').html('');
    $.each(_tenantTaxesDetailArray, function (index, item) {
        $('#tenantTaxesContainer').append(`<div class="badge rounded-pill bg-success ps-3 pe-3 me-2" style="color:#fff;z-index:2;">
           ` + item.Code + ` (` + item.Rate + `%)
         </div>`);
    })

    //generatePaymentScheduleTableTHEAD(_tenantTaxesDetail);
}
var checkBoxClicked = function (tr) {
    let checked = $(tr).is(':checked');
    $(tr).closest('tr').toggleClass('tr_selected', checked);

}
function closeAdditionalChargesModal() {
    $('#modalAdditionalCharges').modal('hide');
}
//var checkExistanceForUnitCallBack = function (responseJSON) {
//    if (responseJSON.IsSuccess) {
//        if (responseJSON > 0) {
//            var quotationDate = $("#QuotationDate").val();
//            var quotationNumber = $("#QuotationNumber").val();
//        }
//    }
//}

datePickerDDMMYYYYFormat('QuotationDate');
datePickerDDMMYYYYFormat('QuotationValidity');