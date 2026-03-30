//Schema
let timesheetDetailSchema = {
    ID: { type: 'hidden' },
    Date: { type: 'text', maxlength: 50, isReadOnly: true },
    Day: { type: 'text', maxlength: 50, isReadOnly: true },
    Employee: { type: 'text', maxlength: 20, isReadOnly: true },
    EmployeeID: { type: 'hidden' },
    Designation: { type: 'text', maxlength: 20, isReadOnly: true },
    StartTime: { type: 'timepicker' },
    EndTime: { type: 'timepicker' },
    BreakHours: { type: 'text', maxlength: 20 },
    TotalHours: { type: 'text', maxlength: 20, isReadOnly: true },
    HourRate: { type: 'text', maxlength: 20 },
    Overtime: { type: 'text', maxlength: 20 },
    Amount: { type: 'text', maxlength: 20, isReadOnly: true },
    ApprovedByID: { type: 'select', options: [] },
    IsInvoiced: { type: 'hidden',  },
    Invoiced: { type: 'text',  },
    Action: { type: 'action', addRowFunction: null, removeRowFunction: null }
};
$(document).ready(function () {
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });

    $(document).on('change input blur', '#TimesheetDetailTableTbody .bha-input', function () {
        debugger;
        let $row = $(this).closest('tr');
        let start = $row.find('.tdStartTime .bha-input').val().trim();
        let end = $row.find('.tdEndTime .bha-input').val().trim();
        let hourRate = $row.find('.tdHourRate .bha-input').val().trim();
        let breaks = $row.find('.tdBreakHours .bha-input').val().trim();
        let overtime = $row.find('.tdOvertime .bha-input').val().trim();

        if (start && end) {
            let amount = 0;
            let startHours = parseTime12Hour(start);
            let endHours = parseTime12Hour(end);

            let diff = endHours - startHours;

            if (diff < 0) {
                //infoToastr("Cheack the time again", "Info");
                //$row.find('.tdTotalHours').text('0');
                //$row.find('.tdTotalHours').text('0');
                //return;
                diff = diff + 24;
            }

            let totalHours = diff - breaks;
            amount = totalHours * hourRate;
            let overtimeAmount = hourRate * overtime;
            amount += overtimeAmount;

            $row.find('.tdTotalHours').text(totalHours.toFixed(2));
            $row.find('.tdAmount').text(addThousandSeperator(amount.toFixed()));
        
        } else {
            $row.find('.tdTotalHours').text('0');
            $row.find('.tdAmount').text('0');
        }
    });
    $(document).on('click', '.fophex-tab-link', function () {
        var tabText = $(this).find('span').text().trim();
        $('#Period').val(tabText);
    });
    $('#btnSave').click(function (e) {
        e.preventDefault();
        saveRecord();
    });
    $('#btnClose').click(function () {
        redirectToTimesheetList();
    });
});
timesheetDateRangePicker('DateRange');
function saveRecord(isCloseAndSaveAsDraft = false) {
    if (customValidateForm('timesheetForm')) {
        debugger;
        var inputJSON = getFormDataAsJSONObject('timesheetForm');
        const picker = $('#DateRange').data('daterangepicker');
        inputJSON.FromDate = picker.startDate.format('YYYY-MM-DD');
        inputJSON.ToDate = picker.endDate.format('YYYY-MM-DD');

        let allTimesheetDetails = getTableRowsBySchema(timesheetDetailSchema, 'TimesheetDetailTableTbody');
        let notInvoiceTimesheetDetail = allTimesheetDetails.filter(row => row.IsInvoiced != 'true')
        inputJSON['Details'] = notInvoiceTimesheetDetail;
        // Check that every row has StartTime and EndTime filled in
        for (let row of inputJSON.Details) {
            if (!row.StartTime || !row.EndTime) {
                infoToastr("Please enter both Start Time and End Time for all rows.", "info");
                return; 
            }
        }
        //  Convert StartTime and EndTime to DB-compatible format (HH:mm:ss)
        inputJSON['Details'] = inputJSON['Details'].map(function (row) {
            if (row.StartTime) row.StartTime = convertTo24Hour(row.StartTime);
            if (row.EndTime) row.EndTime = convertTo24Hour(row.EndTime);
            if (row.Amount) row.Amount = removeAllCommas(row.Amount);
            return row;
        });
        console.log(inputJSON);
        ajaxRequest({ url: "/Services/Timesheet/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });

    }
}
function saveRecordCallBack(responseJSON, options) {
    if (responseJSON.IsSuccess) {
        $('#ID').val(responseJSON.resultJSON);
        console.log(responseJSON.resultJSON)
        successToastr("The Timesheet has been saved", 'success');

        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/Services/Timesheet/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
            }, 2000);
        }

    }
    else {
        errorToastr("", responseJSON.Message, responseJSON);
    }
}
function formatTimeObjectTo12Hour(timeObj) {
    if (!timeObj || typeof timeObj !== 'object') return '';

    let hours = timeObj.Hours;
    let minutes = timeObj.Minutes;
    let modifier = 'AM';

    if (hours >= 12) {
        modifier = 'PM';
        if (hours > 12) hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${modifier}`;
}
function parseTime12Hour(timeStr) {
    // Example: "10:30 AM" or "12:15 PM"
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours + minutes / 60; // decimal hours
}
function convertTo24Hour(time12h) {
    if (!time12h) return null;

    let [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier && modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier && modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

    // Ensure 2-digit format (e.g. 04:09 PM → "16:09:00")
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
}

//Btn Close Code
function redirectToTimesheetList() {
    swal.fire({
        title: "",
        text: 'Do you want save changes?',
        type: 'info',
        cancelButtonColor: '#F04249',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        dangerMode: true,
        allowOutsideClick: false,
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                saveRecord(true);
            }
            else {
                window.location.href = '/Services/Timesheet/List?FID=fVZFcZW3+pwAgWyGPOtYrg==&ModuleID=stgRMCl4UuaRIz1dElDqYA==';
            }
        });

};
//Btn Close End Code

function updateIsInvoicedBadges(tbodyId) {

    $(`#${tbodyId} tr`).each(function () {
        var $tr = $(this);
        var $td = $(this).find('td.tdIsInvoiced');
        var $tdInvoiced = $(this).find('td.tdInvoiced');
        var value = $td.text();

        if (value == 'true' || value == '1') {
            $tdInvoiced.html('<span class="badge rounded-pill bg-success" style="color:white;padding:5px 12px;font-size:12px;width: 78px;">Yes</span>');

            $tr.find('td.tdHourRate input').attr('readonly', true).addClass('readonly');
            $tr.find('td.tdBreakHours input').attr('readonly', true).addClass('readonly');
            $tr.find('td.tdStartTime input').attr('readonly', true).addClass('readonly');
            $tr.find('td.tdEndTime input').attr('readonly', true).addClass('readonly');
            $tr.find('td.tdOvertime input').attr('readonly', true).addClass('readonly');
            $tr.find('td.tdApprovedByID select').attr('disabled', true).addClass('readonly');

        } else {
            $tdInvoiced.html('<span class="badge rounded-pill bg-danger" style="color:white;padding:5px 12px;font-size:12px;width: 78px;">No</span>');
        }

    });

}