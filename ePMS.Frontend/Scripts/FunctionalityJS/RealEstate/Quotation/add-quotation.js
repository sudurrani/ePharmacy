$(document).ready(function () {
    getNumber();
});
function getNumber() {
    ajaxRequest({ url: '/RealEstate/Quotation/GetNumber', type: 'POST', data: {}, callBack: getNumberCallBack }, null, false);
}
var getNumberCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#QuotationNumber').val(responseJSON.resultJSON.Number);
        $('#QuotationNumber').prop('readonly', true);
    }
    else {
        $('#QuotationNumber').prop('readonly', false);
    }
}