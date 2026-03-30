var _tenantTotalTaxes = 0, _leaseAgreementTenantTaxes = [], _leaseAgreementPaymentSchedule = [], _leaseAgreementTenantTaxesDetail = [],
    _allCheckedUnitRentDetailsArray = [],
    _unitsJSONArray = [], _selectedUnitInputJSONArray = [], _selectedUnitsNoOfPayments = 0,
    _leaseAgreementPaymentScheduleHeaderTaxesJSONArray = [], _leaseAgreementPaymentScheduleAdditionalChargesJSONArray = [];
var selectedUnitsTotalRent = 0, selectedUnitsTotalSecurityDeposit = 0;
var _leaseAgreementAdditionalChargesDetail = [], _leaseAgreementAdditionalChargesArray = [];
var _totalAdditionalCharges = 0, leaseTermTotal = 0;;
var _scheduleFrequency = 0, _lastCheckedPaymentFrequencyDays = 0;
let urlArray = window.location.pathname.split('/');
var actionName = urlArray[urlArray.length - 1];
var isAdditionalChargesLoaded = false
//var action = {
//    actions: [
//        {
//            action: 'rentInvoice', text: 'Detail View', url: '/RealEstate/LeaseAgreement/Detail?ID=', isIDEncrypted: true, target: '', button: 'btn-info', icon: 'icon s7-look'
//        }
//        , {
//            action: 'rentInvoice', text: 'Rent Invoice', url: '/RealEstate/LeaseAgreement/RentInvoice?isOnlyPreview=true&id=', isIDEncrypted: false, target: '_blank', button: 'btn-primary', icon: 'icon s7-print'
//        },
//        {
//            action: 'rentInvoice', text: 'Renew Agreement', url: '/RealEstate/LeaseAgreement/Renewal?ID=', isIDEncrypted: true, target: '', button: 'btn-warning', icon: 'icon s7-shuffle'
//        }
//    ],
//    condition: {
//        key: 'Status',
//        value: 'Executed',
//        actions: [

//        ]
//    },
//    condition: {
//        key: 'Status',
//        value: 'Executed'
//    }
//}
var action = [
    {
        key: 'OnlyDelete',
        value: 'Yes',
        actions: [
            {
                action: 'rentInvoice', text: 'Detail View', url: '/RealEstate/LeaseAgreement/Detail?ID=', isIDEncrypted: true, target: '', button: 'btn-info', icon: 'icon s7-look'
            }

        ]
    },
    {
        key: 'Status',
        value: 'Executed',
        actions: [
            {
                action: 'rentInvoice', text: 'Detail View', url: '/RealEstate/LeaseAgreement/Detail?ID=', isIDEncrypted: true, target: '', button: 'btn-info', icon: 'icon s7-look'
            }
            , {
                action: 'rentInvoice', text: 'Rent Invoice', url: '/RealEstate/LeaseAgreement/RentInvoice?isOnlyPreview=true&id=', isIDEncrypted: false, target: '_blank', button: 'btn-primary', icon: 'icon s7-print'
            },
            {
                action: 'rentInvoice', text: 'Renew Agreement', url: '/RealEstate/LeaseAgreement/Renewal?ID=', isIDEncrypted: true, target: '', button: 'btn-warning', icon: 'icon s7-shuffle'
            }
        ]
    },
    {
        key: 'Status',
        value: 'Executed',
        actions: [
            {
                action: 'rentInvoice', text: 'Detail View', url: '/RealEstate/LeaseAgreement/Detail?ID=', isIDEncrypted: true, target: '', button: 'btn-info', icon: 'icon s7-look'
            }
            , {
                action: 'rentInvoice', text: 'Rent Invoice', url: '/RealEstate/LeaseAgreement/RentInvoice?isOnlyPreview=true&id=', isIDEncrypted: false, target: '_blank', button: 'btn-primary', icon: 'icon s7-print'
            },
            {
                action: 'rentInvoice', text: 'Renew Agreement', url: '/RealEstate/LeaseAgreement/Renewal?ID=', isIDEncrypted: true, target: '', button: 'btn-warning', icon: 'icon s7-shuffle'
            }
        ]
    }
]
$(document).ready(function () {
    if (actionName == 'Add' || actionName == 'Renewal') {
        getTenantTaxes();
        /* getAdditionalTaxes();*/
    }
    $('#TenantID').on('select2:select', function (e) {
        getTenantDetailByID($(this).val());

    });
    $('#PropertyID').on('select2:select', function (e) {
        ajaxRequest({ url: '/RealEstate/Unit/GetPropertyDetailByID', type: 'POST', data: { ID: $(this).val() }, callBack: getPropertyByIdCallBack });
        loadLeasableUnitByPropertyIDDropdownList('UnitID', 0, $(this).val());
        //ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyUnit]', Columns: 'ID Value, UnitNo Text', Condition: 'WHERE IsDeleted = 0 AND PropertyID =' + $('#PropertyID').val() }, callBack: loadPropertyUnitDropdownListCallBack });
    });
    
    $('#UnitID').on('select2:select', function (e) {
        var unitNo = $(this).val();
        var startDate = $("#StartDate").val();
        var endDate = $("#EndDate").val();
        if (startDate == '' || endDate == '') {
            let startDatestring = $("#StartDate").val() == '' ? 'Start Date' : '';
            let endDatestring = $("#EndDate").val() == '' ? 'End Date' : '';
            infoToastr(' ' + startDatestring + ' ' + endDatestring + ' is Required');
            $('#UnitID').val(0).change();
            return
        }
        else {
            ajaxRequest({
                url: '/RealEstate/LeaseAgreement/GetUnitActiveAgreements', type: 'POST', data: { Units: [{ ID: $(this).val() }], StartDate: $('#StartDate').val(), LeaseAgreementID: $("#ID").val() }, callBack: function (responseJSON) {


                    if (responseJSON.IsSuccess) {

                        if (responseJSON.resultJSON != null) {
                            //infoToastr('In ' + $("#UnitID option:selected").text() + ' is already associated with an AgreementNo( ' + responseJSON.resultJSON.AgreementNo + ') ', 'info');
                            let agreementNoLink = `<a href="#" onclick="redirectToAction('/RealEstate/LeaseAgreement/Detail?ID=',${responseJSON.resultJSON.ID},'_blank')">${responseJSON.resultJSON.AgreementNo}</a>`                            
                            let firstExecuteOrRemove = responseJSON.resultJSON.Status == 'Executed' ? '' : 'First execute it or remove it.';
                            let message = `Unit No (${responseJSON.resultJSON.TenancyUnitNo}) already associated with an <br/> Agreement No (${agreementNoLink})<br/>Status (${responseJSON.resultJSON.Status}).<br/>${firstExecuteOrRemove}`
                            swal.fire('', message, 'info');
                            infoToastr(`Unit No (${responseJSON.resultJSON.TenancyUnitNo}) already associated with an <br/> Agreement No (${responseJSON.resultJSON.AgreementNo}) <br/>Status (${responseJSON.resultJSON.Status}).<br/>${firstExecuteOrRemove}`, 'info');
                            $("#unitRentDetailTableContainer").css("display", "none");
                            $('#UnitID').val(0).change();

                            return

                        }
                        else {
                            //Check Unit Availbality                           
                            ajaxRequest({
                                url: '/RealEstate/LeaseAgreement/CheckUnitAvailableFrom', type: 'POST', data: { UnitIDs: [{ ID: unitNo }], StartDate: $('#StartDate').val() }, callBack: function (responseJSON) {
                                    let availableFromMessage = '';
                                    if (responseJSON.IsSuccess && responseJSON.resultJSON.length > 0) {
                                        $.each(responseJSON.resultJSON, function (rowIndex, rowValue) {
                                            let message = 'Unit (' + rowValue.UnitNo + ') is available from (' + getFormattedDate(rowValue.AvailableFrom) + ')';
                                            availableFromMessage += availableFromMessage == '' ? message : (', ' + message);
                                        });
                                        $('#errorMessage').text(availableFromMessage);
                                        $('#errorMessage').css('display', 'block');
                                        infoToastr(availableFromMessage);
                                    }

                                }
                            });
                            //End Unit Availbality
                            getUnitRentDetail(unitNo);

                        }

                    }
                }
            });


        }
    });
    $('#Status').on('select2:select', function (e) {
        if ($("#Status").val() == "Executed") {
            $('#thIsInvoiced').css('display', 'block');
            $('.tdIsInvoiced').css('display', 'block');
        }
        else {
            $('#thIsInvoiced').css('display', 'none');
            $('.tdIsInvoiced').css('display', 'none');
        }
    });
    $("#btnNewLeaseAgreement").on("click", function () {
        clearFormFields();
        getNumber();
    });
    $('#btnAddRowToTblQuotation').on('click', function (e) {
        e.preventDefault();
        _currentCheckedUnitRentDetailsArray = [];
        var currentAddedRentDetailForPropertyAndUnit = [];
        //if ($('#CurrencyID').val() == 0) {
        //    swal.fire('', 'Currency is required', 'info');
        //    return;
        //}
        var isDuplicateUnitFoundInAgreement = false;
        _unitsJSONArray = [];
        _selectedUnitInputJSONArray = [];
        // Loop through each row in the table (except the header row)    
        var addRentDetailForPropertyAndUnit = [],
            currentAddedRentDetailForPropertyAndUnit = [];
        $('#unitRentDetailTable tbody tr').each(function (unitRentDetailTableRowIndex, unitRentDetailTableRowValue) {
            currentCheckedUnitRentDetailsObject = {};
            var isCheckedBox = $(this).find('td').find('input:checkbox#unitRentDetailTabletdCheckbox' + unitRentDetailTableRowIndex + '').is(':checked'); //$('#tdCheckbox' + rowIndexEachLoop + '').prop('checked');        
            if (isCheckedBox) {
                currentCheckedUnitRentDetailsObject['ID'] = 0;// $(this).find('td.tdID').text();
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

                currentCheckedUnitRentDetailsObject['FrequencyDays'] = $(this).find('td.tdFrequencyDays').text();
                currentCheckedUnitRentDetailsObject['CurrencyID'] = $(this).find('td.tdCurrencyID').text();
                currentCheckedUnitRentDetailsObject['Currency'] = $(this).find('td.tdCurrency').text();


                currentCheckedUnitRentDetailsObject['UnitType'] = $('#txtUnitType').val();
                currentCheckedUnitRentDetailsObject['Description'] = $('#txtDescription').val();
                currentCheckedUnitRentDetailsObject['Rent'] = $('#txtRent').val();
                //currentCheckedUnitRentDetailsObject['CurrencyID'] = $('#CurrencyID').val();
                currentCheckedUnitRentDetailsObject['Frequency'] = $('#txtFrequency').val();
                if (actionName == 'Renewal') {
                    currentCheckedUnitRentDetailsObject['UnitID'] = $(this).find('td.tdUnitID').text();
                    currentCheckedUnitRentDetailsObject['UnitName'] = $(this).find('td.tdUnitName').text();
                    currentCheckedUnitRentDetailsObject['PropertyID'] = $(this).find('td.tdPropertyID').text();
                    currentCheckedUnitRentDetailsObject['PropertyName'] = $(this).find('td.tdPropertyName').text();
                }
                else {
                    currentCheckedUnitRentDetailsObject['UnitID'] = $(this).find('td.tdUnitID').text();
                    currentCheckedUnitRentDetailsObject['PropertyID'] = $('#PropertyID').val();
                    currentCheckedUnitRentDetailsObject['PropertyName'] = $('#PropertyID option:selected').text();
                    currentCheckedUnitRentDetailsObject['UnitID'] = $('#UnitID').val();
                    currentCheckedUnitRentDetailsObject['UnitName'] = $('#UnitID option:selected').text();
                }
                _currentCheckedUnitRentDetailsArray.push(currentCheckedUnitRentDetailsObject);

                //check for duplicate unit. in agreement multiple unit can't be added
                addRentDetailForPropertyAndUnit = [];
                currentAddedRentDetailForPropertyAndUnit = [];
                if (actionName == 'Renewal') {
                    addRentDetailForPropertyAndUnit = _allCheckedUnitRentDetailsArray.filter(row => row.UnitID == currentCheckedUnitRentDetailsObject.UnitID)
                    currentAddedRentDetailForPropertyAndUnit = _currentCheckedUnitRentDetailsArray.filter(row => row.UnitID == currentCheckedUnitRentDetailsObject.UnitID)
                }
                else {
                    addRentDetailForPropertyAndUnit = _allCheckedUnitRentDetailsArray.filter(row => row.UnitID == $('#UnitID').val())
                    currentAddedRentDetailForPropertyAndUnit = _currentCheckedUnitRentDetailsArray.filter(row => row.UnitID == $('#UnitID').val())
                }


                if (addRentDetailForPropertyAndUnit.length > 0) {
                    isDuplicateUnitFoundInAgreement = true;
                    return;
                }
            }

        });
        if (_currentCheckedUnitRentDetailsArray.length == 0) {
            infoToastr('One lease term should be selected for the unit', 'info');

        }
        else {


            if (currentAddedRentDetailForPropertyAndUnit.length > 1) {
                var paymentFrequencies = '';
                let unitNo = '';
                $.each(currentAddedRentDetailForPropertyAndUnit, function (rowIndex, rowValue) {
                    paymentFrequencies = (paymentFrequencies == '' ? rowValue.PaymentFrequencyName : (paymentFrequencies + ', ' + rowValue.PaymentFrequencyName))
                    unitNo = (unitNo == '' ? rowValue.UnitName : (unitNo + ', ' + rowValue.UnitName));
                })
                //$('#UnitID option:selected').text()
                infoToastr('Can not add Unit (' + unitNo + ') with multiple lease terms(' + paymentFrequencies + ')', 'info');
            }
            else if (!isDuplicateUnitFoundInAgreement) {
                if (_currentCheckedUnitRentDetailsArray.length > 0) {
                    $.each(_currentCheckedUnitRentDetailsArray, function (rowIndex, rowItem) {
                        rowItem['Property'] = $('#PropertyID option:selected').text();
                        rowItem['Unit'] = $('#UnitID option:selected').text();
                        _allCheckedUnitRentDetailsArray.push(rowItem);
                    })
                    generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'unitPaymentTermDetailTable', null, null, null, 0, 'rentDetailcheckBoxClicked', ["Amount", "SecurityDepositAmount"], action);
                    $('#unitPaymentTermDetailTableContainer').css('display', '');
                    $('.TaxesWithChargesContainer ').removeClass('d-none');
                    $('#paymentScheduleAndTotalAmountsContainer').css('display', 'none');
                }
                _quotationRentDetailsSetterArray = [];
                $('#unitRentDetailTableContainer').css('display', 'none');
                $('#btnAddRowToTblQuotation').css('display', 'none');
                $('#PropertyID').val(0).change();
                $('#UnitID').val(0).change();
                //$('#CurrencyID').val(0).change();
                _selectedUnitsNoOfPayments = 0;
            }
            else {
                infoToastr('Payment detail already exist for Property(' + $('#PropertyID option:selected').text() + ') and Unit No(' + $('#UnitID option:selected').text() + ')', 'info');
            }
        }

        ////Additional modal button click event
        // $('#btnAdditionalCharges').click(function () {
        //     $('#modalAdditionalCharges').modal('show');
        //     loadTableData();
        // });
    });

    $('#NoOfPayments').on('input', function (event) {      
        /*
        let totalCheckedRows = 0, _scheduleFrequency = 1;       
        $('#unitPaymentTermDetailTable tr').each(function (rowIndex) {
            if (rowIndex > 0) {                
                var istblQuotationDataCheckboxChecked = $('#unitPaymentTermDetailTabletdCheckbox' + (rowIndex - 1) + '').is(':checked');

                if (istblQuotationDataCheckboxChecked) {
                    totalCheckedRows += 1;
                    if (totalCheckedRows <= 1) {
                        //| Schedule Frequency Calc
                        _scheduleFrequency = ($(this).find('td.tdFrequencyDays').text() == null ? 0 : $(this).find('td.tdFrequencyDays').text());
                        if (_scheduleFrequency > 0) {
                            if (_scheduleFrequency <= 30) {
                                _scheduleFrequency = 1;
                            }
                            else {
                                _scheduleFrequency = (_scheduleFrequency / 30);
                                //for (let count = 1; count <= schedule; count++) {
                                //    console.log(rowItem.FrequencyDays + ' | ' + schedule);
                                //}
                            }
                        }
                    }
                    //| Schedule Frequency Calc Ends
                }
            }
        });
        */
        renderNoOfPaymentsChequeHTML(this.value, true, _lastCheckedPaymentFrequencyDays, _leaseAgreementAdditionalChargesArray);
    });

    //|button click events
    $('#btnPreviewLeaseTermTemplate').click(function () {
        if ($('#LeaseTermTemplateID').val() == 0 || $('#LeaseTermTemplateID').val() == null) {
            infoToastr('Select Lease Term to Preview', 'info');
        }
        else {
            window.open('/RealEstate/LeaseTemplate/Preview?isOnlyPreview=true&id=' + $('#LeaseTermTemplateID').val(), '_blank');
        }
    });
    $('#btnSave').click(function () {
        if ($("#Status").val() == "Executed") {
            swal.fire({
                title: "Confirmation",
                text: 'Do you want to execute the agreement ?',
                type: 'info',
                cancelButtonColor: '#F04249',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                dangerMode: true,
            }).then((result) => {
                if (result.value) {
                    saveRecord(false, false);
                }
                else {
                }
            });
        }
        else {
            saveRecord(false, false);
        }
    });
    $('#btnPreviewLeaseAgreement').click(function () {
        saveRecord(true, false);
    });
    $('#btnCloseLeaseAgreement').on("click", function () {
        $('#btnCloseLeaseAgreement').prop('disabled', true);
        if ($('#StartDate').val() != null) {
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
                    saveRecord(false, true);
                }
                else {
                    window.location.href = '/RealEstate/LeaseAgreement/List?FID=c2atQ5gwflXzP8Gc5wiG4Q==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
                }
            });
        }
        else {
            window.location.href = '/RealEstate/LeaseAgreement/List?FID=c2atQ5gwflXzP8Gc5wiG4Q==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
        }
    });
    // Form Quotation close Button
    $('#btnCloseLeaseAgreementFromquotation').on("click", function () {
        /* $('#btnCloseLeaseAgreement').prop('disabled', true);*/
        if ($('#StartDate').val() != null) {
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
                    saveRecord(false, true);
                }
                else {
                    window.location.href = '/RealEstate/Quotation/List?FID=EtQNQJ3CKGJfuJZpUYsrUg==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==#';
                    //window.location.href = '/RealEstate/LeaseAgreement/List?FID=c2atQ5gwflXzP8Gc5wiG4Q==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
                }
            });
        }
        else {
            window.location.href = '/RealEstate/Quotation/List?FID=EtQNQJ3CKGJfuJZpUYsrUg==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==#';
        }
    });

    // End 

    $('#btnGenerateProformaInvoice').click(function (event) {
        event.preventDefault();
        saveRecord(true, false, true);
    });
    //|button click events end

    $('#ChequesAknowledgmentReceipt').click(function (event) {
        saveRecord(false, false, false, true);
    });
    $('#btnModifyLeaseTemplate').click(function () {
        if ($('#LeaseTermTemplateID').val() > 0) {
            let leaseTemplateID = $('#LeaseTermTemplateID').val();
            $('#LeaseTermTemplateID').val(0).change();
            ajaxRequest({
                url: '/CoreSuite/Encrypt/', type: 'POST', data: { ID: 10 }, callBack: function (response) {
                    redirectToAction("/RealEstate/LeaseTemplate/Update?AgreementID='" + response + "'&ID=", leaseTemplateID, '_blank');
                }
            });

        }
        else {
            infoToastr('First select a lease template to modify', 'Info');
        }
    })
    $('#btnRefreshLeaseTemplates').click(function () {
        loadLeaseTermTemplateAgreementDropdownList('LeaseTermTemplateID', 0);
        infoToastr('Lease templates refreshed', 'Info');
    });
});

function getNumber() {
    ajaxRequest({ url: '/RealEstate/LeaseAgreement/GetNumber', type: 'POST', data: {}, callBack: getNumberCallBack }, null, false);
}
var getNumberCallBack = function (responseJSON) {
    $('#unitPaymentTermDetailTableContainer').css('display', 'none');
    $('.TaxesWithChargesContainer ').addClass('d-none');
    if (responseJSON.IsSuccess) {
        $('#AgreementNo').val(responseJSON.resultJSON.Number);
        $('#AgreementNo').prop('readonly', true);
    }
    else {
        $('#AgreementNo').prop('readonly', false);
    }
}
//get tenant detail by tenant id
function getTenantDetailByID(tenantID = 0) {
    if (tenantID) {
        ajaxRequest({ url: '/RealEstate/Tenant/GetTenantById', type: 'POST', data: { ID: tenantID }, callBack: getTenantDetailByIDCallBack });
    }
}
var getTenantDetailByIDCallBack = function (responseJSON) {
    if (responseJSON.resultJSON != null) {
        $('#Email').val(responseJSON.resultJSON.Email);
        $('#PrimaryMobileNo').val(responseJSON.resultJSON.PrimaryMobileNo);
        $('#SecondaryMobileNo').val(responseJSON.resultJSON.SecondaryMobileNo);
    }
}
//get property detail by property id
var getPropertyByIdCallBack = function (responseJSON) {
    setResponseToFormInputs(responseJSON.resultJSON);
}

//get unit rent detail by unit id
function getUnitRentDetail(unitID) {

    ajaxRequest({ url: '/RealEstate/Unit/GetUnitRentDetailById', type: 'POST', data: { unitID: unitID }, callBack: getUnitRentDetailCallBack });
}
var getUnitRentDetailCallBack = function (responseJOSN) {
    if (responseJOSN.IsSuccess) {
        generateHTMLTableRowsFromJSONWithCheckbox(responseJOSN.resultJSON, 'unitRentDetailTable', null, null, 0, 0, null, ["Amount", "SecurityDepositAmount"]);
        _unitRentDetailsArray = responseJOSN.resultJSON;
        selectedUnitsTotalRent = 0;
        selectedUnitsTotalSecurityDeposit = 0;
        $('#unitRentDetailTableContainer').css('display', '');
        $('#btnAddRowToTblQuotation').css('display', '');
    }
    else {
        $('#unitRentDetailTableContainer').css('display', 'none');
        $('#btnAddRowToTblQuotation').css('display', 'none');
        errorToastr(responseJSON.Message, "error");
    }
}
function checkBoxClicked(requestFrom, rowIndex, rowItem) {
}
var rentDetailcheckBoxClicked = function (requestFrom, rowIndex, rowItem) {
    let checkBoxIdAttr = '#unitPaymentTermDetailTabletdCheckbox' + $(requestFrom).closest('tr').index();
    var startdate = $('#StartDate').val();
    if (startdate === null || startdate === "") {
        infoToastr("First enter agreement start date", 'info');
        $(checkBoxIdAttr).prop('checked', false);
        return
    } else {


        let newIndex = $(requestFrom).closest('tr').index(); // rowIndex + 1;
        _unitRentDetailsArray = [];
        _unitRentDetailsArray.push(rowItem);
        var noOfPayments = $('#unitPaymentTermDetailTable tbody  tr:eq(' + newIndex + ')').find('td.tdNoOfPayments').text();
        noOfPayments = noOfPayments == '' ? 0 : noOfPayments;
        var isSelected = $('#unitPaymentTermDetailTabletdCheckbox' + rowIndex + '').is(':checked');
        if (isSelected) {
            _selectedUnitsNoOfPayments += parseInt(noOfPayments);

            var frequencyDays = $('#unitPaymentTermDetailTable tbody  tr:eq(' + newIndex + ')').find('td.tdFrequencyDays').text();

            _unitsJSONArray.push(rowItem.UnitID);
        }
        else {
            _selectedUnitsNoOfPayments -= parseInt(noOfPayments);
            _selectedUnitsNoOfPayments = _selectedUnitsNoOfPayments < 0 ? 0 : _selectedUnitsNoOfPayments;
            var index = _unitsJSONArray.indexOf(rowItem.UnitID);
            _unitsJSONArray.splice(index, 1);
        }
        _selectedUnitInputJSONArray = [];
        $.each(_unitsJSONArray, function (unitsIndex, unitsValue) {
            _selectedUnitInputJSONArray.push({ 'ID': unitsValue });
        });
        $('#NoOfPayments').val(_selectedUnitsNoOfPayments);

        $('#paymentScheduleAndTotalAmountsContainer').css('display', '');
        $('.TaxesWithChargesContainer').removeClass('d-none');




        //| Schedule Frequency Calc

        //| Schedule Frequency Calc Ends

        //unCheckAllOtherCheckBoxes(rowIndex);
        leaseTermCalculation(isSelected, rowItem);
        _lastCheckedPaymentFrequencyDays = parseInt(rowItem.FrequencyDays);
        renderNoOfPaymentsChequeHTML(_selectedUnitsNoOfPayments, false, _lastCheckedPaymentFrequencyDays, _leaseAgreementAdditionalChargesArray);


        if (_unitsJSONArray.length <= 0) {
            $('#paymentScheduleAndTotalAmountsContainer').css('display', 'none');
            $('.TaxesWithChargesContainer').addClass('d-none');
        }
    }
}
var leaseTermCalculation = function (isSelected, rowItem) {
    if (isSelected) {
        selectedUnitsTotalRent = parseFloat(selectedUnitsTotalRent) + parseFloat(rowItem.Amount);
        selectedUnitsTotalSecurityDeposit += parseFloat(rowItem.SecurityDepositAmount);
    }
    else {
        selectedUnitsTotalRent -= parseFloat(rowItem.Amount);
        selectedUnitsTotalRent = selectedUnitsTotalRent < 0 ? 0 : selectedUnitsTotalRent;
        selectedUnitsTotalSecurityDeposit -= parseFloat(rowItem.SecurityDepositAmount);
        selectedUnitsTotalSecurityDeposit = selectedUnitsTotalSecurityDeposit < 0 ? 0 : selectedUnitsTotalSecurityDeposit;
    }
    $('#additionalTaxesContainer').html('');
    //$('#additionalAmountContainer').html('');
    $('#tenantTaxesContainer').html('');
    $('#lblLeaseTermRent').val(addThousandSeperator(selectedUnitsTotalRent));
    $('#lblLeaseTermSecurityDeposit').val(addThousandSeperator(selectedUnitsTotalSecurityDeposit));
    _tenantTotalTaxes = 0;
    _leaseAgreementPaymentScheduleHeaderTaxesJSONArray = [];
    _leaseAgreementPaymentScheduleAdditionalTaxesJSONArray = [];
    _leaseAgreementTenantTaxes = [];
    // _leaseAgreementAdditionalChargesArray = [];

    /* Moved to function and commented here by Shahid 16Nov23 at 6:30pm

    $.each(_leaseAgreementTenantTaxesDetail, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
        var taxPercentTotal = ((parseFloat(selectedUnitsTotalRent) * parseFloat(rowItemTenantTaxex.Rate)) / 100);
        _tenantTotalTaxes += taxPercentTotal;

        _leaseAgreementTenantTaxes.push({
            ID: 0,
            LeaseAgreementID: 0,
            PropertyTaxSetupID: rowItemTenantTaxex.ID,
            AccountHeadID: rowItemTenantTaxex.AccountHeadID,
            Amount: taxPercentTotal
        });
        $('#tenantTaxesContainer').append(`<div class="row">
                                               <label class="text-black-50 ml-3">` + rowItemTenantTaxex.Code + `(` + rowItemTenantTaxex.Rate + `%): <span>` + addThousandSeperator(taxPercentTotal) + `</span></label>
                               
                                           </div>`);
       
        var leaseAgreementPaymentScheduleHeaderTaxesJSONObject = {};
        leaseAgreementPaymentScheduleHeaderTaxesJSONObject['Code'] = rowItemTenantTaxex.Code;
        leaseAgreementPaymentScheduleHeaderTaxesJSONObject['Total'] = taxPercentTotal;
        leaseAgreementPaymentScheduleHeaderTaxesJSONObject['Rate'] = parseFloat(rowItemTenantTaxex.Rate);//;
        _leaseAgreementPaymentScheduleHeaderTaxesJSONArray.push(leaseAgreementPaymentScheduleHeaderTaxesJSONObject);
    });
    var totalAmount = parseFloat(selectedUnitsTotalRent) + parseFloat(selectedUnitsTotalSecurityDeposit) + parseFloat(_tenantTotalTaxes)

    */
    var totalAmount = totalFromRentSecurityTaxes();
    //var _totalAdditionalCharges = additionalChargesTotalAndDesignGeneration();
    leaseTermTotal = totalAmount;

    //totalAmount = totalAmount + _totalAdditionalCharges

    $('#lblLeaseTermTotal').text(addThousandSeperator(totalAmount));
    $('#TotalAmount').val(totalAmount);
}
var renderNoOfPaymentsChequeHTML = function (noOfPayments, isFromInput = false, scheduleFrequency = 0, _leaseAgreementAdditionalChargesArray) {    
    _selectedUnitsNoOfPayments = noOfPayments;
    $('#paymentScheduleTable tbody').html('');
    var description = '', netTotal = 0;
    _leaseAgreementPaymentSchedule = [];

    //| After New Design Commented below line
    //var scheduleFrequencyDate = $('#StartDate').datepicker('getDate');//new Date();

    //| In New Design wrote this code
    const dateParts = $('#StartDate').val().split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    var scheduleFrequencyDate = new Date(formattedDate);//.datepicker('getDate');//new Date();
    //| In New Design wrote this code
    var rentPerCheque = (selectedUnitsTotalRent / parseFloat(noOfPayments));
    let isPaymentFrequencyWeekly = false;
    if (scheduleFrequency > 0) {
        if (scheduleFrequency < 30) {
            _scheduleFrequency = scheduleFrequency;
            isPaymentFrequencyWeekly = true;
        }
        else if (scheduleFrequency > 7 && scheduleFrequency <= 31) {
            _scheduleFrequency = 1;
        }
        else {
            _scheduleFrequency = (scheduleFrequency / 30);
        }
    }


    for (let count = 1; count <= noOfPayments; count++) {

        //var day = $('#StartDate').datepicker('getDate');
        let scheduleFrequencyDateVal = ('0' + scheduleFrequencyDate.getDate()).slice(-2) + "-" + ('0' + (scheduleFrequencyDate.getMonth() + 1)).slice(-2) + "-" + scheduleFrequencyDate.getFullYear();
        let perChequeTotal = rentPerCheque + (count == 1 ? selectedUnitsTotalSecurityDeposit : 0);
        var tr = `
        <tr>
            <td class="tdSN">`+ count + `</td>
            <td class="tdID" hidden>0</td>            
            <td class="tdChequeNo"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px ChequeNo"/></div></td>
            <td class="tdChequeDate"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px ChequeDate" value="`+ scheduleFrequencyDateVal + `"/></div></td>
           <td class="tdRent text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end keyUpEventClassForPaymentSchedule" value="`+ addThousandSeperator(rentPerCheque) + `"
           onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
           /></div></td>
           <td class="tdSecurityDeposit text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end keyUpEventClassForPaymentSchedule" value="`+ (count == 1 ? addThousandSeperator(selectedUnitsTotalSecurityDeposit) : 0) + `"
           onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
           /></div></td>
                     
        `;

        $.each(_leaseAgreementTenantTaxesDetail, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
            var taxOnRentPerCheque = (rentPerCheque * parseFloat(rowItemTenantTaxex.Rate) / 100);
            ///tr += `<td class="td` + rowItemTenantTaxex.Code.replace(' ', '_') + ` text-end pr-4">` + addThousandSeperator(taxOnRentPerCheque) + `</td >`;
            //
            tr += `<td class="td` + rowItemTenantTaxex.Code.replace(/\s/g, '_') + ` text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end keyUpEventClassForPaymentScheduleTaxesReCalculation" value="` + addThousandSeperator(taxOnRentPerCheque) + `"
                    onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                    /></div></td >`;
            perChequeTotal += taxOnRentPerCheque;
        });

        /*  $.each(_leaseAgreementAdditionalChargesDetail, function (rowAdditionalChargeIndex, rowAdditionalCharge) {*/             

        $.each(_leaseAgreementAdditionalChargesArray, function (rowAdditionalChargeIndex, rowAdditionalCharge) {           
            var additionalTaxes = 0;
            var additionalAmount = 0;
            var additionalTaxOnPerCheque = 0;
            if (rowAdditionalCharge.IsRecoverInFirstCheque === 'Yes') {

                if (count == 1) {
                    additionalTaxes = (parseFloat(rowAdditionalCharge.Amount) * parseFloat(rowAdditionalCharge.TaxRate) / 100);
                    additionalAmount = (parseFloat(rowAdditionalCharge.Amount) + parseFloat(additionalTaxes));                 
                    additionalTaxOnPerCheque = additionalAmount;
                }

            }
            else {
                additionalTaxes = (parseFloat(rowAdditionalCharge.Amount) * parseFloat(rowAdditionalCharge.TaxRate) / 100);
                additionalAmount = (parseFloat(rowAdditionalCharge.Amount) + parseFloat(additionalTaxes));
                additionalTaxOnPerCheque = (additionalAmount / noOfPayments);
            }

            //var additionalTaxes = (parseFloat(rowAdditionalCharge.Amount) * parseFloat(rowAdditionalCharge.TaxRate) / 100);
            //var additionalAmount = (parseFloat(rowAdditionalCharge.Amount) + parseFloat(additionalTaxes));
            //var additionalTaxOnPerCheque = (additionalAmount / noOfPayments);
            //tr += `<td class="td` + rowAdditionalCharge.Name.replace(' ', '_') + ` text-end pr-4">` + addThousandSeperator(additionalTaxOnPerCheque) + `</td>`;
            tr += `<td class="td` + rowAdditionalCharge.Name.replace(/\s/g, '_') + ` text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end" value="` + addThousandSeperator(additionalTaxOnPerCheque) + `" onkeyup="paymentScheduleAdditionalChargesReCalculation(this,` + rowAdditionalChargeIndex + `);"
                    onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                    /></div></td >`;
            perChequeTotal += additionalTaxOnPerCheque;
        });

        tr += `<td class="tdTotal text-end pr-4 fw-medium">` + addThousandSeperator(perChequeTotal) + `</td>`;
        netTotal = netTotal + perChequeTotal;


        //Invoice Checkbox
        //tr += '<td class="tdIsInvoiced" style="display:none;"><input type="checkbox" class="form-control-sm custom-control-sm"></td>'
        tr += ($('#Status').val() === 'Executed' ? '<td class="tdIsInvoiced"><input type="checkbox" class="form-control-sm custom-control-sm"></td>' : '<td class="tdIsInvoiced" style="display:none;"><input type="checkbox" class="form-control-sm custom-control-sm"></td>')
        tr += '</tr>'

        $('#paymentScheduleTable tbody').append(tr);


        //Total Calc

        //$('#paymentScheduleTable tbody').append(tr);
        //$('#paymentScheduleTable tbody').append(totalTrTable);
        //$('#paymentScheduleTableTotals tbody').html('');
        //$('#paymentScheduleTableTotals tbody').append(tr);

        _leaseAgreementPaymentSchedule.push({
            ID: 0
            , Description: description
            , ChequeDate: scheduleFrequencyDateVal
            , ChequeNo: null
            , ChequeAmount: 0
            , ChequeReceiving: null


        });
        //
        if (isPaymentFrequencyWeekly)
            scheduleFrequencyDate = new Date(scheduleFrequencyDate.setDate(scheduleFrequencyDate.getDate() + _scheduleFrequency));
        else
            scheduleFrequencyDate = new Date(scheduleFrequencyDate.setMonth(scheduleFrequencyDate.getMonth() + _scheduleFrequency));


    }
    addTotalRowToThePaymentSchedule(selectedUnitsTotalRent, selectedUnitsTotalSecurityDeposit, _leaseAgreementAdditionalChargesArray, _leaseAgreementTenantTaxesDetail);


    $('#lblPaymentScheduleTotal').text(addThousandSeperator(netTotal));
    $('#lblLeaseTermTotal').text(addThousandSeperator(netTotal));
    if (isFromInput) {
        $('#unitRentDetailTable tr').each(function (rowIndex) {
            var isChecked = $($(this).find('td.tdCheckbox').find('input')).is(":checked");
            if (isChecked) {
                $(this).find('td.tdNoOfPayments').text(noOfPayments);
                _unitRentDetailsArray[0].NoOfPayments = noOfPayments;
            }
        });
    }
}
var amendPaymentScheduleTable = function (paymentScheduleArray = []) {
    let netTotal = 0, allRowAdditionalChargesArray = [], allRowTaxesArray = [];

    let thiss = this.event;

    $('#NoOfPayments').val(paymentScheduleArray.length);
    _selectedUnitsNoOfPayments = paymentScheduleArray.length;
    $('#paymentScheduleAndTotalAmountsContainer').css('display', '');
    $('#paymentScheduleTable tbody').html('');
    $.each(paymentScheduleArray, function (rowIndex, rowItem) {

        var tr = `
        <tr>
            <td class="tdSN">`+ (rowIndex + 1) + `</td>
            <td class="tdID" hidden>`+ rowItem.ID + `</td>            
            <td class="tdChequeNo"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px ChequeNo" value="`+ (rowItem.ChequeNo == null ? '' : rowItem.ChequeNo) + `"/></div></td>
            <td class="tdChequeDate"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px ChequeDate" value="`+ (rowItem.ChequeDate == null ? '' : rowItem.ChequeDate) + `"/></div></td>
            <td class="tdRent text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end keyUpEventClassForPaymentSchedule" value="`+ addThousandSeperator(rowItem.Rent) + `"
            onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
            /></div></td>
           <td class="tdSecurityDeposit text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end keyUpEventClassForPaymentSchedule" value="`+ addThousandSeperator(rowItem.SecurityDeposit) + `"
           onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
           /></div></td>`

        var taxesArray = JSON.parse(rowItem.Taxes);
        //additional array varaible
        additionalArray = JSON.parse(rowItem.Charges);
        $.each(taxesArray, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
            for (var key in rowItemTenantTaxex) {
                //tr += `<td class="td` + key.replace(' ', '_') + ` text-end pr-4">` +(rowItemTenantTaxex[key]) + `</td>`;

                tr += `<td class="td` + key.replace(/\s/g, '_') + ` text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end" value="` + (rowItemTenantTaxex[key]) + `" onkeyup="paymentScheduleTaxesReCalculation(this,` + rowIndex + `);"
                        onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                        /></div></td>`;
            }
        });      


        //Additional Charge Old Code
        $.each(additionalArray, function (rowIndexAdditionalCharge, rowItemAdditionalCharge) {
            for (var key in rowItemAdditionalCharge) {
                //tr += `<td class="td` + key.replace(' ','_') + ` text-end pr-4">` + addThousandSeperator(rowItemAdditionalCharge[key]) + `</td>`;
                tr += `<td class="td` + key.replace(/\s/g, '_') + ` text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end" value="` + (addThousandSeperator(rowItemAdditionalCharge[key])) + `" onkeyup="paymentScheduleAdditionalChargesReCalculation(this,` + rowIndex + `);"
                onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                /></div></td>`;
            }
        });
        //End Of Additional Charges 

        tr += `<td class="tdTotal text-end pr-4 fw-medium">` + addThousandSeperator(rowItem.Total) + `</td>`;

        // Invoice Checkbox
        //tr += '<td class="tdIsInvoiced" style="display:none;"><input type="checkbox" class="form-control-sm custom-control-sm"></td>'
        tr += ($('#Status').val() === 'Executed' ? '<td class="tdIsInvoiced"><input type="checkbox" class="form-check-input" style="font-size: 16px;" /></td>' : '<td class="tdIsInvoiced" style="display:none;"><input type="checkbox" class="form-control-sm custom-control-sm"></td>')
        tr += '</tr>'
        $('#paymentScheduleTable tbody').append(tr);
        netTotal = (netTotal + rowItem.Total);
    });
    $('#lblPaymentScheduleTotal').text(addThousandSeperator(netTotal));
    $('#lblLeaseTermTotal').text(addThousandSeperator(netTotal));

}
var unCheckAllOtherCheckBoxes = function (rowIndex) {
    //$('#unitRentDetailTable tr').each(function (rowIndexEachLoop, rowValue) {
    //    if (rowIndex == rowIndexEachLoop) {
    //        let a = 'a';
    //    }
    //    else {
    //        $('#tdCheckbox' + rowIndexEachLoop + '').prop('checked', false);
    //    }
    //});
}

function totalFromRentSecurityTaxes() {
    //
    _tenantTotalTaxes = 0;
    $('#tenantTaxesContainer').html('');
    selectedUnitsTotalRent = removeAllCommas(($('#lblLeaseTermRent').val() == '' ? 0 : $('#lblLeaseTermRent').val()));
    //selectedUnitsTotalSecurityDeposit = removeAllCommas(($('#lblLeaseTermSecurityDeposit').val() == '' ? 0 : $('#lblLeaseTermSecurityDeposit').val()));
    _leaseAgreementPaymentScheduleHeaderTaxesJSONArray = [];
    _leaseAgreementTenantTaxes = [];
    $.each(_leaseAgreementTenantTaxesDetail, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
        var taxPercentTotal = ((parseFloat(selectedUnitsTotalRent) * parseFloat(rowItemTenantTaxex.Rate)) / 100);
        _tenantTotalTaxes += taxPercentTotal;

        _leaseAgreementTenantTaxes.push({
            ID: 0,
            LeaseAgreementID: 0,
            PropertyTaxSetupID: rowItemTenantTaxex.ID,
            AccountHeadID: rowItemTenantTaxex.AccountHeadID,
            Rate: rowItemTenantTaxex.Rate,
            Amount: taxPercentTotal
        });
        /*
        $('#tenantTaxesContainer').append(`<div class="row">
                                               <label class="text-black-50 ml-3">` + rowItemTenantTaxex.Code + `(` + rowItemTenantTaxex.Rate + `%): <span>` + addThousandSeperator(taxPercentTotal) + `</span></label>
                               
                                           </div>`);
        */
        $('#tenantTaxesContainer').append(`<div class="badge rounded-pill bg-success ps-3 pe-3 me-2" style="color:#fff;z-index:2;padding:5px 0;">
           ` + rowItemTenantTaxex.Code + `(` + rowItemTenantTaxex.Rate + `%): <span>` + addThousandSeperator(taxPercentTotal) + `</span>
         </div>`);
        

        var leaseAgreementPaymentScheduleHeaderTaxesJSONObject = {};
        leaseAgreementPaymentScheduleHeaderTaxesJSONObject['Code'] = rowItemTenantTaxex.Code;
        leaseAgreementPaymentScheduleHeaderTaxesJSONObject['Total'] = taxPercentTotal;
        leaseAgreementPaymentScheduleHeaderTaxesJSONObject['Rate'] = parseFloat(rowItemTenantTaxex.Rate);//;
        leaseAgreementPaymentScheduleHeaderTaxesJSONObject['ShowOnReportTable'] = rowItemTenantTaxex.ShowOnReportTable;
                
        _leaseAgreementPaymentScheduleHeaderTaxesJSONArray.push(leaseAgreementPaymentScheduleHeaderTaxesJSONObject);
    });
    var totalAmount = parseFloat(selectedUnitsTotalRent) + parseFloat(selectedUnitsTotalSecurityDeposit) + parseFloat(_tenantTotalTaxes)
    return totalAmount;
}
function additionalChargesTotalAndDesignGeneration(additionalChargesArray) {

    //additional Array Loop
    var tr = 0;
    _totalAdditionalCharges = 0;
    _leaseAgreementPaymentScheduleAdditionalChargesJSONArray = [];
    //_leaseAgreementAdditionalChargesArray = [];
    //$('#additionalTaxesContainer').html('');
    $.each(additionalChargesArray, function (rowIndexAdditionalCharges, rowItemAdditionalCharges) {
        //console.log(rowItemAdditionalCharges.Name);
        var taxAdditionalPercentTotal = ((parseFloat(rowItemAdditionalCharges.Amount) * parseFloat(rowItemAdditionalCharges.TaxRate)) / 100);
        var additionalTotalCharge = ((parseFloat(taxAdditionalPercentTotal) + parseFloat(rowItemAdditionalCharges.Amount)));
        //var taxAdditionalAmountPercentTotal = ((parseFloat(additionalTotalCharge)));

        _totalAdditionalCharges += additionalTotalCharge;// + taxAdditionalAmountPercentTotal;


        //_leaseAgreementAdditionalChargesArray.push({
        //    ID: 0,
        //    AdditionalChargesID: rowItemAdditionalCharges.ID,
        //    Name: rowItemAdditionalCharges.Name,
        //    Amount: rowItemAdditionalCharges.Amount,
        //    TaxRate: rowItemAdditionalCharges.TaxRate,
        //    TotalAmount: additionalTotalCharge
        //});

        tr += `<tr>
       
        <td class="text-black-50">`+ rowItemAdditionalCharges.Name + `</td>
        <td class="text-black-50">`+ rowItemAdditionalCharges.Amount + `</td>
        <td  class="text-black-50">`+ rowItemAdditionalCharges.TaxRate + `</td>
        <td  class="text-black-50">`+ additionalTotalCharge + `</td>
          </tr>
        `

        //$('#additionalTaxesContainer').append(`<div class="row">
        //                                       <label class="text-black-50 ml-3">` + rowItemAdditionalCharges.Name + `(` + rowItemAdditionalCharges.TaxRate + `%): <span>` + addThousandSeperator(taxAdditionalPercentTotal) + `</span></label>

        //                                   </div>`);
        //$('#additionalAmountContainer').append(`<div class="row">
        //                                       <label class="text-black-50 ml-3">` + rowItemAdditionalCharges.Amount + `(` + rowItemAdditionalCharges.TaxRate + `%): <span>` + addThousandSeperator(taxAdditionalAmountPercentTotal) + `</span></label>

        //                                   </div>`);
        var leaseAgreementPaymentScheduleAdditionalChargesJSONArrayJSONObject = {};
        leaseAgreementPaymentScheduleAdditionalChargesJSONArrayJSONObject['Name'] = rowItemAdditionalCharges.Name;
        leaseAgreementPaymentScheduleAdditionalChargesJSONArrayJSONObject['Total'] = taxAdditionalPercentTotal;
        leaseAgreementPaymentScheduleAdditionalChargesJSONArrayJSONObject['TaxRate'] = parseFloat(rowItemAdditionalCharges.TaxRate);//;
        leaseAgreementPaymentScheduleAdditionalChargesJSONArrayJSONObject['Amount'] = parseFloat(rowItemAdditionalCharges.Amount);
        _leaseAgreementPaymentScheduleAdditionalChargesJSONArray.push(leaseAgreementPaymentScheduleAdditionalChargesJSONArrayJSONObject);
    });
    $('#additionalAmountContainer tbody').html(tr);
    //leaseTermTotal += _totalAdditionalCharges;
    // $('#lblLeaseTermTotal').text(addThousandSeperator(_totalAdditionalCharges));
    return _totalAdditionalCharges;
}
function generatePaymentScheduleTableTHEAD(tenantTaxesArray, additionalChargeArray) {
    var tr = `
    <tr role="row">
        <th id="thSerialNo">Sr.No</th>
        <th id="thID" hidden>ID</th>        
        <th id="thChequeNo">Cheque No</th>
        <th id="thChequeDate">Cheque Date</th>
        <th id="thRent" class="text-end">Rent</th>
        <th id="thSecurityDeposit" class="text-end">Security Deposit</th>
        `
    $.each(tenantTaxesArray, function (rowIndex, rowItem) {
        tr += `<th id="th` + rowItem.Code + `" class="text-end">` + rowItem.Code + `</th>`;
    })
    $.each(additionalChargeArray, function (additionalIndex, additionalItem) {
        tr += `<th id="th` + additionalItem.Name + `" class="text-end">` + additionalItem.Name + `</th>`;
    });
    tr += `<th id="thPaymentFrequencyName"><strong>Total</strong></th>`;
    tr += $('#Status').val() === "Executed" ? `<th id="thIsInvoiced">Invoice</th>` : `<th id="thIsInvoiced" style="display:none;">Invoice</th>`
    //tr += `<th id="thIsInvoiced" style="display:none;">Invoice</th>`
    tr += '</tr>'
    $('#paymentScheduleTable thead').html(tr);
}
function getTenantTaxes() {
    ajaxRequest({ url: '/RealEstate/PropertyTax/GetByPayer', type: 'POST', data: { Payer: 'Tenant' }, callBack: getTenantTaxesCallBack });
}
var getTenantTaxesCallBack = function (responseJSON) {

    _leaseAgreementTenantTaxesDetail = responseJSON.resultJSON;

    generatePaymentScheduleTableTHEAD(_leaseAgreementTenantTaxesDetail);
}
//additional Charge

//function getAdditionalTaxes() {
//    ajaxRequest({ url: "/RealEstate/AdditionalCharges/GetAll", type: 'POST', data: {}, callBack: getAdditionalTaxesCallBack });
//}
//var  getAdditionalTaxesCallBack = function (responseJSON) {

//    _leaseAgreementAdditionalChargesDetail = responseJSON.resultJSON;
//    $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {

//    });
//    generatePaymentScheduleTableTHEAD(_leaseAgreementTenantTaxesDetail,responseJSON.resultJSON,);
//}

function getPaymentScheduleTableData() {
    debugger
    var paymentScheduleJSONArray = [];
    $('#paymentScheduleTable tr').each(function (rowIndex) {
        let self = $(this).closest("tr");
        if (rowIndex > 0) {
            if ($(this).attr('id') != 'totalsRow') {
                var taxesJSONArray = [], rentInvoiceTaxesArray = [];
                var taxesJSONObject = {}
                taxesJSONObject = {};
                $.each(_leaseAgreementTenantTaxesDetail, function (tenantTaxRowIndex, tenantTaxRowItem) {                    
                    var tdWithClass = 'td.td' + tenantTaxRowItem.Code.replace(/\s/g, '_') + '';
                    taxesJSONObject[tenantTaxRowItem.Code] = $(self).find(tdWithClass).find('input').val();
                    
                    let taxAmountInRow = parseFloat(removeAllCommas($(self).find(tdWithClass).find('input').val()));     
                    let reverseTaxRate = ((parseFloat(removeAllCommas(tenantTaxRowItem.Rate)) + 100) / 100);
                    let withoutVATTaxAmountInRow = (taxAmountInRow / reverseTaxRate);
                    //Rent Invoice Taxes
                    let rentInvoiceCharge = {
                        ID: tenantTaxRowItem.ID,
                        AccountHeadID: tenantTaxRowItem.AccountHeadID,
                        Description: tenantTaxRowItem.Description,
                        ShortName: tenantTaxRowItem.ShortName,
                        Code: tenantTaxRowItem.Code,
                        Amount: withoutVATTaxAmountInRow, //Math.round((taxAmountInRow) / (1 + parseFloat(removeAllCommas(tenantTaxRowItem.Rate)) / 100)),
                        Rate: tenantTaxRowItem.Rate,                                                
                        Tax: (taxAmountInRow - withoutVATTaxAmountInRow),  //,taxAmountInRow - (taxAmountInRow) / (1 + parseFloat(removeAllCommas(tenantTaxRowItem.Rate) / 100)),
                        Total: taxAmountInRow, // additionalChargesItem.TotalAmount
                    };

                    rentInvoiceTaxesArray.push(rentInvoiceCharge);
                    //Rent Invoice Taxes END

                });
                taxesJSONArray.push(taxesJSONObject);
                //Additional Charges Array object and loop
                var additionalJSONArray = [], rentInvoiceChargesArray = [];
                var additionalJSONObject = {}
                additionalJSONObject = {};
                $.each(_leaseAgreementAdditionalChargesArray, function (additionalChargesIndex, additionalChargesItem) {
                   
                    var tdWithClass = 'td.td' + additionalChargesItem.Name.replace(/\s/g, '_') + '';
                    additionalJSONObject[additionalChargesItem.Name] = $(self).find(tdWithClass).find('input').val();                   
                    let chargeAmountInRow = parseFloat(removeAllCommas( $(self).find(tdWithClass).find('input').val()));
                    let reverseTaxRate = ((parseFloat(removeAllCommas(additionalChargesItem.TaxRate)) + 100)/100);                    
                    let withoutVATChargeAmountInRow = (chargeAmountInRow / reverseTaxRate);
                    //Rent Invoice Additional Charges
                    let rentInvoiceCharge = {
                        AdditionalChargesID: additionalChargesItem.AdditionalChargesID,
                        Name: additionalChargesItem.Name,
                        Amount: withoutVATChargeAmountInRow,
                        Rate: additionalChargesItem.TaxRate,                                                
                        Tax: (chargeAmountInRow - withoutVATChargeAmountInRow),
                        Total: chargeAmountInRow, // additionalChargesItem.TotalAmount
                    };
                    rentInvoiceChargesArray.push(rentInvoiceCharge);
                    //Rent Invoice Additional Charges END

                });
                additionalJSONArray.push(additionalJSONObject);


                var checkbox = $(this).find('td.tdIsInvoiced input[type="checkbox"]');
                var isInvoiced = checkbox.is(':checked');
                var paymentScheduleJSONObject = {
                    ID: 0,
                    ChequeNo: $(this).find('td.tdChequeNo').find('input').val(),
                    ChequeDate: $(this).find('td.tdChequeDate').find('input').val(),
                    Rent: removeAllCommas($(this).find('td.tdRent').find('input').val()),
                    SecurityDeposit: removeAllCommas($(this).find('td.tdSecurityDeposit').find('input').val()),
                    Taxes: JSON.stringify(taxesJSONArray),
                    Charges: JSON.stringify(additionalJSONArray),
                    RentInvoiceCharges: JSON.stringify(rentInvoiceChargesArray),
                    RentInvoiceTaxes: JSON.stringify(rentInvoiceTaxesArray),
                    Total: removeAllCommas($(this).find('td.tdTotal').text())


                    ,
                    IsInvoiced: isInvoiced
                }





                //Rent Invoice Additional Charges

                paymentScheduleJSONArray.push(paymentScheduleJSONObject);
            }
        }
    });
    return paymentScheduleJSONArray;
}
function paymentScheduleReCalculation(requestedRow, event = null) {



    let netTotal = 0;
    let rowRent = $(requestedRow).closest('tr').find('.tdRent').find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdRent').find('input').val());
    let rowSecurityDeposit = $(requestedRow).closest('tr').find('.tdSecurityDeposit').find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdSecurityDeposit').find('input').val());
    //let rowTotal = $(requestedRow).closest('tr').find('.tdTotal').text();
    let rowTotal = parseFloat(rowRent) + parseFloat(rowSecurityDeposit);
    $.each(_leaseAgreementTenantTaxesDetail, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
        let tdTaxClass = '.td' + rowItemTenantTaxex.Code.replace(/\s/g, '_');
        let rowRentTax = (rowRent * parseFloat(rowItemTenantTaxex.Rate) / 100);
        rowTotal = rowTotal + rowRentTax;
        //$(requestedRow).closest('tr').find(tdTaxClass).text(addThousandSeperator(rowRentTax));
        $(requestedRow).closest('tr').find(tdTaxClass).find('input').val(addThousandSeperator(rowRentTax));


        //tr += `<td class="td` + rowItemTenantTaxex.Code + ` text-end pr-4">` + addThousandSeperator(taxOnRentPerCheque) + `</td>`;
        //perChequeTotal += taxOnRentPerCheque;

        //alert($(requestedRow).closest('tr').find(tdTaxClass).text());
    });
    let trAdditionalChargesTotal = 0;
    $.each(_leaseAgreementAdditionalChargesArray, function (rowAdditionalChargeIndex, rowAdditionalCharge) {
        /*
        var additionalTaxes = (parseFloat(rowAdditionalCharge.Amount) * parseFloat(rowAdditionalCharge.TaxRate) / 100);
        var additionalAmount = (parseFloat(rowAdditionalCharge.Amount) + parseFloat(additionalTaxes));
        var additionalTaxOnPerCheque = (additionalAmount / noOfPayments);
        tr += `<td class="td` + rowAdditionalCharge.Name.replace(' ', '_') + ` text-end pr-4">` + addThousandSeperator(additionalTaxOnPerCheque) + `</td>`;
        perChequeTotal += additionalTaxOnPerCheque;
        */
        let additionalChargestdClassName = '.td' + rowAdditionalCharge.Name.replace(/\s/g, '_');
        //let trAdditionalCharges = $(requestedRow).closest('tr').find(additionalChargestdClassName).text();
        let trAdditionalCharges = $(requestedRow).closest('tr').find(additionalChargestdClassName).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(requestedRow).closest('tr').find(additionalChargestdClassName).find('input').val()));
        trAdditionalChargesTotal = trAdditionalChargesTotal + parseFloat(trAdditionalCharges);
        //            find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdRent').find('input').val());
    });
    rowTotal = rowTotal + trAdditionalChargesTotal;
    $(requestedRow).closest('tr').find('.tdTotal').text(addThousandSeperator(rowTotal));

    let allChequesRent = 0, allChequesSecurityDeposit = 0;
    $('#paymentScheduleTable tr').each(function (rowIndex) {
        if (rowIndex > 0 && $(this).attr('id') != 'totalsRow') {

            netTotal = (netTotal + parseFloat(removeAllCommas($(this).find('td.tdTotal').text())));
            allChequesRent = (allChequesRent + parseFloat(removeAllCommas($(this).find('td.tdRent').find('input').val())));
            allChequesSecurityDeposit = (allChequesSecurityDeposit + parseFloat(removeAllCommas($(this).find('td.tdSecurityDeposit ').find('input').val())));
        }
    });

    $('#lblPaymentScheduleTotal').text(addThousandSeperator(netTotal));
    //$('#lblLeaseTermTotal').text(addThousandSeperator(netTotal));
    /*
    var totalAmount = totalFromRentSecurityTaxes();
    var additionalCharges = additionalChargesTotalAndDesignGeneration(_leaseAgreementAdditionalChargesArray);
    //$('#lblLeaseTermTotal').text(addThousandSeperator(totalAmount));
    totalAmount = totalAmount + additionalCharges
    $('#lblLeaseTermTotal').text(addThousandSeperator(totalAmount));
    $('#TotalAmount').val(totalAmount);
 
    renderNoOfPaymentsChequeHTML($('#NoOfPayments').val(), false, _scheduleFrequency, _leaseAgreementAdditionalChargesArray);
    $('#lblLeaseTermRent').val(addThousandSeperator(removeAllCommas($('#lblLeaseTermRent').val())));
    */

    addTotalRowToThePaymentSchedule(allChequesRent, allChequesSecurityDeposit, _leaseAgreementAdditionalChargesArray, _leaseAgreementTenantTaxesDetail);
}
function paymentScheduleTaxesReCalculation(requestedRow, rowIndex) {
    if ($.isNumeric(removeAllCommas($(requestedRow).val()))) {

        let netTotal = 0;
        let rowRent = $(requestedRow).closest('tr').find('.tdRent').find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdRent').find('input').val());
        let rowSecurityDeposit = $(requestedRow).closest('tr').find('.tdSecurityDeposit').find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdSecurityDeposit').find('input').val());
        //let rowTotal = $(requestedRow).closest('tr').find('.tdTotal').text();
        let rowTotal = parseFloat(rowRent) + parseFloat(rowSecurityDeposit);


        //$(requestedRow).closest('tr').find(tdTaxClass).text(addThousandSeperator(rowRentTax));
        $.each(_leaseAgreementTenantTaxesDetail, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
            var rowRentTax = 0;
            //if (rowIndexTenantTaxex == rowIndex) {
            //    rowRentTax = parseFloat(removeAllCommas($(requestedRow).val()));
            //}
            //else {
            let tdTaxClass = 'td.td' + rowItemTenantTaxex.Code.replace(/\s/g, '_');
            //let rowRentTax = (rowRent * parseFloat(rowItemTenantTaxex.Rate) / 100);
            rowRentTax = $(requestedRow).closest('tr').find(tdTaxClass).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(requestedRow).closest('tr').find(tdTaxClass).find('input').val()));
            //$(requestedRow).closest('tr').find(tdTaxClass).text(addThousandSeperator(rowRentTax));
            //$(requestedRow).closest('tr').find(tdTaxClass).find('input').val(addThousandSeperator(rowRentTax));
            //}

            rowTotal = parseFloat(rowTotal) + parseFloat(rowRentTax);


        });
        // $(requestedRow).closest('tr').find('td').find('input').val() == '' ? 0 : removeAllCommas( $(requestedRow).closest('tr').find('td').find('input').val(addThousandSeperator(rowRentTax)));

        let trAdditionalChargesTotal = 0;
        $.each(_leaseAgreementAdditionalChargesArray, function (rowAdditionalChargeIndex, rowAdditionalCharge) {
            /*
            var additionalTaxes = (parseFloat(rowAdditionalCharge.Amount) * parseFloat(rowAdditionalCharge.TaxRate) / 100);
            var additionalAmount = (parseFloat(rowAdditionalCharge.Amount) + parseFloat(additionalTaxes));
            var additionalTaxOnPerCheque = (additionalAmount / noOfPayments);
            tr += `<td class="td` + rowAdditionalCharge.Name.replace(' ', '_') + ` text-end pr-4">` + addThousandSeperator(additionalTaxOnPerCheque) + `</td>`;
            perChequeTotal += additionalTaxOnPerCheque;
            */

            let additionalChargestdClassName = '.td' + rowAdditionalCharge.Name.replace(/\s/g, '_');
            //let trAdditionalCharges = $(requestedRow).closest('tr').find(additionalChargestdClassName).text();
            let trAdditionalCharges = $(requestedRow).closest('tr').find(additionalChargestdClassName).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(requestedRow).closest('tr').find(additionalChargestdClassName).find('input').val()));
            trAdditionalChargesTotal = trAdditionalChargesTotal + parseFloat(trAdditionalCharges);
            //            find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdRent').find('input').val());
        });
        rowTotal = rowTotal + trAdditionalChargesTotal;
        $(requestedRow).closest('tr').find('.tdTotal').text(addThousandSeperator(rowTotal));

        let allChequesRent = 0, allChequesSecurityDeposit = 0;
        $('#paymentScheduleTable > tbody tr').each(function (rowIndex) {
            if (rowIndex >= 0 && $(this).attr('id') != 'totalsRow') {
                netTotal = (netTotal + parseFloat(removeAllCommas($(this).find('td.tdTotal').text())));
                allChequesRent = (allChequesRent + parseFloat(removeAllCommas($(this).find('td.tdRent').find('input').val())));
                allChequesSecurityDeposit = (allChequesSecurityDeposit + parseFloat(removeAllCommas($(this).find('td.tdSecurityDeposit ').find('input').val())));
            }
        });

        $('#lblPaymentScheduleTotal').text(addThousandSeperator(netTotal));
        addTotalRowToThePaymentSchedule(allChequesRent, allChequesSecurityDeposit, _leaseAgreementAdditionalChargesArray, _leaseAgreementTenantTaxesDetail);
    }
    else {
        console.log('not');
    }

}
function paymentScheduleAdditionalChargesReCalculation(requestedRow, rowIndex) {
    let netTotal = 0;
    let rowCharges = $(requestedRow).closest('tr').find('.tdRent').find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdRent').find('input').val());
    let rowSecurityDeposit = $(requestedRow).closest('tr').find('.tdSecurityDeposit').find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdSecurityDeposit').find('input').val());
    //let rowTotal = $(requestedRow).closest('tr').find('.tdTotal').text();
    let rowTotal = parseFloat(rowCharges) + parseFloat(rowSecurityDeposit);


    $.each(_leaseAgreementTenantTaxesDetail, function (rowIndexTenantTaxex, rowItemTenantTaxex) {

        let tdTaxClass = '.td' + rowItemTenantTaxex.Code.replace(/\s/g, '_');
        //let rowRentTax = (rowRent * parseFloat(rowItemTenantTaxex.Rate) / 100);
        rowRentTax = $(requestedRow).closest('tr').find(tdTaxClass).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(requestedRow).closest('tr').find(tdTaxClass).find('input').val()));

        //$(requestedRow).closest('tr').find(tdTaxClass).text(addThousandSeperator(rowRentTax));
        //$(requestedRow).closest('tr').find(tdTaxClass).find('input').val(addThousandSeperator(rowRentTax));

        rowTotal = parseFloat(rowTotal) + parseFloat(rowRentTax);


    });

    let trAdditionalChargesTotal = 0;
    $.each(_leaseAgreementAdditionalChargesArray, function (rowAdditionalChargeIndex, rowAdditionalCharge) {
        let additionalChargestdClassName = '.td' + rowAdditionalCharge.Name.replace(/\s/g, '_');
        //let trAdditionalCharges = $(requestedRow).closest('tr').find('.' + additionalChargestdClassName).text();
        let trAdditionalCharges = $(requestedRow).closest('tr').find(additionalChargestdClassName).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(requestedRow).closest('tr').find(additionalChargestdClassName).find('input').val()));
        trAdditionalChargesTotal = trAdditionalChargesTotal + parseFloat(trAdditionalCharges);
        //            find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdRent').find('input').val());
    });
    rowTotal = rowTotal + trAdditionalChargesTotal;
    $(requestedRow).closest('tr').find('.tdTotal').text(addThousandSeperator(rowTotal));


    $('#paymentScheduleTable tr').each(function (rowIndex) {
        if (rowIndex > 0 && $(this).attr('id') != 'totalsRow') {
            netTotal = (netTotal + parseFloat(removeAllCommas($(this).find('td.tdTotal').text())));
        }
    });

    $('#lblPaymentScheduleTotal').text(addThousandSeperator(netTotal));
    addTotalRowToThePaymentSchedule(removeAllCommas($('#lblLeaseTermRent').val()), removeAllCommas($('#lblLeaseTermSecurityDeposit').val()), _leaseAgreementAdditionalChargesArray, _leaseAgreementTenantTaxesDetail);
}
$(document).on('keyup', '.keyUpEventClassForPaymentSchedule', function (event) {   
    //alert(event.which);
    //let requestedRow = $(this).parent('tr');
    //alert($(this).closest('tr').find('.tdSecurityDeposit').find('input').val());
    //if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {

    //if ((event.key == 46 || event.key == 8) || (event.key >= 48 && event.key <= 57) || (event.key >= 96 && event.key <= 105)) {
    if (event.key >= 0 && event.key <= 9) {
        paymentScheduleReCalculation(this, event);
    }
    else if (event.key == 'Backspace') {
        if (Number($(this).val())) {
            paymentScheduleReCalculation(this, event);
        }
    }
    else if (event.key == 'Tab') {

    }
    else {
        event.preventDefault();
    }



});

$(document).on('keyup', '.keyUpEventClassForPaymentScheduleTaxesReCalculation', function (event) { 
    //$('#coverScreen').show();
    var isPreventDefault = false;
    if (event.key >= 0 && event.key <= 9) {
        if (!isPreventDefault) {
            isPreventDefault = true;
            paymentScheduleTaxesReCalculation(this, event);
        }

    }
    else if (event.key == 'Backspace') {
        if (Number($(this).val())) {
            if (!isPreventDefault) {
                isPreventDefault = true;
                paymentScheduleTaxesReCalculation(this, event);
            }
        }
    }
    else if (event.key == 'Tab') {
        //Grand Total was calculating incorrect while focusing in Taxes fields by pressing tab
        //Task# 926
        //paymentScheduleTaxesReCalculation(this, event);
    }
    else {
        event.preventDefault();
    }
    //setTimeout(function () {
    //    $('#coverScreen').hide();
    //    isPreventDefault = false;
    //}, 800);    
});
function getSelectedUnitPaymentTermDetailTableData() {
    var selectedUnitPaymentTermDetailJSONArray = [];

    $('#unitPaymentTermDetailTable tr').each(function (rowIndex) {
        if (rowIndex > 0) {
            var selectedUnitsPaymentPlanJSONObject = {};
            var istblQuotationDataCheckboxChecked = $('#unitPaymentTermDetailTabletdCheckbox' + (rowIndex - 1) + '').is(':checked');

            if (istblQuotationDataCheckboxChecked) {
                selectedUnitsPaymentPlanJSONObject['ID'] = $(this).find('td.tdID').text();
                selectedUnitsPaymentPlanJSONObject['LeaseTermID'] = $(this).find('td.tdLeaseTermID').text();
                selectedUnitsPaymentPlanJSONObject['LeaseTermName'] = $(this).find('td.tdLeaseTermName').text();
                selectedUnitsPaymentPlanJSONObject['Amount'] = removeAllCommas($(this).find('td.tdAmount').text());
                selectedUnitsPaymentPlanJSONObject['PaymentFrequencyID'] = $(this).find('td.tdPaymentFrequencyID').text();
                selectedUnitsPaymentPlanJSONObject['PaymentFrequencyName'] = $(this).find('td.tdPaymentFrequencyName').text();
                selectedUnitsPaymentPlanJSONObject['PaymentTermID'] = $(this).find('td.tdPaymentTermID').text();
                selectedUnitsPaymentPlanJSONObject['PaymentTermName'] = $(this).find('td.tdPaymentTermName').text();
                selectedUnitsPaymentPlanJSONObject['SecurityDepositAmount'] = removeAllCommas($(this).find('td.tdSecurityDepositAmount').text());
                selectedUnitsPaymentPlanJSONObject['SecurityDepositEquivalentID'] = $(this).find('td.tdSecurityDepositEquivalentID').text();
                selectedUnitsPaymentPlanJSONObject['SecurityDepositEquivalentName'] = $(this).find('td.tdSecurityDepositEquivalentName').text();
                selectedUnitsPaymentPlanJSONObject['NoOfPayments'] = $(this).find('td.tdNoOfPayments').text();
                selectedUnitsPaymentPlanJSONObject['TotalAmount'] = removeAllCommas($('#lblLeaseTermTotal').text());
                selectedUnitsPaymentPlanJSONObject['PropertyID'] = $(this).find('td.tdPropertyID').text();
                selectedUnitsPaymentPlanJSONObject['UnitID'] = $(this).find('td.tdUnitID').text();
                selectedUnitsPaymentPlanJSONObject['CurrencyID'] = $(this).find('td.tdCurrencyID').text();
                selectedUnitsPaymentPlanJSONObject['Currency'] = $(this).find('td.Currency').text();
                selectedUnitsPaymentPlanJSONObject['FrequencyDays'] = $(this).find('td.tdFrequencyDays').text();
                //extra fields using for frontend purpose not sending to backend
                selectedUnitsPaymentPlanJSONObject['UnitName'] = $(this).find('td.tdUnitName').text();
                selectedUnitsPaymentPlanJSONObject['PropertyName'] = $(this).find('td.tdPropertyName').text();
                selectedUnitPaymentTermDetailJSONArray.push(selectedUnitsPaymentPlanJSONObject);


            }
        }
    });
    return selectedUnitPaymentTermDetailJSONArray;
}
function saveRecord(isPreview = false, isCloseAndSaveAsDraft = false, isProformaInvoice = false, isCheckedAcknowlegdment = false) {
    let _isFromQuotation = false;
    /* _isUpdate = false*/
    //var startDateFormatted = $("#StartDate").val();
    //var endDateFormatted = $("#EndDate").val();

    //var startDate = new Date(startDateFormatted);
    //var endDate = new Date(endDateFormatted);


    isSaveAndPreview = isPreview;
    var selectedUnitPaymentTermDetailJSONArray = getSelectedUnitPaymentTermDetailTableData();
    if ($('#ID').val() > 0) {
        _isUpdate = true;
    }
    if (customValidateForm('LeaseAgreement') || isCloseAndSaveAsDraft == true) {
        var startDate = getDatepickerDate('StartDate');
        var endDate = getDatepickerDate('EndDate');
        if (startDate > endDate) {
            infoToastr("End date should be greater than Start date", 'info');
            //$('#btnSave').prop('disabled', false);
            //$('#btnPreviewLeaseAgreement').prop('disabled', false);
            //$('#btnCloseLeaseAgreement').prop('disabled', false);
            buttonsEnable(false);
            return;
        }
        var elementCounts = _selectedUnitInputJSONArray.reduce((count, item) => (count[item.ID] = count[item.ID] + 1 || 1, count), {});

        let isDuplicateUnitFound = false;
        $.each(elementCounts, function (key, val) {

            if (val > 1) {
                isDuplicateUnitFound = true;
                var unitInfo = selectedUnitPaymentTermDetailJSONArray.find(row => row.UnitID == key);
                infoToastr('There should be a single payment plan for Unit(' + unitInfo.UnitName + ')', 'info');
                //$('#btnSave').prop('disabled', false);
                //$('#btnPreviewLeaseAgreement').prop('disabled', false);
                //$('#btnCloseLeaseAgreement').prop('disabled', false);
                buttonsEnable(false);
                return;
            }
        });
        if (!isDuplicateUnitFound) {
            if (selectedUnitPaymentTermDetailJSONArray.length <= 0) {
                infoToastr('Minimum one Unit should be selected for the Agreement', 'info');
                //$('#btnSave').prop('disabled', false);
                //$('#btnPreviewLeaseAgreement').prop('disabled', false);
                //$('#btnCloseLeaseAgreement').prop('disabled', false);
                buttonsEnable(false);
                return;
            }
            else {
                let selectedUnitIDs = [];
                $.each(selectedUnitPaymentTermDetailJSONArray, function (rowIndex, rowValue) {
                    selectedUnitIDs.push({ ID: rowValue.UnitID });
                });
                ajaxRequest({
                    url: '/RealEstate/LeaseAgreement/CheckUnitAvailableFrom', type: 'POST', data: { UnitIDs: selectedUnitIDs, StartDate: $('#StartDate').val() }, callBack: function (responseJSON) {
                        let availableFromMessage = '';
                        if (responseJSON.IsSuccess && responseJSON.resultJSON.length > 0) {
                            $.each(responseJSON.resultJSON, function (rowIndex, rowValue) {
                                let message = 'Unit (' + rowValue.UnitNo + ') is available from (' + getFormattedDate(rowValue.AvailableFrom) + ')';
                                availableFromMessage += availableFromMessage == '' ? message : (', ' + message);
                                infoToastr('Unit (' + rowValue.UnitNo + ') is available from (' + getFormattedDate(rowValue.AvailableFrom) + ')', "Info");
                            });
                            $('#errorMessage').text(availableFromMessage);
                            $('#errorMessage').css('display', 'block');
                            buttonsEnable(false);
                        }
                        else {
                            if (parseFloat(removeAllCommas($('#lblPaymentScheduleTotal').text())) != parseFloat(removeAllCommas($('#lblLeaseTermTotal').text()))) {
                                $('#errorMessage').text('Payment schedule total amount should be equal to the Amounts total');
                                $('#errorMessage').css('display', 'block');
                                return;
                            }

                            $('#errorMessage').text(availableFromMessage);
                            $('#errorMessage').css('display', 'none');


                            var previewInputJSON = {};
                            var inputJSON = getFormDataAsJSONObject('LeaseAgreement');
                            /* The below code has been commented because in the Cheque Acknowledgement Report the Tenant name was undefined due to this, 
                            because its was not assigned properly, null saved Tenant should be undefined in the Report.
                            if ($('#CustomerID').length) {
                                inputJSON['TenantID'] = $('#CustomerID').val();
                                inputJSON['TenantName'] = $('#MiddleName').val() + ' ' + $('#LastName').val();
                                _isFromQuotation = true;
                            }
                            else {
                                inputJSON['TenantName'] = $('#TenantID').find(':selected').text();
                                _isFromQuotation = false;
                            }
                            */
                            if ($('#CustomerID').length && $('#CustomerID').is('input')) {
                                inputJSON['TenantID'] = $('#CustomerID').val();
                                inputJSON['TenantName'] = $('#FirstName').val() + ' ' + $('#LastName').val();
                                _isFromQuotation = true;
                            } else if ($('#CustomerID').length && $('#CustomerID').is('select')) {
                                inputJSON['TenantID'] = $('#CustomerID').val();
                                inputJSON['TenantName'] = $('#CustomerID option:selected').text();
                                _isFromQuotation = false;
                            }
                            //Payment Schedule Header                            
                            $.each(_leaseAgreementAdditionalChargesArray, function (rowIndex, rowValue) {
                                if (_leaseAgreementAdditionalChargesArray[rowIndex].ID > 0) {
                                    _leaseAgreementAdditionalChargesArray[rowIndex]['AdditionalChargesID'] = _leaseAgreementAdditionalChargesArray[rowIndex].ID;
                                    _leaseAgreementAdditionalChargesArray[rowIndex].ID = 0;
                                    _leaseAgreementAdditionalChargesArray[rowIndex]['TotalAmount'] = (((_leaseAgreementAdditionalChargesArray[rowIndex].Amount / 100) * _leaseAgreementAdditionalChargesArray[rowIndex].TaxRate) + _leaseAgreementAdditionalChargesArray[rowIndex].Amount);
                                }
                            });
                            //Payment Schedule Header

                            //inputJSON['QuotationID'] = null;
                            //| Payment Schedule Header
                            var previewPaymentScheduleHeaderJSON = {};
                            previewPaymentScheduleHeaderJSON['NoOfPayments'] = inputJSON['NoOfPayments'] = $('#NoOfPayments').val();
                            previewPaymentScheduleHeaderJSON['Rent'] = inputJSON['Rent'] = removeAllCommas($('#lblLeaseTermRent').val());
                            previewPaymentScheduleHeaderJSON['SecurityDeposit'] = inputJSON['SecurityDeposit'] = removeAllCommas($('#lblLeaseTermSecurityDeposit').val());
                            previewPaymentScheduleHeaderJSON['Taxes'] = inputJSON['Taxes'] = JSON.stringify(_leaseAgreementPaymentScheduleHeaderTaxesJSONArray);
                            previewPaymentScheduleHeaderJSON['Discount'] = inputJSON['Discount'] = 0;
                            previewPaymentScheduleHeaderJSON['TotalAmount'] = inputJSON['TotalAmount'] = removeAllCommas($('#lblLeaseTermTotal').text());
                            previewPaymentScheduleHeaderJSON['PaymentModeID'] = inputJSON['PaymentModeID'] = 0;

                            previewPaymentScheduleHeaderJSON['AdditionalCharges'] = JSON.stringify(_leaseAgreementAdditionalChargesArray);

                            previewInputJSON['PaymentScheduleHeader'] = JSON.stringify(previewPaymentScheduleHeaderJSON);
                            //| Payment Schedule Header Ends
                            inputJSON['IsPreview'] = isPreview;

                            previewInputJSON['Agreement'] = JSON.stringify(inputJSON);
                            previewInputJSON['LeaseAgreementID'] = inputJSON.ID;

                            //inputJSON = getFormDataAsJSONObject('tenancyDetailFrom', inputJSON);

                            inputJSON['LeaseAgreementRentDetails'] = selectedUnitPaymentTermDetailJSONArray;// rentDetailsIputJSONArray;
                            previewInputJSON['RentDetail'] = JSON.stringify(selectedUnitPaymentTermDetailJSONArray);

                            //Additional Charge inputJSON Array

                            //debugger
                            //$.each(_leaseAgreementAdditionalChargesArray, function (rowIndex, rowValue) {
                            //    _leaseAgreementAdditionalChargesArray[rowIndex]['AdditionalChargesID'] = _leaseAgreementAdditionalChargesArray[rowIndex].ID;
                            //    _leaseAgreementAdditionalChargesArray[rowIndex].ID = 0;
                            //    _leaseAgreementAdditionalChargesArray[rowIndex]['TotalAmount'] = (((_leaseAgreementAdditionalChargesArray[rowIndex].Amount / 100) * _leaseAgreementAdditionalChargesArray[rowIndex].TaxRate) + _leaseAgreementAdditionalChargesArray[rowIndex].Amount);
                            //});                            
                            inputJSON['LeaseAgreementAdditionalCharges'] = _leaseAgreementAdditionalChargesArray;
                            inputJSON['AdditionalCharges'] = JSON.stringify(_leaseAgreementAdditionalChargesArray);
                            inputJSON['LeaseAgreementTenantTaxes'] = _leaseAgreementTenantTaxes;
                            inputJSON['LeaseAgreementPaymentSchedules'] = getPaymentScheduleTableData();// _leaseAgreementPaymentSchedule;
                            previewInputJSON['PaymentSchedule'] = JSON.stringify(getPaymentScheduleTableData());
                            inputJSON['Units'] = _selectedUnitInputJSONArray;
                            previewInputJSON['UnitAgreementAssociation'] = JSON.stringify(_selectedUnitInputJSONArray);

                            //| Lease Agreement Preview Object Settings For Save/Update
                            inputJSON['Agreement'] = previewInputJSON['Agreement'];
                            inputJSON['RentDetail'] = previewInputJSON['RentDetail'];
                            inputJSON['PaymentSchedule'] = previewInputJSON['PaymentSchedule'];
                            inputJSON['UnitAgreementAssociation'] = previewInputJSON['UnitAgreementAssociation'];
                            inputJSON['PaymentScheduleHeader'] = previewInputJSON['PaymentScheduleHeader'];
                            if ($('#ID').val() > 0) {
                                inputJSON['FKeyIdentifier'] = fKeyIdentifierVal;
                            }
                            else {
                                inputJSON['FKeyIdentifier'] = $('#UnitUniqueFKeyIdenfier').val();
                            }
                            
                            //Check Associated Unit

                            ajaxRequest({
                                url: '/RealEstate/LeaseAgreement/GetUnitActiveAgreements', type: 'POST', data: { Units: selectedUnitIDs, StartDate: $('#StartDate').val(), LeaseAgreementID: $("#ID").val() }, callBack: function (responseJSON) {
                                    //url: '/RealEstate/LeaseAgreement/GetUnitActiveAgreements', type: 'POST', data: { UnitID: $(this).val(),LeaseAgreementID:$('#ID').val(),StartDate}, callBack: function (responseJSON) {

                                    if (responseJSON.IsSuccess) {

                                        if (responseJSON.resultJSON != null) {
                                            //infoToastr('In ' + $("#UnitID option:selected").text() + ' is already associated with an AgreementNo( ' + responseJSON.resultJSON.AgreementNo + ') ', 'info');
                                            let agreementNoLink = `<a href="#" onclick="redirectToAction('/RealEstate/LeaseAgreement/Detail?ID=',${responseJSON.resultJSON.ID},'_blank')">${responseJSON.resultJSON.AgreementNo}</a>`
                                            let firstExecuteOrRemove = responseJSON.resultJSON.Status == 'Executed' ? '' : 'First execute it or remove it.';
                                            let message = `Unit No (${responseJSON.resultJSON.TenancyUnitNo}) already associated with an <br/> Agreement No (${agreementNoLink})<br/>Status (${responseJSON.resultJSON.Status}).<br/>${firstExecuteOrRemove}`
                                            swal.fire('', message, 'info');
                                            infoToastr(`Unit No (${responseJSON.resultJSON.TenancyUnitNo}) already associated with an <br/> Agreement No (${responseJSON.resultJSON.AgreementNo}) <br/>Status (${responseJSON.resultJSON.Status}).<br/>${firstExecuteOrRemove}`, 'info');
                                            return

                                        } else {
                                            //| Lease Agreement Preview Object Settings For Save/Update Ends

                                            if (isPreview || isProformaInvoice || isCheckedAcknowlegdment) {
                                                ajaxRequest({ url: '/RealEstate/LeaseAgreement/SavePreview', type: 'POST', data: previewInputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft, isProformaInvoice: isProformaInvoice, isFromQuotation: _isFromQuotation, isCheckedAcknowlegdment: isCheckedAcknowlegdment });

                                            }
                                            else {                                                
                                                let selectedCheques = getPaymentScheduleTableData().filter(row => row.IsInvoiced);
                                                let chequeCount = selectedCheques.length;
                                                let cheques = chequeCount === 0 ? 'none' : chequeCount === 1 ? 'single' : 'multiple';

                                                if ($('#Status').val() == 'Executed') {
                                                    /*
                                                    if (cheques === 'none') {
                                                        infoToastr('To execute agreement select one or more cheques');
                                                        return false;
                                                    }
                                                    else
                                                    */
                                                    if (cheques === 'single') {
                                                        inputJSON['IsSingleInvoice'] = true;
                                                    }
                                                    else if (cheques === 'multiple') {
                                                        swal.fire({
                                                            title: "Confirmation",
                                                            text: 'Multiple cheques are selected?',
                                                            icon: 'info',
                                                            cancelButtonColor: '#0d6efd',
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Generate One Invoice For All Cheques',
                                                            cancelButtonText: 'Generate Separate Invoice For Each Cheque',
                                                            dangerMode: true,
                                                        }).then((result) => {
                                                            inputJSON['IsSingleInvoice'] = !!result.value;                                                            
                                                            ajaxRequest({ url: '/RealEstate/LeaseAgreement/Save', type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft, isProformaInvoice: isProformaInvoice, isFromQuotation: _isFromQuotation });
                                                        });
                                                    }
                                                }

                                                if (cheques !== 'multiple') {                                                    
                                                    ajaxRequest({ url: '/RealEstate/LeaseAgreement/Save', type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft, isProformaInvoice: isProformaInvoice, isFromQuotation: _isFromQuotation });
                                                }


                                            }

                                        }

                                    }
                                }
                            });

                            //isUpdate: _isUpdate
                            //ajaxRequest({ url: '/RealEstate/LeaseAgreement/' + (isPreview == true ? 'SavePreview' : 'Save'), type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });
                            //ajaxRequest({ url: '/RealEstate/LeaseAgreement/Save', type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });
                        }
                    }
                });
            }
        }
    }
    else {
        buttonsEnable(false);
    }
}
var saveRecordCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        $('#btnSave').prop('disabled', false);
        $('#btnPreviewLeaseAgreement').prop('disabled', false);
        $('#btnCloseLeaseAgreement').prop('disabled', false);
        if (responseJSON.resultJSON != null) {
            $('#ID').val(responseJSON.resultJSON);
        }
        //When status is Executed must redirect to the list view
        //if ($("#Status :selected").text() == "Executed" || actionName == 'Renewal') {
        //    swal.fire("", responseJSON.Message, 'success');
        //    setTimeout(function () {
        //        window.location.href = '/RealEstate/LeaseAgreement/List?FID=c2atQ5gwflXzP8Gc5wiG4Q==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
        //    }, 2000);
        //}
        //else {
        if (options.isProformaInvoice) {
            window.open('/RealEstate/Reports/ProformaInvoice?id=' + responseJSON.resultJSON, '_blank');
        }

        else if (options.isCheckedAcknowlegdment) {
            window.open('/RealEstate/Reports/Acknowledgement?id=' + responseJSON.resultJSON, '_blank');
        }
        else {
            if (!isSaveAndPreview) {
                if ($("#Status :selected").text() == "Executed" || actionName == 'Renewal') {
                    successToastr(responseJSON.Message, 'success');
                    setTimeout(function () {
                        window.location.href = '/RealEstate/LeaseAgreement/List?FID=c2atQ5gwflXzP8Gc5wiG4Q==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
                    }, 2000);
                }
                else {
                    if (options.isCloseAndSaveAsDraft) {
                        if (options.isFromQuotation) {
                            setTimeout(function () {
                                window.location.href = '/RealEstate/Quotation/List?FID=EtQNQJ3CKGJfuJZpUYsrUg==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
                            }, 2000);
                        }
                        else {
                            setTimeout(function () {
                                window.location.href = '/RealEstate/LeaseAgreement/List?FID=c2atQ5gwflXzP8Gc5wiG4Q==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
                            }, 2000);
                        }
                    }
                    else {
                        //$('#unitPaymentTermDetailTableContainer').css('display', 'none');       
                        if (options.isFromQuotation) {
                            successToastr(responseJSON.Message, 'success');                           
                            //setTimeout(function () {
                            //    window.location.href = '/RealEstate/Quotation/List?FID=EtQNQJ3CKGJfuJZpUYsrUg==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
                            //}, 2000);
                        }
                        else if (options.isUpdate) {
                            setTimeout(function () {
                                window.location.href = '/RealEstate/LeaseAgreement/List?FID=c2atQ5gwflXzP8Gc5wiG4Q==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
                            }, 2000);
                        }
                        else {

                            successToastr(responseJSON.Message, 'success');
                            //clearFormFields($('#ID').val());
                            //getNumber();
                        }
                    }
                }
            }
            else {
                isSaveAndPreview = false;
                window.open('/RealEstate/LeaseAgreement/Preview?id=' + responseJSON.resultJSON, '_blank');
            }
            //}
        }
    }
    else {

        errorToastr(responseJSON.Message, 'error');
        $('#btnSave').prop('disabled', false);
        $('#btnPreviewLeaseAgreement').prop('disabled', false);
        $('#btnCloseLeaseAgreement').prop('disabled', false);

    }
}
var checkAllCheckBoxesInTable = function (tableId) {
    $('#' + tableId + ' tr').each(function (rowIndex, rowValue) {
        $('#' + tableId + 'tdCheckbox' + rowIndex + '').prop('checked', true);
    });
    //$('#unitRentDetailTable tr').each(function (rowIndexEachLoop, rowValue) {
    //    if (rowIndex == rowIndexEachLoop) {
    //        let a = 'a';
    //    }
    //    else {
    //        $('#tdCheckbox' + rowIndexEachLoop + '').prop('checked', false);
    //    }
    //});
}
function buttonsEnable(isEnable) {
    $('#btnSave').prop('disabled', isEnable);
    $('#btnPreviewLeaseAgreement').prop('disabled', isEnable);
    $('#btnCloseLeaseAgreement').prop('disabled', isEnable);
}

function leaseTermRentKeyUp(event) {
    var totalAmount = totalFromRentSecurityTaxes();
    var additionalCharges = additionalChargesTotalAndDesignGeneration(_leaseAgreementAdditionalChargesArray);
    //$('#lblLeaseTermTotal').text(addThousandSeperator(totalAmount));
    totalAmount = totalAmount + additionalCharges
    $('#lblLeaseTermTotal').text(addThousandSeperator(totalAmount));
    $('#TotalAmount').val(totalAmount);
    renderNoOfPaymentsChequeHTML($('#NoOfPayments').val(), false, _scheduleFrequency, _leaseAgreementAdditionalChargesArray);



    //$('#lblLeaseTermRent').val(addThousandSeperator(removeAllCommas($('#lblLeaseTermRent').val())));
}
function leaseTermSecurityDepositKeyUp(event) {
    selectedUnitsTotalSecurityDeposit = parseFloat(removeAllCommas(($('#lblLeaseTermSecurityDeposit').val() == '' ? 0 : $('#lblLeaseTermSecurityDeposit').val())));
    //leaseTermRentKeyUp(event);
    var paymentScheduleArray = getPaymentScheduleTableData();
    $.each(paymentScheduleArray, function (index, item) {
        let perRowChargesArray = [];
        let perRowTotalCharges = 0.0;

        let perRowTotalTaxes = 0.0;
        //parsing taxes JSON String Array to JSON Array
        var taxesArray = JSON.parse(item.Taxes);
        $.each(taxesArray, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
            //Calculating all taxes amount available in a row
            for (var key in rowItemTenantTaxex) {
                perRowTotalTaxes += parseFloat(removeAllCommas(rowItemTenantTaxex[key]))
            }
        });
        $.each(_leaseAgreementAdditionalChargesArray, function (indexCharges, itemCharges) {
            //Calculating all additional charges amount available in a row
            //let chargesPerRow = (((itemCharges.Amount / 100) * itemCharges.TaxRate) + itemCharges.Amount) / (paymentScheduleArray.length);              
            let chargesPerRow = 0;
            if (itemCharges['IsRecoverInFirstCheque'] === 'Yes') {

                if (index == 0) {
                    chargesPerRow = itemCharges.TotalAmount;
                }

            }
            else {
                chargesPerRow = (itemCharges.TotalAmount / (paymentScheduleArray.length));
            }

            perRowChargesArray.push({ [itemCharges.Name]: chargesPerRow });
            perRowTotalCharges += chargesPerRow;

        });
        if (index == 0) {
            paymentScheduleArray[index]['SecurityDeposit'] = selectedUnitsTotalSecurityDeposit;
        }
        paymentScheduleArray[index]['Charges'] = JSON.stringify(perRowChargesArray);
        paymentScheduleArray[index]['Total'] = (perRowTotalCharges + parseFloat(removeAllCommas(item.Rent)) + parseFloat(removeAllCommas(item.SecurityDeposit)) + perRowTotalTaxes);
    });
    amendPaymentScheduleTable(paymentScheduleArray);
    addTotalRowToThePaymentSchedule(selectedUnitsTotalRent, selectedUnitsTotalSecurityDeposit, _leaseAgreementAdditionalChargesArray, _leaseAgreementTenantTaxesDetail);


}
unitPaymentTermDetailTableDeleteRecord = function (id = 0, rowIndex = 0, rowItem = null) {

    swal.fire({
        title: "Confirmation",
        text: (rowItem.ID <= 0 ? 'Do you really want to remove this record ?' : 'Do you really want to permanantly delete this reocrd ?'),
        type: 'info',
        cancelButtonColor: '#F04249',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        dangerMode: true,
    }).then((result) => {
        if (result.value) {
            if (rowItem.ID > 0) {
                //remove from db
                ajaxRequest({
                    url: '/RealEstate/LeaseAgreement/DeleteRentDetail', type: 'POST', data: { ID: rowItem.ID }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            infoToastr('Record has been deleted successfully', 'info');
                            //remove only from frontend
                            $('#unitPaymentTermDetailTable > tbody > tr:eq(' + rowIndex + ')').remove();
                            _allCheckedUnitRentDetailsArray.splice(rowIndex, 1);
                            //rentDetailcheckBoxClicked($(this), rowIndex, rowItem);
                        }
                    }

                });
            }
            else {
                //remove only from frontend
                $('#unitPaymentTermDetailTable > tbody > tr:eq(' + rowIndex + ')').remove();
                _allCheckedUnitRentDetailsArray.splice(rowIndex, 1);
                //rentDetailcheckBoxClicked($(this), rowIndex, rowItem);                          
            }

            dataItem = {}
            $('#unitPaymentTermDetailTable tr').each(function (rowIndex) {
                var $rowReferenct = $(this);
                if (rowIndex > 0) {
                    dataItem = {}
                    var istblQuotationDataCheckboxChecked = $('#unitPaymentTermDetailTabletdCheckbox' + (rowIndex) + '').is(':checked');

                    if (istblQuotationDataCheckboxChecked) {
                        $(this).find('td').each(function () {

                            var className = $(this).attr('class');
                            if (className != undefined) {


                                className = className.substring(2);

                                dataItem[className] = removeAllCommas($(this).text());
                            }
                        });
                        if (rowIndex == 1) {
                            $('#lblLeaseTermRent').val(0);
                            selectedUnitsTotalRent = 0;
                            selectedUnitsTotalSecurityDeposit = 0;
                        }

                        rentDetailcheckBoxClicked($rowReferenct, rowIndex, dataItem);
                    }
                }
            });


        }
        else {

        }
    });
}

datePickerDDMMYYYYFormat('StartDate', true);
datePickerDDMMYYYYFormat('EndDate');
datePickerDDMMYYYYFormat('GraceStartDate');
datePickerDDMMYYYYFormat('GraceEndDate');

//From Clear Function

function clearFormFields(id = 0) {

    $('#LeaseAgreement').find(':input, textarea, table').each(function () {
        //$(':input, textarea').each(function () {
        $(this).val('');
        if ($(this).is('textarea')) {
            $(this).text('');
        }
        if ($(this).is('select')) {
            $(this).val(0);
            $(this).change();
        }
        if ($(this).is(':checkbox')) {
            $(this).prop('checked', false);
        }
        if ($(this).hasClass('datepicker')) {
            $(this).datepicker("setDate", null);
        }
        if ($(this).is('table')) {
            $(this).find('tbody').html('');
        }
        _allCheckedUnitRentDetailsArray = [];
        _leaseAgreementAdditionalChargesArray = [];
        resetFKeyIdentifierLeaseAgreementPaymentScheduleChequDocs();
        clearTableTBodyLeaseAgreementPaymentScheduleChequDocs();
        generatePaymentScheduleTableTHEAD(_leaseAgreementTenantTaxesDetail);
        $('#tblAdditionalCharges>tbody tr').each(function (rowIndexEachLoop, rowValue) {
            var id = parseInt($(this).find('td.tdID').text());
            $('#tblAdditionalChargestdCheckbox' + rowIndexEachLoop + '').prop('checked', false);
        });
    });
    $('#ID').val(id);


}
function addTotalRowToThePaymentSchedule(totalRent = 0, securityDeposit = 0, additionalChargesArray, taxesArray) {
    $('#paymentScheduleTable tbody #totalsRow').remove(0);
    var totalAmountsRow = '';
    var allChequesRent = 0, allChequesAdditionalCharges = 0;

    totalAmountsRow = `<tr class="no-border" style="background-color: transparent;" id="totalsRow">
        <td></td>
        <td></td>
        <td></td>
        <td class="text-end pe-4 fw-medium green">`+ addThousandSeperator(totalRent) + `</td>
        <td class="text-end pe-4 fw-medium green">`+ addThousandSeperator(securityDeposit) + `</td>
        `
    //$.each(taxesArray, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
    //    var taxOnRentPerCheque = (totalRent * parseFloat(rowItemTenantTaxex.Rate) / 100);

    //    totalAmountsRow += `<td class="td` + rowItemTenantTaxex.Code.replace(/\s/g, '_') + ` text-center pr-4 font-weight-bold">` + addThousandSeperator(taxOnRentPerCheque) + `</td >`;

    //    allChequesTax += taxOnRentPerCheque;
    //});

    $.each(taxesArray, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
        var rowRentTax = 0, allChequesTax = 0;
        let tdTaxClass = 'td.td' + rowItemTenantTaxex.Code.replace(/\s/g, '_');
        $('#paymentScheduleTable tr').each(function (rowIndex) {
            if (rowIndex > 0 && $(this).attr('id') != 'totalsRow') {
                rowRentTax = $(this).closest('tr').find(tdTaxClass).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(this).closest('tr').find(tdTaxClass).find('input').val()));
                allChequesTax = parseFloat(allChequesTax) + parseFloat(rowRentTax);
            }
        });
        totalAmountsRow += `<td class="td` + rowItemTenantTaxex.Code.replace(/\s/g, '_') + ` text-end pe-4 fw-medium green">` + addThousandSeperator(allChequesTax) + `</td >`;




    });
    $.each(additionalChargesArray, function (rowAdditionalChargeIndex, rowAdditionalCharge) {
        var rowRentTax = 0, allChequesTax = 0;
        let tdTaxClass = 'td.td' + rowAdditionalCharge.Name.replace(/\s/g, '_');
        $('#paymentScheduleTable tr').each(function (rowIndex) {
            if (rowIndex > 0 && $(this).attr('id') != 'totalsRow') {
                rowRentTax = $(this).closest('tr').find(tdTaxClass).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(this).closest('tr').find(tdTaxClass).find('input').val()));
                allChequesTax = parseFloat(allChequesTax) + parseFloat(rowRentTax);
            }
        });
        totalAmountsRow += `<td class="td` + rowAdditionalCharge.Name.replace(/\s/g, '_') + ` text-end pe-4 fw-medium green">` + addThousandSeperator(allChequesTax) + `</td >`;




    });
    
    //<td class="text-end pe-4 fw-medium green">`+ addThousandSeperator(securityDeposit) + `</td>
    //$.each(additionalChargesArray, function (rowAdditionalChargeIndex, rowAdditionalCharge) {
    //    var additionalTaxes = (parseFloat(rowAdditionalCharge.Amount) * parseFloat(rowAdditionalCharge.TaxRate) / 100);
    //    var additionalAmount = (parseFloat(rowAdditionalCharge.Amount) + parseFloat(additionalTaxes));
    //    var additionalTaxOnPerCheque = (additionalAmount / $('#NoOfPayments').val());
    //    totalAmountsRow += `<td class="td` + rowAdditionalCharge.Name.replace(/\s/g, '_') + ` text-center pr-4 font-weight-bold">` + addThousandSeperator(additionalAmount) + `</td >`;        
    //    allChequesAdditionalCharges += additionalAmount;
    //});
    $('#paymentScheduleTable tbody').append(totalAmountsRow + '</tr>');
}
//End Form Clear Function
// the additional table load and selected additional charge Code

//end Area

function closeAdditionalChargesModal() {
    $('#modalAdditionalCharges').modal('hide');
}