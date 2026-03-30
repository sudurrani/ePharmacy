var _leaseAgreementTenantTaxesDetail = [], isLatestLeaseAgreementLoaded = true, isLoadUnitLeaseAgreementExceptLatestDropdownList = false;
var _leaseAgreementID = 0;
var leaseAgreemenAdditionalCharges = [], _leaseAgreementTenantTaxes = [];
var getLeaseAgreementGetByIdCallBack = function (responseJSON) {
    if (responseJSON.resultJSON != null) {
        if (responseJSON.resultJSON.LeaseAgreement.Status == 'Executed') {
            leaseAgreemenAdditionalCharges = responseJSON.resultJSON.AdditionalCharges;


            $('#AgreementNo').text(responseJSON.resultJSON.AgreementNo);
            setResponseToFormInputs(responseJSON.resultJSON.LeaseAgreement, ['ID', 'PropertyID', 'NoOfPayments', 'TotalAmount']);
            $('#StartDate').val(getFormattedDate(responseJSON.resultJSON.LeaseAgreement.StartDate));
            $('#EndDate').val(getFormattedDate(responseJSON.resultJSON.LeaseAgreement.EndDate));
            if (!isLoadUnitLeaseAgreementExceptLatestDropdownList) {
                loadUnitLeaseAgreementExceptLatestDropdownList($('#ID').val(), $('#LatestLeaseAgreementID').val(), 0);
                isLoadUnitLeaseAgreementExceptLatestDropdownList = true;
            }

            paymentScheduleDataSetting(_leaseAgreementTenantTaxes, leaseAgreemenAdditionalCharges);
        }
    } else {
        $('#AgreementNo').val('');
    }
}

var getLeaseAgreementPaymentGetByIdCallBack = function (responseJSON) {
    paymentScheduleDataSetting(responseJSON.resultJSON, []);
}
function getPaymentScheduleTableData() {
    var paymentScheduleJSONArray = [];
    $('#paymentScheduleTable tr').each(function (rowIndex) {
        let self = this;
        if (rowIndex > 0) {
            var taxesJSONArray = [];
            var taxesJSONObject = {}
            taxesJSONObject = {};
            $.each(_leaseAgreementTenantTaxesDetail, function (tenantTaxRowIndex, tenantTaxRowItem) {
                for (let key in tenantTaxRowItem) {
                    //tr += `<td class="td` + key + `">` + rowItemTenantTaxex[key] + `</td>`;
                    //netAmount = netAmount + parseFloat(rowItemTenantTaxex[key]);

                    var tdWithClass = 'td.td' + key + '';
                    taxesJSONObject[key] = $(self).find(tdWithClass).text();
                }


            });

            taxesJSONArray.push(taxesJSONObject);

            var paymentScheduleJSONObject = {
                ID: 0,
                ChequeNo: $(this).find('td.tdChequeNo').find('input').val(),
                ChequeDate: $(this).find('td.tdChequeDate').find('input').val(),
                Rent: removeAllCommas($(this).find('td.tdRent').text()),
                SecurityDeposit: removeAllCommas($(this).find('td.tdSecurityDeposit').text()),
                Taxes: JSON.stringify(taxesJSONArray),
                Total: removeAllCommas($(this).find('td.tdTotal').text())
            }
            paymentScheduleJSONArray.push(paymentScheduleJSONObject);
        }
    });
    return paymentScheduleJSONArray;
}

//Get Latest Agreement function
function getLatestAgreement() {
    ajaxRequest({ url: '/RealEstate/Unit/GetLatestAgreement', type: 'POST', data: { UnitID: $('#ID').val() }, callBack: getLatestAgreementCallBack });
}
var getLatestAgreementCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        if (responseJSON.resultJSON.length > 0) {
            $('#NoOfPayments').val(responseJSON.resultJSON[0].NoOfPayments);
            $('#TotalAmount').val(addThousandSeperator(responseJSON.resultJSON[0].TotalAmount));
            let latestLeaseAgreementID = responseJSON.resultJSON[0].LeaseAgreementID;
            //getFormattedDate(responseJSON.resultJSON.LeaseAgreement.StartDate);
        }
    }
    else {
        errorToastr(responseJSON.Message, "error");
    }

    if (responseJSON.resultJSON.length > 0) {
        _leaseAgreementTenantTaxes = responseJSON.resultJSON;
        /*paymentScheduleDataSetting(responseJSON.resultJSON, leaseAgreemenAdditionalCharges);*/

        $('#LatestLeaseAgreementID').val(responseJSON.resultJSON[0].LeaseAgreementID);
        ajaxRequest({ url: '/RealEstate/LeaseAgreement/GetByID', type: 'POST', data: { ID: responseJSON.resultJSON[0].LeaseAgreementID }, callBack: getLeaseAgreementGetByIdCallBack });
        let latestAgreementNo = responseJSON.resultJSON[0].AgreementNo;
        //$('#AgreementNo').val(latestAgreementNo);
    }


}
var paymentScheduleDataSetting = function (resultJSON = [], additionalCharges) {
    $('#paymentScheduleTable tbody').html('');
    $('#TotalAmount').val(0);
    $('#NoOfPayments').val(0);
    if (resultJSON.length > 0) {
        LeaseAgreementID = resultJSON[0].LeaseAgreementID;
        _leaseAgreementID = LeaseAgreementID;
        $('#TotalAmount').val(addThousandSeperator(resultJSON[0].TotalAmount));
        if (isLatestLeaseAgreementLoaded) {

            $('#LeaseAgreementID').val(0);
            $('#LeaseAgreementID').change();
        }
        else {
            //$('#AgreementNo').val('');
        }

        let netAmount = 0;
        $.each(resultJSON, function (rowIndex, rowItem) {
            //console.log(rowItem);
            //<td class="tdChequeNo"> ${(rowItem.ChequeNo == null ? '' : rowItem.ChequeNo) + ` ` + (isLatestLeaseAgreementLoaded == true ? '' : 'readonly') }</td>
            //<td class="tdChequeDate"> ${(rowItem.ChequeDate == null ? '' : getFormattedDate(rowItem.ChequeDate)) + ` ` + (isLatestLeaseAgreementLoaded == true ? '' : 'readonly')}</td>
            var tr = `
            <tr>
            <td class="tdSN text-center">`+ (rowIndex + 1) + `</td>
            <td class="tdID" hidden>`+ rowItem.ID + `</td>
            <td class="tdChequeNo"> ${(rowItem.ChequeNo == null ? '' : rowItem.ChequeNo)}</td>
            <td class="tdChequeDate"> ${(rowItem.ChequeDate == null ? '' : getFormattedDate(rowItem.ChequeDate))}</td>
            <td class="tdRent text-end">`+ addThousandSeperator(rowItem.Rent) + `</td>
            <td class="tdSecurityDeposit  text-end">`+ addThousandSeperator(rowItem.SecurityDeposit) + `</td>`

            var taxesArray = JSON.parse(rowItem.Taxes);
            $.each(taxesArray, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
                for (var key in rowItemTenantTaxex) {
                    tr += `<td class="td` + key + `  text-end">` + rowItemTenantTaxex[key] + `</td>`;
                    netAmount = netAmount + parseFloat(rowItemTenantTaxex[key]);
                }
            });
            if (additionalCharges.length > 0) {
                $.each(additionalCharges, function (rowIndexAdditionalCharges, rowItemAdditionalCharges) {
                    tr += `<td class="td` + rowItemAdditionalCharges.Name.replace(/\s/g, '_') + `  text-end">` + addThousandSeperator(rowItemAdditionalCharges.TotalAmount) + `</td>`;
                    //for (var key in rowItemAdditionalCharges) {
                    //    tr += `<td class="td` + key + `">` + rowItemAdditionalCharges[key] + `</td>`;
                    //    //netAmount = netAmount + parseFloat(rowItemTenantTaxex[key]);
                    //}
                });
            }
            else {
                var charges = JSON.parse(rowItem.Charges);
                $.each(charges, function (rowIndex, rowItem) {
                    for (var key in rowItem) {
                        tr += `<td class="td` + key + `  text-end">` + rowItem[key] + `</td>`;
                    }
                });
            }
            tr += `<td class="tdTotal text-end">` + addThousandSeperator(rowItem.Total) + `</td></tr>`;
            $('#paymentScheduleTable tbody').append(tr);

            if (rowIndex == 0) {
                generatePaymentScheduleTableTHEAD(JSON.parse(rowItem.Taxes), leaseAgreemenAdditionalCharges);
                _leaseAgreementTenantTaxesDetail = JSON.parse(rowItem.Taxes);
            }
            netAmount = netAmount + parseFloat(rowItem.Rent) + parseFloat(rowItem.SecurityDeposit);
        });
        $('#TotalAmount').val(addThousandSeperator(netAmount));
        $('#NoOfPayments').val(resultJSON.length);
        getHeader(LeaseAgreementID);
    }
}
function generatePaymentScheduleTableTHEAD(tenantTaxesArray, additionalChargesArray) {

    var tr = `
    <tr role="row">
        <th id="thSerialNo" class="text-center">Sr.No<i class="bi bi-chevron-expand sort-icon"></i></th>
        <th id="thID" hidden>ID</th>
        <th id="thChequeNo">Cheque No<i class="bi bi-chevron-expand sort-icon"></i></th>
        <th id="thChequeDate">Cheque Date<i class="bi bi-chevron-expand sort-icon"></i></th>
        <th id="thRent" class="text-end">Rent<i class="bi bi-chevron-expand sort-icon"></i></th>
        <th id="thSecurityDeposit" class="text-end">Security Deposit<i class="bi bi-chevron-expand sort-icon"></i></th>
        `

    $.each(tenantTaxesArray, function (rowIndexTenantTaxex, rowItemTenantTaxex) {
        for (var key in rowItemTenantTaxex) {
            tr += `<th id="th` + key + `" class="text-end">` + key + `<i class="bi bi-chevron-expand sort-icon"></i></th>`;
        }
    });
    $.each(additionalChargesArray, function (rowIndexAdditionalCharges, rowItemAdditionalCharges) {
        //for (var key in rowItemAdditionalCharges) {
        //    console.log(rowItemAdditionalCharges[key].Name);
        //tr += `<th id="th` + key + `">` + key + `</th>`;
        //}
        tr += `<th id="th` + rowItemAdditionalCharges.Name + `" class="text-end">` + rowItemAdditionalCharges.Name + `<i class="bi bi-chevron-expand sort-icon"></i></th>`;

    });

    tr += `<th id="thPaymentFrequencyName" class="text-end">Total<i class="bi bi-chevron-expand sort-icon"></i></th></tr>`;

    $('#paymentScheduleTable thead').html(tr);
}
function getHeader(leaseAgreementID) {
    _leaseAgreementID = leaseAgreementID;
    ajaxRequest({ url: '/RealEstate/LeaseAgreementPaymentSchedule/GetHeader', type: 'POST', data: { LeaseAgreementID: leaseAgreementID }, callBack: getHeaderCallBack });
}
var getHeaderCallBack = function (responseJSON) {

    if (responseJSON.IsSuccess && responseJSON.resultJSON != null) {
        $('#PaymentModeID').val(responseJSON.resultJSON.PaymentModeID);
        $('#PaymentModeID').change();
        $('#TotalAmount').val(addThousandSeperator(responseJSON.resultJSON.TotalAmount));
        $('#NoOfPayments').val(responseJSON.resultJSON.NoOfPayments);

    }

}
//END Get Latest Agreement function
function viewLeaseAgreement() {
    redirectToActionPlainId("/RealEstate/LeaseAgreement/Preview?isOnlyPreview=true&id=", _leaseAgreementID, "_blank");
}