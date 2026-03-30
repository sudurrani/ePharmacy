var additionalArray = 0;
var isAdditionalChargesLoaded = false;
$(document).ready(function () {    
    $('#paymentScheduleAndTotalAmountsContainer').css('display', '');
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {
        getAndDecryptID(urlParams.get('ID'));
    }
});
var getAndDecryptIDCallBack = function (responseJSON) {
    $('#ID').val(responseJSON);
    getLeaseAgreementPaymentScheduleChequDocsUploadedFilesByFKey(responseJSON);
    ajaxRequest({ url: '/RealEstate/LeaseAgreement/GetByID', type: 'POST', data: { ID: responseJSON }, callBack: getLeaseAgreementByIdCallBack });
   
}
function getPropertyById(propertyID = 0) {
    ajaxRequest({ url: '/RealEstate/Unit/GetPropertyDetailByID', type: 'POST', data: { ID: propertyID }, callBack: getPropertyByIdCallBack }, null, false);
}
var getPropertyByIdCallBack = function (responseJSON) {
    
    responseJSON.resultJSON['TenancyState'] = responseJSON.resultJSON.State;
    responseJSON.resultJSON['TenancyTownship'] = responseJSON.resultJSON.Township;
    responseJSON.resultJSON['TenancyRoad'] = responseJSON.resultJSON.Road;
    responseJSON.resultJSON['TenancyStreet'] = responseJSON.resultJSON.Street;
    
    setResponseToFormInputs(responseJSON.resultJSON);
}
var getLeaseAgreementByIdCallBack = function (responseJSON) {
    setResponseToFormInputs(responseJSON.resultJSON.LeaseAgreement);
    //loadLeaseTermTemplateDropdownList('LeaseTermTemplateID', responseJSON.resultJSON.LeaseAgreement.LeaseTermTemplateID);
    loadLeaseTermTemplateAgreementDropdownList('LeaseTermTemplateID', responseJSON.resultJSON.LeaseAgreement.LeaseTermTemplateID);
    loadTenantDropdownList('TenantID', responseJSON.resultJSON.LeaseAgreement.TenantID);

    //loadPropertyDropdownList('PropertyID', responseJSON.resultJSON.PropertyID);
    loadPropertyDropdownList('PropertyID', 0);
    //loadCurrencyDropdownList('CurrencyID', responseJSON.resultJSON.CurrencyID);


    //=====loadCurrencyDropdownList('CurrencyID', 0);


    //loadUnitByPropertyIDDropdownList('UnitID', responseJSON.resultJSON.UnitID, responseJSON.resultJSON.PropertyID);
    //$('#PropertyID').trigger({
    //    type: 'select2:select',
    //    params: {
    //        data: {
    //            id: responseJSON.resultJSON.PropertyID,
    //            unitID: responseJSON.resultJSON.UnitID,
    //        }
    //    }
    //});
    $('#TenantID').trigger({
        type: 'select2:select'
    });
    getLeaseAgreementRentDetail();
    _leaseAgreementAdditionalChargesDetail = responseJSON.resultJSON.AdditionalCharges;
    _leaseAgreementAdditionalChargesArray = responseJSON.resultJSON.AdditionalCharges;

    _leaseAgreementTenantTaxesDetail = responseJSON.resultJSON.Taxes;
    
    generatePaymentScheduleTableTHEAD(_leaseAgreementTenantTaxesDetail, _leaseAgreementAdditionalChargesDetail);
    //loadUnitByPropertyIDDropdownList('UnitID', responseJSON.resultJSON.UnitID, responseJSON.resultJSON.PropertyID);
    //$('#TenantID').trigger('select.select2');

}
function getLeaseAgreementRentDetail() {
    ajaxRequest({ url: '/RealEstate/LeaseAgreement/GetRentDetail', type: 'POST', data: { ID: $('#ID').val() }, callBack: getLeaseAgreementRentDetailCallBack });
}
var getLeaseAgreementRentDetailCallBack = function (responseJSON) {

    if (responseJSON.IsSuccess) {
        if (responseJSON.resultJSON.length > 0) {


            //generateHTMLTableRowsFromJSONWithCheckbox(responseJSON.resultJSON, 'unitRentDetailTable', null, null, 0);

            _allCheckedUnitRentDetailsArray = responseJSON.resultJSON;

            $('#lblLeaseTermSecurityDeposit').val(addThousandSeperator(responseJSON.resultJSON[0].SecurityDepositAmount));
            $('#lblLeaseTermTotal').text(addThousandSeperator(responseJSON.resultJSON[0].TotalAmount));
            $('#TotalAmount').text(responseJSON.resultJSON[0].TotalAmount);
            generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'unitPaymentTermDetailTable', null, null, null, 0, 'rentDetailcheckBoxClicked', ["Amount", "SecurityDepositAmount"], action);

            checkAllCheckBoxesInTable('unitPaymentTermDetailTable');
            getLeaseAgreementPaymentSchedule(responseJSON.resultJSON);
            _lastCheckedPaymentFrequencyDays = _allCheckedUnitRentDetailsArray[(_allCheckedUnitRentDetailsArray.length - 1)].FrequencyDays;

            


            /* Commented code is moved into getLeaseAgreementPaymentSchedule function
            $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {
                //rentDetailcheckBoxClicked(null, rowIndex, rowItem);


                //leaseTermCalculation(true, rowItem);
                leaseTermCalculationUpdate(true, rowItem);
                _unitsJSONArray.push(rowItem.UnitID);
                _selectedUnitInputJSONArray.push({ 'ID': rowItem.UnitID });
            });renderPaymentScheduleHTML
           */
            $('#unitPaymentTermDetailTableContainer').css('display', '');
            $('.TaxesWithChargesContainer').removeClass('d-none');
        }
    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}
function getLeaseAgreementPaymentSchedule(leaseAgreementRentDetail = []) {
    ajaxRequest({ url: '/RealEstate/LeaseAgreementPaymentSchedule/GetByLeaseAgreementID', type: 'POST', data: { LeaseAgreementID: $('#ID').val() }, callBack: getLeaseAgreementPaymentScheduleCallBack, _leaseAgreementRentDetail: leaseAgreementRentDetail });
}
var getLeaseAgreementPaymentScheduleCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        renderPaymentScheduleHTML(responseJSON.resultJSON.Detail);
        $('#lblLeaseTermRent').val(addThousandSeperator(responseJSON.resultJSON.Header.Rent));
        $('#lblLeaseTermSecurityDeposit').val(addThousandSeperator(responseJSON.resultJSON.Header.SecurityDeposit));
        selectedUnitsTotalSecurityDeposit = responseJSON.resultJSON.Header.SecurityDeposit;
        totalFromRentSecurityTaxes();
        $.each(options._leaseAgreementRentDetail, function (rowIndex, rowItem) {
            //rentDetailcheckBoxClicked(null, rowIndex, rowItem);


            //leaseTermCalculation(true, rowItem);
            //leaseTermCalculationUpdate(true, rowItem);
            _unitsJSONArray.push(rowItem.UnitID);
            _selectedUnitInputJSONArray.push({ 'ID': rowItem.UnitID });
        });
        //renderNoOfPaymentsChequeHTMLUpdate(responseJSON.resultJSON.Header.NoOfPayments, false, scheduleFrequency = 0, _leaseAgreementAdditionalChargesArray);
        
        addTotalRowToThePaymentSchedule(responseJSON.resultJSON.Header.Rent, responseJSON.resultJSON.Header.SecurityDeposit, _leaseAgreementAdditionalChargesArray, _leaseAgreementTenantTaxesDetail);
    }

}
var leaseTermCalculationUpdate = function (isSelected, rowItem) {
    if (isSelected) {
        selectedUnitsTotalRent = parseFloat(selectedUnitsTotalRent) + parseFloat(rowItem.Amount);
        selectedUnitsTotalSecurityDeposit += parseFloat(rowItem.SecurityDepositAmount);
    }
    else {
        selectedUnitsTotalRent -= parseFloat(rowItem.Amount);
        selectedUnitsTotalSecurityDeposit -= parseFloat(rowItem.SecurityDepositAmount);
    }
    $('#additionalTaxesContainer').html('');
    //$('#additionalAmountContainer').html('');
    $('#tenantTaxesContainer').html('');
    //$('#lblLeaseTermRent').val(addThousandSeperator(selectedUnitsTotalRent));
    //$('#lblLeaseTermSecurityDeposit').val(addThousandSeperator(selectedUnitsTotalSecurityDeposit));
    _tenantTotalTaxes = 0;
    _leaseAgreementPaymentScheduleHeaderTaxesJSONArray = [];
    _leaseAgreementPaymentScheduleAdditionalTaxesJSONArray = [];
    _leaseAgreementTenantTaxes = [];

    var totalAmount = totalFromRentSecurityTaxes();
    //var _totalAdditionalCharges = additionalChargesTotalAndDesignGeneration();
    leaseTermTotal = totalAmount;

    //totalAmount = totalAmount + _totalAdditionalCharges

    $('#lblLeaseTermTotal').text(addThousandSeperator(totalAmount));
    $('#TotalAmount').val(totalAmount);
}
var renderPaymentScheduleHTML = function (paymentScheduleArray = []) {
    let netTotal = 0;

    let thiss = this.event;

    $('#NoOfPayments').val(paymentScheduleArray.length);
    _selectedUnitsNoOfPayments = paymentScheduleArray.length;
    $('#paymentScheduleAndTotalAmountsContainer').css('display', '');
    $('#paymentScheduleTable tbody').html('');
    $.each(paymentScheduleArray, function (rowIndex, rowItem) {        
        //if (isNaN(Date.parse(rowItem.ChequeDate))) {
        if (rowItem.ChequeDate.indexOf('Date') > 0) {
            if (rowItem.ChequeDate.length > 8) {
                rowItem.ChequeDate = getFormattedDate(rowItem.ChequeDate)
            }

        }       
        
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
                //tr += `<td class="td` + key.replace(' ', '_') + ` text-right pr-4">` +(rowItemTenantTaxex[key]) + `</td>`;

                tr += `<td class="td` + key.replace(/\s/g, '_') + ` text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end" value="` + (rowItemTenantTaxex[key]) + `" onkeyup="paymentScheduleTaxesReCalculation(this,` + rowIndex + `);"
                        onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                        /></div></td>`;
            }
        });
      
        $.each(additionalArray, function (rowIndexAdditionalCharge, rowItemAdditionalCharge) {        
            for (var key in rowItemAdditionalCharge) { 
                if (key === "IsRecoverInFirstCheque") continue;
                //tr += `<td class="td` + key.replace(' ','_') + ` text-right pr-4">` + addThousandSeperator(rowItemAdditionalCharge[key]) + `</td>`;
                tr += `<td class="td` + key.replace(/\s/g, '_') + ` text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end keyUpEventClassForPaymentSchedule" value="` + (addThousandSeperator(rowItemAdditionalCharge[key])) + `" onkeyup="paymentScheduleAdditionalChargesReCalculation(this,` + rowIndex + `);
                        onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                        "/></div></td>`;
            }
        });

        tr += `<td class="tdTotal text-end pe-4 fw-medium">` + addThousandSeperator(rowItem.Total) + `</td>`;

        // Invoice Checkbox
        tr += ($('#Status').val() === 'Executed' ? '<td class="tdIsInvoiced"><input type="checkbox" class="form-check-input" style="font-size:16px;"></td>' : '<td class="tdIsInvoiced" style="display:none;"><input type="checkbox" class="form-check-input" style="font-size:16px;"></td>') 
        tr += '</tr>'

        $('#paymentScheduleTable tbody').append(tr);
        netTotal = (netTotal + rowItem.Total);
    });
    $('#lblPaymentScheduleTotal').text(addThousandSeperator(netTotal));
    $('#lblLeaseTermTotal').text(addThousandSeperator(netTotal));    
    addTotalRowToThePaymentSchedule(removeAllCommas($('#lblLeaseTermRent').val()), removeAllCommas($('#lblLeaseTermSecurityDeposit').val()), _leaseAgreementAdditionalChargesArray, _leaseAgreementTenantTaxesDetail);
}
var renderNoOfPaymentsChequeHTMLUpdate = function (noOfPayments, isFromInput = false, scheduleFrequency = 0, _leaseAgreementAdditionalChargesArray) {   
    let thiss = this.event;
    $('#paymentScheduleTable tbody').html('');
    var description = '', netTotal = 0;
    _leaseAgreementPaymentSchedule = [];
    var scheduleFrequencyDate = $('#StartDate').datepicker('getDate');//new Date();
    var rentPerCheque = (selectedUnitsTotalRent / parseFloat(noOfPayments));

    for (let count = 1; count <= noOfPayments; count++) {
        //var day = $('#StartDate').datepicker('getDate');
        let scheduleFrequencyDateVal = scheduleFrequencyDate.getDate() + "/" + (scheduleFrequencyDate.getMonth() + 1) + "/" + scheduleFrequencyDate.getFullYear();
        //let perChequeTotal = rentPerCheque + (count == 1 ? selectedUnitsTotalSecurityDeposit : 0); 
        let perChequeTotal = rentPerCheque + (count == 1 ? parseFloat(removeAllCommas($('#lblLeaseTermSecurityDeposit').val())) : 0);
        var tr = `
        <tr>
            <td class="tdSN">`+ count + `</td>
            <td class="tdID" hidden>0</td>            
            <td class="tdChequeNo"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px ChequeNo"/></div></td>
            <td class="tdChequeDate"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px ChequeDate" value="`+ scheduleFrequencyDateVal + `"/></div></td>
           <td class="tdRent text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end keyUpEventClassForPaymentSchedule" value="`+ addThousandSeperator(rentPerCheque) + `" "
           onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
           /></div></td>
           <td class="tdSecurityDeposit text-end"<div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end keyUpEventClassForPaymentSchedule " value="`+ (count == 1 ? addThousandSeperator(parseFloat(removeAllCommas($('#lblLeaseTermSecurityDeposit').val()))) : 0) + `"
           onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"/></div></td>
          
            
        `
        $.each(_leaseAgreementTenantTaxesDetail, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
            var taxOnRentPerCheque = (rentPerCheque * parseFloat(rowItemTenantTaxex.Rate) / 100);
            //tr += `<td class="td` + rowItemTenantTaxex.Code.replace(' ', '_') + ` text-right pr-4">` + addThousandSeperator(taxOnRentPerCheque) + `</td>`;
            tr += `<td class="td` + rowItemTenantTaxex.Code.replace(/\s/g, '_') + ` text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end" value="` + addThousandSeperator(taxOnRentPerCheque) + `" onkeyup="paymentScheduleTaxesReCalculation(this,` + (count - 1) + `);"
            onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
            /></div></td>`;
            perChequeTotal += taxOnRentPerCheque;
        });

        /*  $.each(_leaseAgreementAdditionalChargesDetail, function (rowAdditionalChargeIndex, rowAdditionalCharge) {*/
     
        $.each(_leaseAgreementAdditionalChargesArray, function (rowAdditionalChargeIndex, rowAdditionalCharge) {
            var additionalTaxes = (parseFloat(rowAdditionalCharge.Amount) * parseFloat(rowAdditionalCharge.TaxRate) / 100);
            var additionalAmount = (parseFloat(rowAdditionalCharge.Amount) + parseFloat(additionalTaxes));
            var additionalTaxOnPerCheque = (additionalAmount / noOfPayments);
            //tr += `<td class="td` + rowAdditionalCharge.Name.replace(' ', '_') + ` text-right pr-4">` + addThousandSeperator(additionalTaxOnPerCheque) + `</td>`;
            tr += `<td class="td` + rowAdditionalCharge.Name.replace(/\s/g, '_') + ` text-end"><div class="selector margin-top-0"><input type="text" class="js-states form-control bha-input w-100 ps-2 pe-2 mt-0 lh-18px text-end" value="` + addThousandSeperator(additionalTaxOnPerCheque) + `" onkeyup="paymentScheduleAdditionalChargesReCalculation(this,` + (count - 1) + `);"
            onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
            /></div></td>`;
            perChequeTotal += additionalTaxOnPerCheque;
        });
        tr += `<td class="tdTotal text-end pe-4 fw-medium">` + addThousandSeperator(perChequeTotal) + `</td></tr>`;
        tr += `<td class="tdTotal text-end pe-4 fw-medium">` + addThousandSeperator(perChequeTotal) + `</td>`;
        netTotal = netTotal + perChequeTotal;

        // Invoice Checkbox
        
        tr += '</tr>'

        $('#paymentScheduleTable tbody').append(tr);

        _leaseAgreementPaymentSchedule.push({
            ID: 0
            , Description: description
            , ChequeDate: scheduleFrequencyDateVal
            , ChequeNo: null
            , ChequeAmount: 0
            , ChequeReceiving: null


        });
        scheduleFrequencyDate = new Date(scheduleFrequencyDate.setMonth(scheduleFrequencyDate.getMonth() + scheduleFrequency));

    }
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
datePickerDDMMYYYYFormat('StartDate');
datePickerDDMMYYYYFormat('EndDate');
datePickerDDMMYYYYFormat('GraceStartDate');
datePickerDDMMYYYYFormat('GraceEndDate');
/*
function paymentScheduleAdditionalChargesReCalculation(requestedRow, rowIndex) {
    let netTotal = 0;
    let rowCharges = $(requestedRow).closest('tr').find('.tdRent').find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdRent').find('input').val());
    let rowSecurityDeposit = $(requestedRow).closest('tr').find('.tdSecurityDeposit').find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdSecurityDeposit').find('input').val());
    //let rowTotal = $(requestedRow).closest('tr').find('.tdTotal').text();
    let rowTotal = parseFloat(rowCharges) + parseFloat(rowSecurityDeposit);


    $.each(_leaseAgreementTenantTaxesDetail, function (rowIndexTenantTaxex, rowItemTenantTaxex) {

        let tdTaxClass = '.td' + rowItemTenantTaxex.Code.replace(' ', '_');
        //let rowRentTax = (rowRent * parseFloat(rowItemTenantTaxex.Rate) / 100);
        rowRentTax = $(requestedRow).closest('tr').find(tdTaxClass).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(requestedRow).closest('tr').find(tdTaxClass).find('input').val()));

        //$(requestedRow).closest('tr').find(tdTaxClass).text(addThousandSeperator(rowRentTax));
        //$(requestedRow).closest('tr').find(tdTaxClass).find('input').val(addThousandSeperator(rowRentTax));

        rowTotal = parseFloat(rowTotal) + parseFloat(rowRentTax);


    });

    let trAdditionalChargesTotal = 0;
    $.each(_leaseAgreementAdditionalChargesArray, function (rowAdditionalChargeIndex, rowAdditionalCharge) {

        //console.log('rowAdditionalCharge : ' + JSON.stringify(rowAdditionalCharge));
        let additionalChargestdClassName = '.td' + rowAdditionalCharge.Name.replace(' ', '_');
        //let trAdditionalCharges = $(requestedRow).closest('tr').find('.' + additionalChargestdClassName).text();
        let trAdditionalCharges = $(requestedRow).closest('tr').find(additionalChargestdClassName).find('input').val() == '' ? 0 : parseFloat(removeAllCommas($(requestedRow).closest('tr').find(additionalChargestdClassName).find('input').val()));
        trAdditionalChargesTotal = trAdditionalChargesTotal + parseFloat(trAdditionalCharges);
        //            find('input').val() == '' ? 0 : removeAllCommas($(requestedRow).closest('tr').find('.tdRent').find('input').val());
    });
    rowTotal = rowTotal + trAdditionalChargesTotal;
    $(requestedRow).closest('tr').find('.tdTotal').text(addThousandSeperator(rowTotal));


    $('#paymentScheduleTable tr').each(function (rowIndex) {
        if (rowIndex > 0) {
            netTotal = (netTotal + parseFloat(removeAllCommas($(this).find('td.tdTotal').text())));
        }
    });

    $('#lblPaymentScheduleTotal').text(addThousandSeperator(netTotal));
}

*/
