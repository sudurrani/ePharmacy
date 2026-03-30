function getNumber() {
    ajaxRequest({ url: '/JobRequestCenter/MaintenanceRequest/GetNumber', type: 'POST', data: {}, callBack: getNumberCallBack }, null, false);
}
var getNumberCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#RequestNo').val(responseJSON.resultJSON.Number);
        $('#RequestNo').prop('readonly', true);
    }
    else {
        $('#RequestNo').prop('readonly', false);
    }
}